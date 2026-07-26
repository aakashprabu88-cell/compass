"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, FileText, CheckCircle, Clock, XCircle, ExternalLink, Upload, GraduationCap, Briefcase, Building2, Users, MessageCircle, TrendingUp, Mail, Eye, EyeOff, ChevronDown, ChevronUp, GitBranch, Shield, Radar, IndianRupee, Trophy, Mic } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/simulator", label: "Simulator", icon: GitBranch },
  { href: "/govt-exams", label: "Govt Exams", icon: Shield },
  { href: "/intelligence", label: "Intelligence", icon: Radar },
  { href: "/negotiation", label: "Negotiate", icon: IndianRupee },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/company-prep", label: "Company Prep", icon: Target },
  { href: "/mock-interview", label: "Mock Interview", icon: Mic },
  { href: "/resume-builder", label: "Resume Builder", icon: FileText },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

interface Application {
  id: string; jobId: string; jobTitle: string; company: string; location: string;
  status: string; appliedAt: string; autoApplied: boolean;
  coverLetter: string; emailDraft: string; matchScore: number; notes: string;
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  applied: { color: "text-blue-400 bg-blue-500/10", icon: Clock, label: "Applied" },
  sent: { color: "text-yellow-400 bg-yellow-500/10", icon: Mail, label: "Email Sent" },
  pending: { color: "text-yellow-400 bg-yellow-500/10", icon: Clock, label: "Pending" },
  interview: { color: "text-green-400 bg-green-500/10", icon: CheckCircle, label: "Interview" },
  rejected: { color: "text-red-400 bg-red-500/10", icon: XCircle, label: "Rejected" },
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cover" | "email">("cover");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
    });
    fetch("/api/apply").then(r => r.json()).then(d => {
      setApps(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const autoApps = apps.filter(a => a.autoApplied);
  const manualApps = apps.filter(a => !a.autoApplied);
  const byStatus = (s: string) => apps.filter(a => a.status === s).length;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/applications" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Job Applications</h1>
          <p className="text-slate-400 text-sm mb-6">Track all your applications — auto-applied with cover letters and manual</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Applied", value: apps.length, color: "indigo" },
              { label: "Auto-Applied", value: autoApps.length, color: "purple" },
              { label: "Interviews", value: byStatus("interview"), color: "green" },
              { label: "Rejected", value: byStatus("rejected"), color: "red" },
            ].map(s => (
              <div key={s.label} className="glass p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
                <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
              </div>
            ))}
          </div>

          {apps.length === 0 ? (
            <div className="glass p-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No applications yet</h3>
              <p className="text-sm text-slate-500 mb-4">Upload your resume and let us auto-apply with personalized cover letters</p>
              <Link href="/upload-resume" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-all">
                <Upload className="w-4 h-4" /> Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {apps.map(app => {
                const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                const StatusIcon = st.icon;
                const isOpen = expanded === app.id;
                const hasContent = app.coverLetter || app.emailDraft;
                return (
                  <div key={app.id} className="glass overflow-hidden glass-hover transition-all">
                    <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : app.id)}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${st.color.split(" ")[1]}`}>
                        <StatusIcon className={`w-5 h-5 ${st.color.split(" ")[0]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{app.jobTitle}</div>
                        <div className="text-xs text-slate-500">{app.company} — {app.location}</div>
                      </div>
                      {app.matchScore > 0 && (
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-indigo-400">{Math.round(app.matchScore * 100)}%</div>
                          <div className="text-[10px] text-slate-500">match</div>
                        </div>
                      )}
                      <div className="text-right shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        <div className="text-[10px] text-slate-600 mt-1">{new Date(app.appliedAt).toLocaleDateString()}</div>
                      </div>
                      {app.autoApplied && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">AUTO</span>
                      )}
                      {hasContent && (
                        isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    {isOpen && hasContent && (
                      <div className="px-4 pb-4 border-t border-white/5 pt-4 animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                          <button onClick={() => setViewMode("cover")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === "cover" ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
                            <Eye className="w-3 h-3 inline mr-1" /> Cover Letter
                          </button>
                          <button onClick={() => setViewMode("email")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === "email" ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
                            <Mail className="w-3 h-3 inline mr-1" /> Email Draft
                          </button>
                        </div>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-white/[0.02] rounded-xl p-4 border border-white/5 max-h-64 overflow-y-auto">
                          {viewMode === "cover" ? app.coverLetter : app.emailDraft}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
