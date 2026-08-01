"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Send, Building2, Sparkles, Loader2, Copy, AlertTriangle,
  History, ShieldCheck, PenLine, MapPin, Wand2, Download, FileText, FileCode,
  RotateCcw, Bold, Italic, Underline, List, Link as LinkIcon, Undo2, Redo2, Eye, Gauge, Lightbulb,
  ChevronDown, ChevronRight, X, Settings2, TrendingUp, Save, Target, Users,
  Clock, Bot, Check, RefreshCw, Globe
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "@/components/Toast";

// ─── Types ──────────────────────────────────────────────────────────

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
  isTn?: boolean;
  description: string;
  companyLogo: string;
  otherRoles: string[];
  draftSubject: string;
  draftBody: string;
}

type EmailStyle = "formal" | "friendly" | "technical" | "startup" | "executive";

interface EmailScore {
  score: number;
  why: string;
}

interface ScoreResult {
  overall: number;
  selectionProbability: number;
  scores: Record<string, EmailScore>;
  recommendation: string;
}

interface SubjectCandidate { text: string; openRate: number; professionalism: number; appeal: number; }
interface Suggestion { id: string; quote: string; issue: string; suggestion: string; severity: "high" | "medium" | "low"; }
interface CareerDetails { location: string; phone: string; github: string; linkedin: string; portfolio: string; targetRole: string; employmentType: string; projects: { name: string; tech: string; description: string; link: string }[]; certifications: { name: string; issuer: string; year: string }[]; achievements: string[]; preferredStyle: string; }
interface SentEmail { id: string; toEmail: string; toName: string; company: string; role: string; subject: string; status: string; sentAt: string; }

const DEFAULT_DETAILS: CareerDetails = {
  location: "", phone: "", github: "", linkedin: "", portfolio: "", targetRole: "", employmentType: "internship",
  projects: [], certifications: [], achievements: [], preferredStyle: "formal",
};

const STYLES: { id: EmailStyle; label: string; sub: string; gradient: string; chip: string }[] = [
  { id: "formal", label: "Formal", sub: "Corporate", gradient: "from-indigo-500 to-purple-500", chip: "text-indigo-300 border-indigo-500/30" },
  { id: "friendly", label: "Friendly", sub: "Warm & personable", gradient: "from-sky-500 to-teal-500", chip: "text-sky-300 border-sky-500/30" },
  { id: "technical", label: "Technical", sub: "Engineering depth", gradient: "from-emerald-500 to-cyan-500", chip: "text-emerald-300 border-emerald-500/30" },
  { id: "startup", label: "Startup", sub: "Builder energy", gradient: "from-orange-500 to-rose-500", chip: "text-orange-300 border-orange-500/30" },
  { id: "executive", label: "Executive", sub: "Crisp & senior", gradient: "from-slate-400 to-indigo-400", chip: "text-slate-300 border-slate-400/30" },
];

const SCORE_META: { key: string; label: string; color: string }[] = [
  { key: "professionalism", label: "Professionalism", color: "#818cf8" },
  { key: "recruiterImpression", label: "Recruiter Impression", color: "#a78bfa" },
  { key: "personalization", label: "Personalization", color: "#34d399" },
  { key: "ats", label: "ATS Match", color: "#fbbf24" },
  { key: "grammar", label: "Grammar", color: "#f472b6" },
  { key: "confidence", label: "Confidence", color: "#22d3ee" },
  { key: "readability", label: "Readability", color: "#fb923c" },
];

// ─── HTML / text helpers ────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function textToHtml(text: string): string {
  const blocks = text.split(/\n{2,}/);
  return blocks.map(b => {
    const lines = b.split("\n").filter(l => l.trim());
    const bullets = lines.filter(l => /^\s*[-•*]\s/.test(l));
    if (bullets.length === lines.length && bullets.length > 0) {
      return `<ul>${lines.map(l => `<li>${escapeHtml(l.replace(/^\s*[-•*]\s/, ""))}</li>`).join("")}</ul>`;
    }
    return `<p>${lines.map(l => escapeHtml(l)).join("<br>")}</p>`;
  }).join("\n");
}

