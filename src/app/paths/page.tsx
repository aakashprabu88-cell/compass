"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Route, CheckCircle, TrendingUp } from "lucide-react";
import { formatSalary, getRiskBg, getGrowthBg } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface PathData { id: string; matchScore: number; skillMatch: number; interestMatch: number; aiSafetyScore: number; rank: number; careerPath: any; }

export default function PathsPage() {
  const router = useRouter();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selected, setSelected] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) { router.push("/"); return; }
        const userData = await authRes.json();
        if (!userData || userData.error) { router.push("/"); return; }
        if (!userData.onboarded) { router.push("/dashboard"); return; }
        if (cancelled) return;
        setUser(userData);

        const pathsRes = await fetch("/api/paths");
        if (pathsRes.ok) {
          const d = await pathsRes.json();
          if (!cancelled) setPaths(Array.isArray(d) ? d : []);
        }
      } catch { if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">AI Career Paths</h1>
            <p className="text-slate-400 text-sm mb-8">Ranked by compatibility with your skills, interests, and AI safety</p>

            <div className="grid grid-cols-3 gap-6">
              {/* List */}
              <div className="col-span-1 space-y-3">
                {paths.map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    onClick={() => setSelected(p)}
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
                  </motion.button>
                ))}
                {paths.length === 0 && (
                  <div className="glass p-8 text-center">
                    <Route className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Complete your assessment to see paths</p>
                  </div>
                )}
              </div>

              {/* Detail */}
              <div className="col-span-2">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="glass p-8"
                  >
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
                  </motion.div>
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
    </ErrorBoundary>
  );
}
