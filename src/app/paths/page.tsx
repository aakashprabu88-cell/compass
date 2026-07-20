"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Shield, ChevronRight, ArrowRight, ExternalLink, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { formatSalary, getRiskBg, getGrowthBg } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/skills", label: "Skill Gaps", icon: Target },
  { href: "/market", label: "Market Intel", icon: BarChart3 },
];

interface PathData { id: string; matchScore: number; skillMatch: number; interestMatch: number; aiSafetyScore: number; rank: number; careerPath: any; }

export default function PathsPage() {
  const router = useRouter();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selected, setSelected] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
    });
    fetch("/api/paths").then(r => r.json()).then(d => {
      setPaths(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div>
          <span className="font-bold">Compass</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/paths" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">AI Career Paths</h1>
          <p className="text-slate-400 text-sm mb-8">Ranked by compatibility with your skills, interests, and AI safety</p>

          <div className="grid grid-cols-3 gap-6">
            {/* List */}
            <div className="col-span-1 space-y-3">
              {paths.map(p => (
                <button key={p.id} onClick={() => setSelected(p)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === p.id
                      ? "bg-indigo-500/10 border-indigo-500/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">#{p.rank}</span>
                    <span className="text-lg font-bold text-indigo-400">{Math.round(p.matchScore * 100)}%</span>
                  </div>
                  <div className="font-medium text-sm mb-1">{p.careerPath.title}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRiskBg(p.careerPath.aiRisk)}`}>AI: {p.careerPath.aiRisk}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getGrowthBg(p.careerPath.growthOutlook)}`}>{p.careerPath.growthOutlook}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="col-span-2">
              {selected ? (
                <div className="glass p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selected.careerPath.title}</h2>
                      <p className="text-slate-400 text-sm">{selected.careerPath.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-indigo-400">{Math.round(selected.matchScore * 100)}%</div>
                      <div className="text-xs text-slate-500">match score</div>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Skill Match", value: Math.round(selected.skillMatch * 100), color: "indigo" },
                      { label: "Interest Match", value: Math.round(selected.interestMatch * 100), color: "purple" },
                      { label: "AI Safety", value: Math.round(selected.aiSafetyScore * 100), color: "emerald" },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                        <div className="flex items-end gap-2">
                          <span className={`text-xl font-bold text-${s.color}-400`}>{s.value}%</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/5 mb-1.5">
                            <div className={`h-full rounded-full bg-${s.color}-500`} style={{ width: `${s.value}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Compensation</h3>
                      <div className="text-2xl font-bold">{formatSalary(selected.careerPath.salaryMin)} – {formatSalary(selected.careerPath.salaryMax)}</div>
                      <div className="text-xs text-slate-500 mt-1">Average US salary range</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Entry Path</h3>
                      <div className="text-lg font-medium">{selected.careerPath.educationLevel}</div>
                      <div className="text-xs text-slate-500 mt-1">Time to entry: {selected.careerPath.timeToEntry}</div>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(selected.careerPath.requiredSkills || "[]").map((skill: string) => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(selected.careerPath.industries || "[]").map((ind: string) => (
                        <span key={ind} className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 text-xs border border-white/5">{ind}</span>
                      ))}
                    </div>
                  </div>

                  {/* Key Tasks */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">What You&apos;d Do</h3>
                    <div className="space-y-2">
                      {JSON.parse(selected.careerPath.keyTasks || "[]").map((task: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Future Outlook */}
                  {selected.careerPath.futureOutlook && (
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold">Future Outlook</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{selected.careerPath.futureOutlook}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass p-12 text-center">
                  <Route className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">Select a career path</h3>
                  <p className="text-sm text-slate-500">Click any path on the left to see detailed AI analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
