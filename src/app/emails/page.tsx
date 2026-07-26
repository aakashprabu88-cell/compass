"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Briefcase, Mail, FileText, Upload, GraduationCap, Building2, Users, MessageCircle, Calendar, ChevronDown, ChevronUp, Send, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: string;
  autoApplied: boolean;
  coverLetter: string;
  emailDraft: string;
  matchScore: number;
  appliedAt: string;
  notes: string;
}

export default function EmailsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"email" | "cover">("email");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
    });
    fetch("/api/apply").then(r => r.json()).then(d => {
      setApplications(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  const selectedApp = applications.find(a => a.id === selected);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/emails" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className={`${selected ? "w-80" : "flex-1 max-w-3xl"} border-r border-white/5 overflow-y-auto transition-all`}>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-2xl font-bold mb-1">Sent Emails</h1>
            <p className="text-slate-400 text-sm">
              {applications.length === 0 ? "No applications yet" : `${applications.length} application${applications.length !== 1 ? "s" : ""} sent`}
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No emails yet</h3>
              <p className="text-sm text-slate-500 mb-4">Apply to jobs to see the email drafts here</p>
              <Link href="/jobs" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:bg-indigo-400 transition-all">
                <Briefcase className="w-4 h-4" /> Browse Jobs
              </Link>
            </div>
          ) : (
            <div>
              {applications.map(app => (
                <button key={app.id} onClick={() => { setSelected(app.id === selected ? null : app.id); setView("email"); }}
                  className={`w-full text-left p-5 border-b border-white/5 hover:bg-white/[0.02] transition-all ${selected === app.id ? "bg-indigo-500/5 border-l-2 border-l-indigo-500" : ""}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-sm truncate">{app.company}</span>
                    {app.autoApplied && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 ml-2">AUTO</span>}
                  </div>
                  <p className="text-xs text-indigo-400 mb-1">{app.jobTitle}</p>
                  <p className="text-xs text-slate-500 truncate">{app.emailDraft.split("\n")[0]}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-600">
                    <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                    {app.matchScore > 0 && <span className="text-indigo-400">{Math.round(app.matchScore * 10)}% match</span>}
                    {app.emailDraft && <span className="flex items-center gap-0.5 text-green-500"><Send className="w-2.5 h-2.5" /> Email drafted</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Email Preview */}
        {selectedApp ? (
          <div className="flex-1 overflow-y-auto">
            {/* Toggle */}
            <div className="flex border-b border-white/5">
              <button onClick={() => setView("email")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${view === "email" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-white"}`}>
                <Mail className="w-4 h-4" /> Email Draft
              </button>
              <button onClick={() => setView("cover")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${view === "cover" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-white"}`}>
                <FileText className="w-4 h-4" /> Cover Letter
              </button>
            </div>

            {/* Email Format View */}
            <div className="p-8">
              <div className="glass p-8 max-w-2xl">
                {view === "email" ? (
                  <div>
                    <div className="border-b border-white/10 pb-4 mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 w-16">To:</span>
                        <span className="text-white">hiring@{selectedApp.company.toLowerCase().replace(/\s+/g, "")}.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 w-16">From:</span>
                        <span className="text-slate-300">you@email.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 w-16">Subject:</span>
                        <span className="text-white font-medium">{selectedApp.emailDraft.split("\n")[0].replace("Subject: ", "")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 w-16">Date:</span>
                        <span className="text-slate-400">{new Date(selectedApp.appliedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedApp.emailDraft.split("\n").slice(2).join("\n")}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedApp.coverLetter}
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-medium">Job:</span>
                    <span>{selectedApp.jobTitle} at {selectedApp.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-medium">Location:</span>
                    <span>{selectedApp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-medium">Match:</span>
                    <span>{selectedApp.matchScore > 0 ? `${Math.round(selectedApp.matchScore * 10)}%` : "N/A"}</span>
                  </div>
                  {selectedApp.notes && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-medium">Verification:</span>
                      <span>{selectedApp.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Select an email to preview</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
