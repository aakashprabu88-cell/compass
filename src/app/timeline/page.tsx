"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, FileText, Users, TrendingUp, ChevronRight, IndianRupee, MessageCircle, Briefcase, Building2, GraduationCap, GitBranch, Shield, Radar, Trophy } from "lucide-react";

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

interface TimelineStage {
  title: string;
  years: string;
  salary: string;
  skills: string[];
  description: string;
}

interface CareerTimeline {
  career: string;
  stages: TimelineStage[];
}

const STAGE_COLORS = ["bg-indigo-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500"];

export default function TimelinePage() {
  const router = useRouter();
  const [timelines, setTimelines] = useState<CareerTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      fetch("/api/interview-prep?career=Software Engineer").then(() => {
        // Get timelines from a simple import
        import("@/lib/timeline").then(mod => {
          setTimelines(mod.getAllTimelines());
          setLoading(false);
        });
      });
    });
  }, [router]);

  const activeTimeline = timelines.find(t => t.career === selected) || timelines[0];

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/timeline" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Career Timeline</h1>
          <p className="text-slate-400 text-sm mb-6">Visualize your career progression from entry level to leadership</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {timelines.map(t => (
              <button key={t.career} onClick={() => setSelected(t.career)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${(selected || timelines[0]?.career) === t.career ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
                {t.career}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : activeTimeline ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-emerald-500 to-purple-500 opacity-30" />

              <div className="space-y-8">
                {activeTimeline.stages.map((stage, i) => (
                  <div key={i} className="relative flex gap-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    {/* Stage indicator */}
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-full ${STAGE_COLORS[i % STAGE_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 glass p-6 glass-hover transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{stage.title}</h3>
                          <p className="text-sm text-slate-400">{stage.years}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-emerald-400 font-bold">
                            <IndianRupee className="w-4 h-4" />{stage.salary}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{stage.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                      {i < activeTimeline.stages.length - 1 && (
                        <div className="flex items-center gap-1 mt-4 text-xs text-slate-500">
                          <ChevronRight className="w-3 h-3" />
                          <span>Next: {activeTimeline.stages[i + 1].title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-12 text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">Select a career</h3>
              <p className="text-sm text-slate-500">Choose a career path above to see the progression timeline.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
