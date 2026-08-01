"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Send, CheckCircle2, XCircle, Building2, Sparkles, Loader2,
  ExternalLink, Copy, AlertTriangle, Check, History, ShieldCheck, PenLine
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "@/components/Toast";

interface CompanyContact {
  company: string;
  domain: string;
  toEmail: string;
  role: string;
  location: string;
  applyUrl: string;
  source: string;
  isDerived: boolean;
  matchScore: number;
  jobCount: number;
  description: string;
  companyLogo: string;
  otherRoles: string[];
  draftSubject: string;
  draftBody: string;
}

interface SentEmail {
  id: string; toEmail: string; toName: string; company: string; role: string;
  subject: string; status: string; sentAt: string;
}

export default function EmailCampaignPage() {
  const { user, loading: authLoading, logout } = useAuth();

  const [companies, setCompanies] = useState<CompanyContact[]>([]);
  const [config, setConfig] = useState<{ configured: boolean; host?: string }>({ configured: false });
  const [totalHiring, setTotalHiring] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [recipientEmails, setRecipientEmails] = useState<Record<string, string>>({});

  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [draftTouched, setDraftTouched] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; details: any[] } | null>(null);

  const [history, setHistory] = useState<SentEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      try {
        const [cRes, hRes] = await Promise.all([
          fetch("/api/email/companies"),
          fetch("/api/email/send"),
        ]);
        const cData = await cRes.json();
        const hData = await hRes.json();
        if (!cancelled) {
          setCompanies(Array.isArray(cData.companies) ? cData.companies : []);
          setConfig(cData.config || { configured: false });
          setTotalHiring(cData.totalHiring || 0);
          setHistory(Array.isArray(hData.emails) ? hData.emails : []);
          if (user) {
            setFromName(user.name || "");
            setFromEmail(user.email || "");
          }

          const params = new URLSearchParams(window.location.search);
          const qCompany = params.get("company");
          if (qCompany) {
            const list = Array.isArray(cData.companies) ? cData.companies : [];
            const match = list.find((c: any) => c.company.toLowerCase() === qCompany.toLowerCase());
            if (match) setSelected(new Set([match.company]));
          }
        }
      } catch (e) { console.error("email campaign load", e); }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  const selectedList = companies.filter(c => selected.has(c.company));

  const tokenize = (s: string, company: string, role: string) =>
    s.split(company).join("{{company}}").split(role).join("{{role}}");

  const applyTokens = (template: string, company: string, role: string) =>
    template.split("{{company}}").join(company).split("{{role}}").join(role);

  const resetDraftFrom = useCallback(() => {
    if (selectedList.length === 0) return;
    const first = selectedList[0];
    setCustomSubject(tokenize(first.draftSubject, first.company, first.role));
    setCustomBody(tokenize(first.draftBody, first.company, first.role));
    setDraftTouched(false);
  }, [selectedList]);

  useEffect(() => {
    if (!draftTouched && selectedList.length > 0) {
      resetDraftFrom();
    }
  }, [selectedList.length, draftTouched, resetDraftFrom]);

  const toggleCompany = (company: string) => {
    setResult(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(company)) next.delete(company);
      else next.add(company);
      return next;
    });
  };

  const openMailto = (c: CompanyContact) => {
    const subject = encodeURIComponent(applyTokens(customSubject || c.draftSubject, c.company, c.role));
    const body = encodeURIComponent(applyTokens(customBody || c.draftBody, c.company, c.role));
    window.location.href = `mailto:${c.toEmail}?subject=${subject}&body=${body}`;
  };

  const copyDraft = async (c: CompanyContact) => {
    const text = `To: ${c.toEmail}\nSubject: ${applyTokens(customSubject || c.draftSubject, c.company, c.role)}\n\n${applyTokens(customBody || c.draftBody, c.company, c.role)}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Draft copied to clipboard");
    } catch { toast.error("Could not copy"); }
  };

  const confirmSend = () => {
    if (selectedList.length === 0) {
      toast.info("Select at least one company first");
      return;
    }
    setConfirmOpen(true);
  };

  const copyAllDrafts = async () => {
    let all = "";
    for (const c of selectedList) {
      all += `To: ${recipientEmails[c.company] || c.toEmail}\nSubject: ${applyTokens(customSubject || c.draftSubject, c.company, c.role)}\n\n${applyTokens(customBody || c.draftBody, c.company, c.role)}\n\n${"-".repeat(48)}\n\n`;
    }
    try {
      await navigator.clipboard.writeText(all);
      toast.success("All drafts copied to clipboard");
    } catch { toast.error("Could not copy"); }
  };

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const recipients = selectedList.map(c => ({
        toEmail: (recipientEmails[c.company] || c.toEmail).trim(),
        toName: c.company,
        company: c.company,
        role: c.role,
        location: c.location,
        applyUrl: c.applyUrl,
        subject: applyTokens(customSubject, c.company, c.role),
        body: applyTokens(customBody, c.company, c.role),
      }));

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, confirmed: true, fromName, fromEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsSetup) {
          setConfirmOpen(false);
          toast.error(data.error);
          return;
        }
        toast.error(data.error || "Failed to send");
        return;
      }
      setResult(data);
      setConfirmOpen(false);
      toast.success(`${data.sent} email${data.sent !== 1 ? "s" : ""} sent successfully`);

      const hRes = await fetch("/api/email/send");
      const hData = await hRes.json();
      if (hRes.ok) setHistory(Array.isArray(hData.emails) ? hData.emails : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  if (loading || authLoading) return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-72 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/[0.02] rounded-2xl border border-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  const previewCompany = selectedList[0];
  const previewSubject = previewCompany
    ? applyTokens(customSubject || previewCompany.draftSubject, previewCompany.company, previewCompany.role)
    : "Your email will appear here after you select companies";

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    Professional Email Outreach
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Real companies hiring now across India, matched to your skills - with a polished email drafted for each one.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors">
                    <History className="w-4 h-4" /> Sent ({history.length})
                  </button>
                </div>
              </div>

              {/* Config banner */}
              {!config.configured && (
                <div className="mt-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-wrap items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="flex-1 min-w-[240px]">
                    <p className="text-sm font-medium text-amber-300">Automatic email sending is not configured yet</p>
                    <p className="text-xs text-amber-200/60 mt-0.5">
                      You can still draft and send through your own mail app (Gmail / Outlook) with one click. To enable automatic
                      sending, add{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">SMTP_HOST</code>,{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">SMTP_PORT</code>,{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">SMTP_USER</code> and{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">SMTP_PASS</code> to the server environment.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <ShieldCheck className="w-4 h-4" /> Emails are only sent after your explicit confirmation.
                  </div>
                </div>
              )}
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Companies Hiring", value: totalHiring, icon: Building2, color: "indigo" },
                { label: "Matched to You", value: companies.length, icon: Sparkles, color: "emerald" },
                { label: "Selected", value: selected.size, icon: Check, color: "purple" },
                { label: "Emails Sent", value: history.filter(h => h.status === "sent").length, icon: Send, color: "amber" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/10 flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{s.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-6 items-start">
              {/* Companies list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" /> Select companies to email
                  </h2>
                  <span className="text-xs text-slate-500">Emails go to the careers/hr address we derive from each posting</span>
                </div>

                {companies.length === 0 ? (
                  <div className="glass p-12 text-center">
                    <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-1">No matching companies found right now</h3>
                    <p className="text-sm text-slate-500">Complete your assessment to unlock personalised matches from live postings.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {companies.map((c, idx) => {
                      const isSel = selected.has(c.company);
                      return (
                        <motion.div key={c.company} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${isSel ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/15"}`}
                          onClick={() => toggleCompany(c.company)}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSel ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                              {isSel && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            {c.companyLogo ? (
                              <img src={c.companyLogo} alt="" className="w-9 h-9 rounded-lg object-contain bg-white/5 p-1"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-emerald-400">
                                {c.company[0]}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-sm truncate">{c.company}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                                  {c.matchScore}% match
                                </span>
                              </div>
                              <div className="text-xs text-indigo-400 truncate">{c.role}{c.location ? ` - ${c.location}` : ""}</div>
                              <div className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</div>
                              {c.otherRoles.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {c.otherRoles.map(r => (
                                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{r}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="space-y-4 xl:sticky xl:top-0">
                <div className="glass p-5 rounded-2xl">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-emerald-400" /> Your email
                  </h3>

                  {/* Sender profile */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">From name</label>
                      <input value={fromName} onChange={e => setFromName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:border-emerald-500/40 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Reply-to email</label>
                      <input value={fromEmail} onChange={e => setFromEmail(e.target.value)} type="email"
                        className="w-full p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:border-emerald-500/40 focus:outline-none" />
                    </div>
                  </div>

                  {/* Subject */}
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Subject</label>
                  <input value={customSubject} onChange={e => { setCustomSubject(e.target.value); setDraftTouched(true); }}
                    placeholder={previewCompany ? previewCompany.draftSubject : "Email subject"}
                    className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm mb-3 focus:border-emerald-500/40 focus:outline-none" />

                  {/* Body */}
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Body</label>
                  <textarea value={customBody} onChange={e => { setCustomBody(e.target.value); setDraftTouched(true); }}
                    placeholder={previewCompany ? previewCompany.draftBody : "Your email body"}
                    rows={12}
                    className="w-full p-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm leading-relaxed focus:border-emerald-500/40 focus:outline-none resize-y" />

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-600">
                      Use <code className="px-1 rounded bg-white/5">{"{{company}}"}</code> and <code className="px-1 rounded bg-white/5">{"{{role}}"}</code> to personalise per recipient
                    </span>
                    <button onClick={resetDraftFrom} disabled={selectedList.length === 0}
                      className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Rebuild with AI
                    </button>
                  </div>
                </div>

                {/* Recipients */}
                {selectedList.length > 0 && (
                  <div className="glass p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-400" /> Recipients ({selectedList.length})
                    </h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                      {selectedList.map(c => (
                        <div key={c.company} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{c.company}</div>
                            <input value={recipientEmails[c.company] || c.toEmail}
                              onChange={e => setRecipientEmails(prev => ({ ...prev, [c.company]: e.target.value }))}
                              className="w-full mt-0.5 text-xs bg-transparent text-slate-400 focus:text-white focus:outline-none border-b border-transparent focus:border-emerald-500/40 pb-0.5" />
                          </div>
                          <button onClick={() => copyDraft(c)} title="Copy draft"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openMailto(c)} title="Open in mail app"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button onClick={confirmSend}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Review &amp; Send {selectedList.length > 1 ? `${selectedList.length} emails` : "email"}
                    </button>
                    <p className="text-[10px] text-slate-600 text-center mt-2">
                      Nothing is sent until you confirm in the next step.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Result */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl border border-white/10 glass">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  {result.failed === 0
                    ? <><CheckCircle2 className="w-5 h-5 text-emerald-400" /> All {result.sent} email{result.sent !== 1 ? "s" : ""} sent</>
                    : <><AlertTriangle className="w-5 h-5 text-amber-400" /> {result.sent} sent, {result.failed} failed</>}
                </h3>
                <div className="space-y-1.5">
                  {result.details.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {d.ok
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                      <span className="font-medium">{d.company}</span>
                      <span className="text-slate-500 truncate">{d.toEmail}</span>
                      {!d.ok && <span className="text-xs text-red-400 truncate">{d.error}</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* History */}
            {showHistory && (
              <div className="mt-6 glass p-5 rounded-2xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><History className="w-4 h-4 text-indigo-400" /> Sent history</h3>
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500">No emails sent yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {history.map(h => (
                      <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-sm">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${h.status === "sent" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {h.status}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{h.subject}</div>
                          <div className="text-[10px] text-slate-500 truncate">{h.company} - {h.toEmail}</div>
                        </div>
                        <span className="text-[10px] text-slate-600 shrink-0">{new Date(h.sentAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Confirm modal */}
        <AnimatePresence>
          {confirmOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-lg max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10 p-6"
                style={{ background: "rgba(17,17,24,0.98)" }}>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" /> {config.configured ? "Confirm sending" : "Send via your mail app"}
                </h3>

                {config.configured ? (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-4">
                    <p className="text-sm text-amber-300 font-medium mb-1">You are about to send {selectedList.length} real email{selectedList.length !== 1 ? "s" : ""}.</p>
                    <p className="text-xs text-amber-200/60">These go out immediately from your configured email account. Compass cannot unsend them.</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mb-4">
                    <p className="text-sm text-indigo-300 font-medium mb-1">Email service isn&apos;t connected yet.</p>
                    <p className="text-xs text-indigo-200/60">Open each recipient in your mail app (Gmail / Outlook) to send manually, or copy all drafts at once.</p>
                  </div>
                )}

                <div className="mb-4 space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedList.map(c => (
                    <div key={c.company} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-medium truncate">{c.company}</span>
                      <span className="text-slate-500 truncate">{recipientEmails[c.company] || c.toEmail}</span>
                      {!config.configured && (
                        <span className="ml-auto flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => copyDraft(c)} title="Copy draft"
                            className="p-1 rounded text-slate-500 hover:text-emerald-400 transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openMailto(c)} title="Open in mail app"
                            className="p-1 rounded text-slate-500 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Subject preview</p>
                  <p className="text-sm text-slate-300 bg-white/[0.02] border border-white/5 rounded-lg p-3">{previewSubject}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setConfirmOpen(false)} disabled={sending}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors">
                    Close
                  </button>
                  {config.configured ? (
                    <button onClick={handleSend} disabled={sending}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50">
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Confirm &amp; Send</>}
                    </button>
                  ) : (
                    <button onClick={copyAllDrafts}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold text-white flex items-center justify-center gap-2">
                      <Copy className="w-4 h-4" /> Copy all drafts
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