function htmlToText(html: string): string {
  if (typeof document === "undefined") return html;
  const el = document.createElement("div");
  el.innerHTML = html;
  el.querySelectorAll("li").forEach(li => {
    li.innerHTML = "• " + li.innerHTML + "\n";
  });
  el.querySelectorAll("p").forEach(p => {
    p.innerHTML = p.innerHTML + "\n\n";
  });
  el.querySelectorAll("br").forEach(br => {
    br.replaceWith("\n");
  });
  return (el.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
}

function countWords(html: string): number {
  return htmlToText(html).split(/\s+/).filter(Boolean).length;
}

// ─── Small presentational pieces ────────────────────────────────────

function ScoreRing({ value, size = 74, stroke = 7, color = "#34d399", label }: { value: number; size?: number; stroke?: number; color?: string; label: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }} transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold" style={{ fontSize: size / 3.4 }}>{Math.round(pct)}</span>
        <span className="text-[8px] uppercase tracking-wider text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color, why, open }: { label: string; value: number; color: string; why: string; open: boolean }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }}
          animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{why}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────

export default function EmailCampaignPage() {
  const { user, loading: authLoading, logout } = useAuth();

  const [companies, setCompanies] = useState<CompanyContact[]>([]);
  const [config, setConfig] = useState<{ configured: boolean }>({ configured: false });
  const [totalHiring, setTotalHiring] = useState(0);
  const [tnHiring, setTnHiring] = useState(0);
  const [locationFilter, setLocationFilter] = useState<"all" | "tn">("all");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<Record<string, string>>({});
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");

  // AI drafts cache: key `${company}|${style}` -> {subject, body}
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});
  const [subjectsMap, setSubjectsMap] = useState<Record<string, SubjectCandidate[]>>({});
  const [activeStyle, setActiveStyle] = useState<EmailStyle>("formal");
  const [generating, setGenerating] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(false);

  // editor
  const [editorHtml, setEditorHtml] = useState("");
  const [editorSubject, setEditorSubject] = useState("");
  const [dirty, setDirty] = useState(false);
  const [versionTick, setVersionTick] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // AI panels
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [scoring, setScoring] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [panelTab, setPanelTab] = useState<"score" | "suggest" | "preview">("score");
  const [expandedScore, setExpandedScore] = useState<string | null>(null);

  // profile
  const [details, setDetails] = useState<CareerDetails>(DEFAULT_DETAILS);
  const [profileOpen, setProfileOpen] = useState(false);

  // misc
  const [history, setHistory] = useState<SentEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [versions, setVersions] = useState<{ label: string; subject: string; html: string; ts: number }[]>([]);
  const [versionsOpen, setVersionsOpen] = useState(false);

  const autoScored = useRef<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = useMemo(() => companies.find(c => c.company === activeCompany) || null, [companies, activeCompany]);

  // ── Load companies + history + profile ──────────────────────────
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      try {
        const [cRes, hRes, pRes] = await Promise.all([
          fetch(`/api/email/companies?location=${locationFilter}`),
          fetch("/api/email/send"),
          fetch("/api/email/profile"),
        ]);
        const cData = await cRes.json();
        const hData = await hRes.json();
        const pData = await pRes.json();
        if (!cancelled) {
          const list: CompanyContact[] = Array.isArray(cData.companies) ? cData.companies : [];
          setCompanies(list);
          setConfig(cData.config || { configured: false });
          setTotalHiring(cData.totalHiring || 0);
          setTnHiring(cData.tnHiring || 0);
          setHistory(Array.isArray(hData.emails) ? hData.emails : []);
          if (pData.details) setDetails({ ...DEFAULT_DETAILS, ...pData.details });
          if (user) {
            setFromName(user.name || "");
            setFromEmail(user.email || "");
          }
          const params = new URLSearchParams(window.location.search);
          const qCompany = params.get("company");
          if (qCompany) {
            const match = list.find(c => c.company.toLowerCase() === qCompany.toLowerCase()) || list[0];
            if (match) setActiveCompany(match.company);
          } else if (list.length > 0 && !activeCompany) {
            setActiveCompany(list[0].company);
          }
        }
      } catch (e) { console.error("email campaign load", e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, locationFilter]);

  // ── Auto-generate when a company is selected ────────────────────
  const generateDraft = useCallback(async (company: string, style: EmailStyle, force = false) => {
    const c = companies.find(x => x.company === company);
    if (!c) return;
    const key = `${company}|${style}`;
    setGenerating(true);
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role: c.role, style }),
      });
      const data = await res.json();
      if (res.ok) {
        setDrafts(prev => ({ ...prev, [key]: { subject: data.subject, body: data.body } }));
        if (style === activeStyle && company === activeCompany) {
          setEditorSubject(data.subject);
          setEditorHtml(textToHtml(data.body));
          setVersionTick(t => t + 1);
          setDirty(false);
        }
      } else if (!force) {
        // graceful fallback to the static draft from companies list
        setDrafts(prev => ({ ...prev, [key]: { subject: c.draftSubject, body: c.draftBody } }));
        if (style === activeStyle && company === activeCompany) {
          setEditorSubject(c.draftSubject);
          setEditorHtml(textToHtml(c.draftBody));
          setVersionTick(t => t + 1);
        }
      } else {
        toast.error(data.error || "Could not generate draft");
      }
    } catch { toast.error("Generation failed"); }
    finally { setGenerating(false); }
  }, [companies, activeCompany, activeStyle]);

  useEffect(() => {
    if (!active) return;
    const key = `${active.company}|${activeStyle}`;
    if (!drafts[key] && !generating) {
      generateDraft(active.company, activeStyle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.company, activeStyle]);

  // Auto-load subjects for active company
  useEffect(() => {
    if (!active) return;
    if (subjectsMap[active.company]) return;
    setSubjectLoading(true);
    fetch("/api/email/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: active.company, role: active.role, style: activeStyle }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.subjects) setSubjectsMap(prev => ({ ...prev, [active.company]: d.subjects }));
      })
      .catch(() => {})
      .finally(() => setSubjectLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.company]);

  // ── Auto-score once per company ─────────────────────────────────
  useEffect(() => {
    if (!active || score || !editorHtml) return;
    if (autoScored.current.has(active.company)) return;
    const html = editorHtml;
    const subject = editorSubject;
    if (!html.trim() || !subject.trim()) return;
    autoScored.current.add(active.company);
    setScoring(true);
    fetch("/api/email/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body: htmlToText(html), company: active.company, role: active.role }),
    })
      .then(r => r.json())
      .then(d => { if (d.scores) setScore(d); })
      .catch(() => {})
      .finally(() => setScoring(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.company, editorHtml]);

  // ── Auto-save drafts to localStorage ────────────────────────────
  const persist = useCallback(() => {
    if (!active) return;
    try {
      const payload = { subject: editorSubject, html: editorHtml, style: activeStyle, ts: Date.now() };
      localStorage.setItem(`compass_email_draft_${active.company.toLowerCase()}`, JSON.stringify(payload));
      setSavedAt(new Date().toLocaleTimeString());
    } catch {}
  }, [active, editorSubject, editorHtml, activeStyle]);

  useEffect(() => {
    if (!active || !dirty) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 1400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [editorSubject, editorHtml, dirty, active, persist]);

  // Load saved draft when switching company
  useEffect(() => {
    if (!active) return;
    const savedKey = `compass_email_draft_${active.company.toLowerCase()}`;
    try {
      const raw = localStorage.getItem(savedKey);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.html) {
          setEditorSubject(s.subject || active.draftSubject);
          setEditorHtml(s.html);
          setActiveStyle((s.style as EmailStyle) || "formal");
          setVersionTick(t => t + 1);
          setDirty(false);
          return;
        }
      }
    } catch {}
    setEditorSubject(active.draftSubject);
    setEditorHtml(textToHtml(active.draftBody));
    setVersionTick(t => t + 1);
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.company]);

  const onEditorInput = () => {
    const html = editorRef.current?.innerHTML || "";
    setEditorHtml(html);
    setDirty(true);
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    setEditorHtml(editorRef.current?.innerHTML || "");
    setDirty(true);
  };

  const insertToken = (token: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, token);
    onEditorInput();
  };

  const bodyText = useMemo(() => htmlToText(editorHtml), [editorHtml]);

  const switchStyle = (style: EmailStyle) => {
    if (style === activeStyle) return;
    // save current editor state into drafts cache
    if (active) {
      setDrafts(prev => ({ ...prev, [`${active.company}|${activeStyle}`]: { subject: editorSubject, body: bodyText } }));
    }
    setActiveStyle(style);
    const key = active ? `${active.company}|${style}` : "";
    const cached = active ? drafts[key] : null;
    if (active && cached) {
      setEditorSubject(cached.subject);
      setEditorHtml(textToHtml(cached.body));
      setVersionTick(t => t + 1);
      setDirty(false);
    } else if (active) {
      generateDraft(active.company, style);
    }
  };

  // ── Score / Suggestions actions ─────────────────────────────────
  const runScore = async () => {
    if (!active) return;
    setScoring(true);
    setPanelTab("score");
    try {
      const res = await fetch("/api/email/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: editorSubject, body: bodyText, company: active.company, role: active.role }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Scoring failed");
      setScore(d);
      toast.success("Email scored by AI");
    } catch (e: any) { toast.error(e.message || "Scoring failed"); }
    finally { setScoring(false); }
  };

  const runSuggestions = async () => {
    if (!active) return;
    setSuggestLoading(true);
    setPanelTab("suggest");
    try {
      const res = await fetch("/api/email/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: editorSubject, body: bodyText, company: active.company, role: active.role, details }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setSuggestions(d.suggestions || []);
      if ((d.suggestions || []).length === 0) toast.info("Your email looks strong — no weak spots detected");
    } catch (e: any) { toast.error(e.message || "Failed"); }
    finally { setSuggestLoading(false); }
  };

  const applySuggestion = (s: Suggestion) => {
    const text = htmlToText(editorHtml);
    if (!s.quote.trim() || !text.includes(s.quote)) {
      toast.info("The exact sentence wasn't found (it may have changed). Please apply manually.");
      return;
    }
    const next = text.replace(s.quote, s.suggestion);
    setEditorHtml(textToHtml(next));
    setVersionTick(t => t + 1);
    setDirty(true);
    setSuggestions(prev => prev.filter(x => x.id !== s.id));
    toast.success("Improvement applied");
  };

  const resetToAi = () => {
    if (!active) return;
    generateDraft(active.company, activeStyle, true);
  };

  // ── Actions ─────────────────────────────────────────────────────
  const copyText = async () => {
    const text = `Subject: ${editorSubject}\n\n${bodyText}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied as plain text");
    } catch { toast.error("Could not copy"); }
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(`<h2>${editorSubject}</h2>\n${editorHtml}`);
      toast.success("Copied as HTML");
    } catch { toast.error("Could not copy"); }
  };

  const exportHtml = () => {
    const html = `<html><head><style>body{font-family:Georgia,serif;padding:40px;max-width:640px;margin:auto;line-height:1.6;color:#111}</style></head><body><h2>${editorSubject}</h2>${editorHtml}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    downloadBlob(blob, `${(active?.company || "email")}-draft.html`);
    toast.success("HTML exported");
  };

  const exportDocx = () => {
    const header = `mso-application:progid:Word.Document`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${editorSubject}</title></head><body><h2>${editorSubject}</h2>${editorHtml}</body></html>`;
    const blob = new Blob([`\ufeff${html}`], { type: "application/vnd.ms-word;charset=utf-8" });
    downloadBlob(blob, `${(active?.company || "email")}-draft.doc`);
    toast.success("Word document exported");
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openGmail = () => {
    const to = recipients[active!.company] || active!.toEmail;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(editorSubject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(url, "_blank");
  };

  const openOutlook = () => {
    const to = recipients[active!.company] || active!.toEmail;
    const url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(editorSubject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(url, "_blank");
  };

  const openMailto = () => {
    const to = recipients[active!.company] || active!.toEmail;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(editorSubject)}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleSend = async () => {
    if (!active) return;
    setSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: [{
            toEmail: (recipients[active.company] || active.toEmail).trim(),
            toName: active.company,
            company: active.company,
            role: active.role,
            location: active.location,
            applyUrl: active.applyUrl,
            subject: editorSubject,
            body: bodyText,
            bodyHtml: editorHtml,
            style: activeStyle,
          }],
          confirmed: true,
          fromName,
          fromEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsSetup) {
          toast.error(data.error);
          openMailto();
          return;
        }
        toast.error(data.error || "Failed to send");
        return;
      }
      toast.success(`Email sent to ${active.company}`);
      const hRes = await fetch("/api/email/send");
      const hData = await hRes.json();
      if (hRes.ok) setHistory(Array.isArray(hData.emails) ? hData.emails : []);
    } catch { toast.error("Failed to send"); }
    finally { setSending(false); }
  };

  const saveVersion = () => {
    setVersions(prev => [...prev, { label: `v${prev.length + 1}`, subject: editorSubject, html: editorHtml, ts: Date.now() }]);
    toast.success("Version saved");
  };

  const restoreVersion = (v: { subject: string; html: string }) => {
    setEditorSubject(v.subject);
    setEditorHtml(v.html);
    setVersionTick(t => t + 1);
    setDirty(true);
    setVersionsOpen(false);
    toast.success("Version restored");
  };

  const saveProfile = async (d: CareerDetails) => {
    const res = await fetch("/api/email/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ details: d }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || "Save failed"); return false; }
    setDetails({ ...DEFAULT_DETAILS, ...data.details });
    toast.success("Outreach profile saved");
    return true;
  };

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(c =>
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.location || "").toLowerCase().includes(q)
    );
  }, [companies, query]);

  if (loading || authLoading) return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a12]">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-72 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[70vh] bg-white/[0.02] rounded-2xl border border-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  const profileComplete = Boolean(details.github || details.linkedin || details.portfolio) || details.projects.length > 0;
  const words = countWords(editorHtml);

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden bg-[#0a0a12]">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="px-5 lg:px-6 py-3.5 border-b border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Mail className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold truncate">Email Outreach Studio</h1>
              <p className="text-[11px] text-slate-500 truncate">AI-drafted, recruiter-ready cold emails for real hiring teams</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!profileComplete && (
                <button onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 hover:bg-amber-500/20 transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5" /> Complete profile
                </button>
              )}
              <button onClick={() => setProfileOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">
                <Settings2 className="w-3.5 h-3.5" /> Outreach profile
              </button>
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">
                <History className="w-3.5 h-3.5" /> History
              </button>
            </div>
          </header>

          {!config.configured && (
            <div className="px-5 lg:px-6 py-2 bg-amber-500/[0.07] border-b border-amber-500/15 flex items-center gap-2 text-[11px] text-amber-200/80 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Auto-send isn&apos;t connected. Use Gmail / Outlook one-click below — or add SMTP env vars to enable direct sending.
            </div>
          )}

          <div className="flex-1 min-h-0 flex">
            {/* ── Companies rail ── */}
            <aside className="w-[300px] shrink-0 border-r border-white/[0.06] flex flex-col min-h-0 bg-white/[0.012]">
              <div className="p-3 border-b border-white/[0.06] space-y-2">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <button onClick={() => setLocationFilter("all")}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${locationFilter === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}>
                    All India
                  </button>
                  <button onClick={() => setLocationFilter("tn")}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${locationFilter === "tn" ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow shadow-orange-500/20" : "text-slate-400 hover:text-white"}`}>
                    <MapPin className="w-3 h-3" /> Tamil Nadu {tnHiring > 0 && <span className="text-[9px] font-bold">{tnHiring}</span>}
                  </button>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies or roles"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs outline-none focus:border-indigo-500/40 placeholder:text-slate-600" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-0">
                {filteredCompanies.map((c, idx) => {
                  const isActive = c.company === activeCompany;
                  return (
                    <motion.button key={c.company} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                      onClick={() => { setActiveCompany(c.company); setScore(null); setSuggestions([]); }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${isActive ? "bg-gradient-to-br from-indigo-500/[0.14] to-purple-500/[0.08] border-indigo-500/30" : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"}`}>
                      {c.companyLogo ? (
                        <img src={c.companyLogo} alt="" className="w-8 h-8 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-slate-400"}`}>
                          {c.company[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold truncate">{c.company}</span>
                          {c.isTn && <MapPin className="w-3 h-3 text-orange-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{c.role}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">{c.matchScore}%</span>
                    </motion.button>
                  );
                })}
                {filteredCompanies.length === 0 && (
                  <div className="text-center py-10">
                    <Building2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No companies found.</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-white/[0.06] text-[10px] text-slate-600">
                {totalHiring} hiring · {companies.length} matched · {tnHiring} in Tamil Nadu
              </div>
            </aside>

            {/* ── Studio ── */}
            <section className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
              {!active ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Select a company to start drafting.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Studio top bar */}
                  <div className="px-5 py-3 border-b border-white/[0.06] flex flex-wrap items-center gap-3 shrink-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold truncate">{active.company}</h2>
                        {active.isTn && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> TN</span>}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{active.matchScore}% skill match</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {active.role}{active.location ? ` · ${active.location}` : ""}
                        <span className="text-slate-600"> · To:</span>
                        <span className="text-indigo-400"> {recipients[active.company] || active.toEmail}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button onClick={runScore} disabled={scoring}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-50">
                        {scoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5 text-indigo-400" />} Score
                      </button>
                      <button onClick={runSuggestions} disabled={suggestLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-50">
                        {suggestLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5 text-amber-400" />} Improve
                      </button>
                      <div className="relative">
                        <button onClick={() => setVersionsOpen(!versionsOpen)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">
                          <History className="w-3.5 h-3.5 text-sky-400" /> Versions <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                          {versionsOpen && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                              className="absolute right-0 top-full mt-1 w-64 rounded-xl bg-[#14141f] border border-white/10 shadow-2xl z-40 overflow-hidden">
                              <div className="p-2 max-h-48 overflow-y-auto space-y-1">
                                {versions.length === 0 && <p className="text-[11px] text-slate-500 p-2">No saved versions yet.</p>}
                                {versions.map(v => (
                                  <button key={v.ts} onClick={() => restoreVersion(v)}
                                    className="w-full text-left p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                                    <div className="text-[11px] font-medium flex items-center gap-1.5"><Save className="w-3 h-3 text-sky-400" /> {v.label}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{v.subject}</div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button onClick={saveVersion}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">
                        <Save className="w-3.5 h-3.5 text-sky-400" /> Save version
                      </button>
                      <button onClick={resetToAi} disabled={generating}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-50">
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Rebuild with AI
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 flex">
                    {/* ── Editor column ── */}
                    <div className="flex-1 min-w-0 overflow-y-auto p-5">
                      <div className="max-w-3xl mx-auto space-y-4">
                        {/* Style tabs */}
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Wand2 className="w-3 h-3 text-indigo-400" /> AI Email Version
                          </div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {STYLES.map(s => {
                              const on = s.id === activeStyle;
                              return (
                                <motion.button key={s.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                                  onClick={() => switchStyle(s.id)}
                                  className={`p-2 rounded-xl border text-center transition-all ${on ? `border-transparent bg-gradient-to-br ${s.gradient} text-white shadow-lg` : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20"}`}>
                                  <div className="text-[11px] font-bold">{s.label}</div>
                                  <div className={`text-[9px] ${on ? "text-white/80" : "text-slate-600"}`}>{s.sub}</div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Subject line generator */}
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Target className="w-3 h-3 text-rose-400" /> Subject line
                            </span>
                            <span className="text-[10px] text-slate-600 flex items-center gap-1">
                              {savedAt ? <><Check className="w-3 h-3 text-emerald-400" /> Saved {savedAt}</> : <><Clock className="w-3 h-3" /> Auto-saves</>}
                            </span>
                          </div>
                          <div className="p-3">
                            <input value={editorSubject} onChange={e => { setEditorSubject(e.target.value); setDirty(true); }}
                              placeholder="Enter a subject line…"
                              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-medium outline-none focus:border-indigo-500/50 placeholder:text-slate-600" />
                            <div className="mt-2.5 space-y-1.5">
                              {subjectLoading ? (
                                <div className="flex items-center gap-2 text-[11px] text-slate-500"><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI generating subject variants…</div>
                              ) : (
                                (subjectsMap[active.company] || []).map((s, i) => (
                                  <motion.button key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    onClick={() => { setEditorSubject(s.text); setDirty(true); toast.success("Subject applied"); }}
                                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/30 hover:bg-white/[0.04] transition-colors group">
                                    <Sparkles className="w-3 h-3 text-rose-400 shrink-0 opacity-60 group-hover:opacity-100" />
                                    <span className="flex-1 text-xs text-slate-300 truncate">{s.text}</span>
                                    <span className="text-[9px] text-slate-600 shrink-0">open {s.openRate}%</span>
                                    <span className="text-[9px] text-emerald-500 shrink-0">{s.professionalism}/100</span>
                                  </motion.button>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rich body editor */}
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] flex-wrap gap-2">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <PenLine className="w-3 h-3 text-emerald-400" /> Email body
                            </span>
                            <div className="flex items-center gap-0.5">
                              <ToolBtn onClick={() => exec("undo")} title="Undo"><Undo2 className="w-3.5 h-3.5" /></ToolBtn>
                              <ToolBtn onClick={() => exec("redo")} title="Redo"><Redo2 className="w-3.5 h-3.5" /></ToolBtn>
                              <div className="w-px h-4 bg-white/10 mx-1" />
                              <ToolBtn onClick={() => exec("bold")} title="Bold"><Bold className="w-3.5 h-3.5" /></ToolBtn>
                              <ToolBtn onClick={() => exec("italic")} title="Italic"><Italic className="w-3.5 h-3.5" /></ToolBtn>
                              <ToolBtn onClick={() => exec("underline")} title="Underline"><Underline className="w-3.5 h-3.5" /></ToolBtn>
                              <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bullets"><List className="w-3.5 h-3.5" /></ToolBtn>
                              <ToolBtn onClick={() => { const url = window.prompt("Link URL", "https://"); if (url) exec("createLink", url); }} title="Link"><LinkIcon className="w-3.5 h-3.5" /></ToolBtn>
                              <div className="w-px h-4 bg-white/10 mx-1" />
                              <button onClick={() => insertToken("{{company}}")}
                                className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[9px] font-mono hover:bg-indigo-500/20 transition-colors">{"{{company}}"}</button>
                              <button onClick={() => insertToken("{{role}}")}
                                className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[9px] font-mono hover:bg-purple-500/20 transition-colors">{"{{role}}"}</button>
                            </div>
                          </div>
                          <div
                            ref={editorRef}
                            key={`${active.company}|${activeStyle}|${versionTick}`}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={onEditorInput}
                            className="min-h-[340px] px-5 py-4 text-sm leading-relaxed text-slate-200 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_p]:my-2 [&_a]:text-indigo-400 [&_a]:underline [&_b]:font-bold [&_i]:italic"
                            dangerouslySetInnerHTML={{ __html: editorHtml }}
                          />
                          <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-600">
                            <span>{words} words · {htmlToText(editorHtml).length} chars</span>
                            <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-indigo-500" /> Style: {STYLES.find(s => s.id === activeStyle)?.label}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <ActionBtn icon={Copy} label="Copy text" onClick={copyText} />
                          <ActionBtn icon={FileCode} label="Copy HTML" onClick={copyHtml} />
                          <ActionBtn icon={FileText} label="Word (.doc)" onClick={exportDocx} />
                          <ActionBtn icon={FileCode} label="Export HTML" onClick={exportHtml} />
                          <ActionBtn icon={Globe} label="Gmail" onClick={openGmail} accent />
                          <ActionBtn icon={Mail} label="Outlook" onClick={openOutlook} accent />
                          <ActionBtn icon={Download} label="Print / PDF" onClick={() => window.print()} />
                          <ActionBtn icon={Send} label={sending ? "Sending…" : "Send email"} onClick={handleSend} gradient={config.configured} disabled={sending} />
                        </div>
                        <p className="text-center text-[10px] text-slate-600">Emails are only sent after you explicitly trigger them.</p>
                      </div>
                    </div>

                    {/* ── AI panel column ── */}
                    <aside className="w-[340px] shrink-0 border-l border-white/[0.06] flex flex-col min-h-0 bg-white/[0.012]">
                      <div className="p-2 border-b border-white/[0.06] flex gap-1 shrink-0">
                        {[{ id: "score", label: "AI Score", icon: Gauge }, { id: "suggest", label: "Improve", icon: Lightbulb }, { id: "preview", label: "Recruiter View", icon: Eye }].map(t => (
                          <button key={t.id} onClick={() => setPanelTab(t.id as any)}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${panelTab === t.id ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-500/25" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}>
                            <t.icon className="w-3.5 h-3.5" /> {t.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex-1 overflow-y-auto min-h-0 p-4">
                        {panelTab === "score" && (
                          <div className="space-y-4">
                            {scoring ? (
                              <div className="flex flex-col items-center py-16">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
                                <p className="text-xs text-slate-500">AI analyzing your email…</p>
                              </div>
                            ) : score ? (
                              <>
                                <div className="flex items-center justify-center gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                                  <ScoreRing value={score.overall} color="#818cf8" label="Overall" size={96} />
                                  <ScoreRing value={score.selectionProbability} color="#34d399" label="Selection" size={76} />
                                </div>
                                {score.recommendation && (
                                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                                    <p className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Recommendation</p>
                                    <p className="text-xs text-emerald-100/80 leading-relaxed">{score.recommendation}</p>
                                  </div>
                                )}
                                <div className="space-y-3">
                                  {SCORE_META.map(meta => {
                                    const s = score.scores[meta.key];
                                    const open = expandedScore === meta.key;
                                    return (
                                      <button key={meta.key} onClick={() => setExpandedScore(open ? null : meta.key)} className="w-full text-left">
                                        <ScoreBar label={meta.label} value={s?.score ?? 0} color={meta.color} why={s?.why || ""} open={open} />
                                      </button>
                                    );
                                  })}
                                </div>
                                <button onClick={runScore} className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5">
                                  <RefreshCw className="w-3 h-3" /> Re-score after edits
                                </button>
                              </>
                            ) : (
                              <div className="text-center py-16">
                                <Gauge className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                <p className="text-xs text-slate-500 mb-3">Score this email across 7 recruiter &amp; ATS dimensions.</p>
                                <button onClick={runScore} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-semibold text-white">Score with AI</button>
                              </div>
                            )}
                          </div>
                        )}

                        {panelTab === "suggest" && (
                          <div className="space-y-3">
                            {suggestLoading ? (
                              <div className="flex flex-col items-center py-16">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
                                <p className="text-xs text-slate-500">Scanning for weak sentences…</p>
                              </div>
                            ) : suggestions.length > 0 ? (
                              <>
                                {suggestions.map(s => (
                                  <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border p-3 space-y-2 border-white/[0.07] bg-white/[0.02]">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${s.severity === "high" ? "bg-red-500/10 text-red-400" : s.severity === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-sky-500/10 text-sky-400"}`}>
                                        {s.severity}
                                      </span>
                                    </div>
                                    {s.quote && <blockquote className="text-[11px] text-slate-500 italic border-l-2 border-white/10 pl-2">“{s.quote}”</blockquote>}
                                    <p className="text-[11px] text-slate-400">{s.issue}</p>
                                    <div className="rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 p-2 text-[11px] text-emerald-100/80">{s.suggestion}</div>
                                    <button onClick={() => applySuggestion(s)}
                                      className="w-full py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-[11px] font-semibold text-white flex items-center justify-center gap-1 hover:from-emerald-400 hover:to-teal-400 transition-colors">
                                      <Check className="w-3 h-3" /> Apply fix
                                    </button>
                                  </motion.div>
                                ))}
                                <button onClick={runSuggestions} className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5">
                                  <RefreshCw className="w-3 h-3" /> Re-scan
                                </button>
                              </>
                            ) : (
                              <div className="text-center py-16">
                                <Lightbulb className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                <p className="text-xs text-slate-500 mb-3">AI will find weak sentences and offer one-click rewrites.</p>
                                <button onClick={runSuggestions} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white">Improve with AI</button>
                              </div>
                            )}
                          </div>
                        )}

                        {panelTab === "preview" && (
                          <div className="space-y-3">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Eye className="w-3 h-3 text-indigo-400" /> How the recruiter sees it
                            </div>
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                              {/* Inbox chrome */}
                              <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                    {active.company[0]}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold truncate">{active.company} Recruiting</div>
                                    <div className="text-[10px] text-slate-500 truncate">to me <ChevronRight className="w-2.5 h-2.5 inline" /></div>
                                  </div>
                                  <span className="ml-auto text-[10px] text-slate-500 shrink-0">today · 9:41 AM</span>
                                </div>
                              </div>
                              <div className="px-4 py-3 border-b border-white/[0.06]">
                                <div className="text-sm font-semibold text-slate-100">{editorSubject || "Subject line"}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">from {fromName || "You"} &lt;{fromEmail || "you@example.com"}&gt;</div>
                              </div>
                              <div className="px-4 py-4 text-[13px] leading-relaxed text-slate-300 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_p]:my-2 [&_a]:text-indigo-400 [&_a]:underline [&_b]:font-bold [&_i]:italic"
                                dangerouslySetInnerHTML={{ __html: editorHtml }} />
                              <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2">
                                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                  <div>
                                    <div className="text-[10px] font-medium text-slate-300">Resume_AI.pdf</div>
                                    <div className="text-[9px] text-slate-600">2.1 MB · PDF</div>
                                  </div>
                                </div>
                                <span className="text-[9px] text-slate-600 ml-auto">Attachments shown as resume</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={openGmail} className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-[11px] text-red-300 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5"><Mail className="w-3 h-3" /> Send via Gmail</button>
                              <button onClick={openOutlook} className="flex-1 py-2 rounded-lg bg-sky-500/10 border border-sky-500/25 text-[11px] text-sky-300 hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-1.5"><Mail className="w-3 h-3" /> Outlook</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </aside>
                  </div>
                </>
              )}
            </section>
          </div>
        </main>

        {/* ── History drawer ── */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              className="fixed top-0 right-0 bottom-0 w-[380px] bg-[#0e0e17] border-l border-white/[0.08] z-50 shadow-2xl flex flex-col">
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2"><History className="w-4 h-4 text-indigo-400" /> Sent history</h3>
                <button onClick={() => setShowHistory(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05]"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-10">No emails sent yet.</p>
                ) : history.map(h => (
                  <div key={h.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${h.status === "sent" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{h.status}</span>
                      <span className="text-[10px] text-slate-600">{new Date(h.sentAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-medium mt-1.5 truncate">{h.subject}</div>
                    <div className="text-[10px] text-slate-500 truncate">{h.company} · {h.role}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile modal ── */}
        <AnimatePresence>
          {profileOpen && <ProfileModal details={details} onClose={() => setProfileOpen(false)} onSave={saveProfile} />}
        </AnimatePresence>
      </div>

      {/* Print view */}
      <div id="email-print" className="hidden" aria-hidden>
        <h2>{editorSubject}</h2>
        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #email-print, #email-print * { visibility: visible; }
          #email-print { display: block !important; position: absolute; inset: 0; padding: 48px; font-family: Georgia, serif; color: #111; font-size: 14px; line-height: 1.6; max-width: 640px; }
          #email-print h2 { font-family: Arial, sans-serif; font-size: 18px; margin-bottom: 16px; }
        }
      `}</style>
    </ErrorBoundary>
  );
}

function ToolBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
      {children}
    </button>
  );
}

function ActionBtn({ icon: Icon, label, onClick, accent, gradient, disabled }: { icon: any; label: string; onClick: () => void; accent?: boolean; gradient?: boolean; disabled?: boolean }) {
  const cls = gradient
    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400"
    : accent
      ? "bg-white/[0.04] border border-white/10 text-slate-200 hover:border-white/25 hover:bg-white/[0.06]"
      : "bg-white/[0.04] border border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/[0.06]";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${cls}`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function Search({ className }: { className?: string }) {
  return <span className={className}>⌕</span>;
}

// ─── Profile modal ──────────────────────────────────────────────────
function ProfileModal({ details, onClose, onSave }: { details: CareerDetails; onClose: () => void; onSave: (d: CareerDetails) => Promise<boolean> }) {
  const [d, setD] = useState<CareerDetails>({ ...details, projects: details.projects.map(p => ({ ...p })), certifications: details.certifications.map(c => ({ ...c })), achievements: [...details.achievements] });
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<CareerDetails>) => setD(prev => ({ ...prev, ...patch }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-white/10 p-6"
        style={{ background: "rgba(15,15,24,0.98)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" /> Outreach profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">One profile, used by AI to personalize every email. Add your links, projects &amp; certifications.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05]"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target role" value={d.targetRole} onChange={v => set({ targetRole: v })} placeholder="e.g. Full-Stack Developer" />
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Seeking</label>
              <select value={d.employmentType} onChange={e => set({ employmentType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50">
                <option value="internship">Internship</option>
                <option value="fulltime">Full-time</option>
              </select>
            </div>
            <Field label="City / Location" value={d.location} onChange={v => set({ location: v })} placeholder="e.g. Chennai" />
            <Field label="Phone" value={d.phone} onChange={v => set({ phone: v })} placeholder="+91 …" />
            <Field label="GitHub URL" value={d.github} onChange={v => set({ github: v })} placeholder="https://github.com/…" />
            <Field label="LinkedIn URL" value={d.linkedin} onChange={v => set({ linkedin: v })} placeholder="https://linkedin.com/in/…" />
            <Field label="Portfolio URL" value={d.portfolio} onChange={v => set({ portfolio: v })} placeholder="https://…" />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block">Achievements <span className="normal-case text-slate-600">(one per line)</span></label>
            <textarea value={d.achievements.join("\n")} rows={2} placeholder={"Won hackathon X\nTop 1% on HackerRank"} onChange={e => set({ achievements: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50 resize-y" />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block flex items-center justify-between">
              Projects
              <button onClick={() => set({ projects: [...d.projects, { name: "", tech: "", description: "", link: "" }] })}
                className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold">+ Add project</button>
            </label>
            <div className="space-y-2">
              {d.projects.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={p.name} onChange={e => { const arr = [...d.projects]; arr[i] = { ...p, name: e.target.value }; set({ projects: arr }); }} placeholder="Project name"
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                    <input value={p.tech} onChange={e => { const arr = [...d.projects]; arr[i] = { ...p, tech: e.target.value }; set({ projects: arr }); }} placeholder="Tech stack"
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                  <input value={p.description} onChange={e => { const arr = [...d.projects]; arr[i] = { ...p, description: e.target.value }; set({ projects: arr }); }} placeholder="What it does + measurable impact"
                    className="w-full p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                  <div className="flex gap-2">
                    <input value={p.link} onChange={e => { const arr = [...d.projects]; arr[i] = { ...p, link: e.target.value }; set({ projects: arr }); }} placeholder="Project link"
                      className="flex-1 p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                    <button onClick={() => set({ projects: d.projects.filter((_, j) => j !== i) })}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20">Remove</button>
                  </div>
                </div>
              ))}
              {d.projects.length === 0 && <p className="text-xs text-slate-600">Add 2–3 projects — the AI will reference them in your emails.</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block flex items-center justify-between">
              Certifications
              <button onClick={() => set({ certifications: [...d.certifications, { name: "", issuer: "", year: "" }] })}
                className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold">+ Add</button>
            </label>
            <div className="space-y-2">
              {d.certifications.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input value={c.name} onChange={e => { const arr = [...d.certifications]; arr[i] = { ...c, name: e.target.value }; set({ certifications: arr }); }} placeholder="Certificate"
                    className="flex-1 p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                  <input value={c.issuer} onChange={e => { const arr = [...d.certifications]; arr[i] = { ...c, issuer: e.target.value }; set({ certifications: arr }); }} placeholder="Issuer"
                    className="flex-1 p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                  <input value={c.year} onChange={e => { const arr = [...d.certifications]; arr[i] = { ...c, year: e.target.value }; set({ certifications: arr }); }} placeholder="Year"
                    className="w-20 p-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50" />
                  <button onClick={() => set({ certifications: d.certifications.filter((_, j) => j !== i) })}
                    className="px-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button onClick={async () => { setSaving(true); const ok = await onSave(d); setSaving(false); if (ok) onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold text-white flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-indigo-500/50 placeholder:text-slate-600" />
    </div>
  );
}
