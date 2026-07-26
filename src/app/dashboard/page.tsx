"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Target, Shield, AlertTriangle, Sparkles, ArrowRight, FileText, Calendar, Zap, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { formatSalary, getRiskBg, getGrowthBg } from "@/lib/utils";

interface UserData { id: string; name: string; email: string; onboarded: boolean; }
interface PathData { id: string; matchScore: number; skillMatch: number; interestMatch: number; aiSafetyScore: number; rank: number; careerPath: any; }
interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }
interface WeeklyReport { applicationsSent: number; interviewsScheduled: number; summary: string; recommendations: string[]; topCareerMatch: string; }
interface AICareerAdvice { recommendedPaths: { title: string; matchScore: number; reason: string; salaryRange: string; growthOutlook: string }[]; skillGaps: { skill: string; priority: string; howToLearn: string }[]; actionPlan: string[]; summary: string; }

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [gaps, setGaps] = useState<SkillGapData[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [aiAdvice, setAiAdvice] = useState<AICareerAdvice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadDashboard() {
      try {
        const authRes = await fetch("/api/auth/me").catch(() => null);
        if (cancelled) return;
        if (!authRes || !authRes.ok) { router.push("/login"); return; }
        const userData = await authRes.json();
        if (!userData || userData.error) { router.push("/login"); return; }
        if (!userData.onboarded) { router.push("/onboarding"); return; }
        setUser(userData);

        const safeFetch = (url: string) =>
          fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);

        const [pathsData, gapsData, reportData] = await Promise.all([
          safeFetch("/api/paths"),
          safeFetch("/api/skills"),
          safeFetch("/api/weekly-report"),
        ]);

        const appsData = await safeFetch("/api/apply");
        setApplications(Array.isArray(appsData) ? appsData : []);

        if (cancelled) return;
        setPaths(Array.isArray(pathsData) ? pathsData : []);
        setGaps(Array.isArray(gapsData) ? gapsData : []);
        const report = reportData && !reportData.error ? reportData : null;
        if (report && typeof report.recommendations === "string") {
          try { report.recommendations = JSON.parse(report.recommendations); } catch { report.recommendations = []; }
        }
        if (report && typeof report.skillsImproved === "string") {
          try { report.skillsImproved = JSON.parse(report.skillsImproved); } catch { report.skillsImproved = []; }
        }
        setWeeklyReport(report);

        try {
          const cached = localStorage.getItem("compass_career_advice");
          if (cached) setAiAdvice(JSON.parse(cached));
        } catch {}

        setLoading(false);
      } catch {
        if (!cancelled) router.push("/login");
      }
    }

    loadDashboard();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const topPath = paths[0];
  const avgMatch = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.matchScore, 0) / paths.length * 100) : 0;
  const avgSafety = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.aiSafetyScore, 0) / paths.length * 100) : 0;
  const highPriorityGaps = gaps.filter(g => g.priority === "high").length;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p className="text-slate-400 text-sm mb-8">Here&apos;s your career intelligence overview</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { href: "/co-pilot", label: "Ask AI Co-pilot", icon: Sparkles, color: "from-indigo-500 to-purple-500" },
              { href: "/mock-interview", label: "Practice Interview", icon: Target, color: "from-rose-500 to-pink-500" },
              { href: "/resume-builder", label: "Build Resume", icon: FileText, color: "from-cyan-500 to-blue-500" },
              { href: "/jobs", label: "Find Jobs", icon: Zap, color: "from-amber-500 to-orange-500" },
            ].map((action, i) => (
              <Link key={i} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium group-hover:text-indigo-400 transition-colors">{action.label}</span>
              </Link>
            ))}
          </motion.div>

          {/* AI Career Advice Summary */}
          {aiAdvice && aiAdvice.recommendedPaths && aiAdvice.recommendedPaths.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass p-6 mb-8 glow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" }} />
              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-semibold text-base">AI Career Analysis</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium">GEMINI POWERED</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{aiAdvice.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                    {aiAdvice.recommendedPaths.slice(0, 5).map((path, i) => (
                      <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate">{path.title}</span>
                          <span className="text-xs font-bold text-indigo-400">{path.matchScore}%</span>
                        </div>
                        <div className="text-xs text-slate-500">{path.salaryRange}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-slate-500">{path.growthOutlook} growth</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {aiAdvice.actionPlan && aiAdvice.actionPlan.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Your Action Plan</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAdvice.actionPlan.map((step, i) => (
                          <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-slate-300">{i + 1}. {step}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Top Match", value: topPath?.careerPath?.title?.split(" ").slice(0, 2).join(" ") || aiAdvice?.recommendedPaths?.[0]?.title?.split(" ").slice(0, 2).join(" ") || "—", sub: topPath ? `${Math.round(topPath.matchScore * 100)}% match` : aiAdvice?.recommendedPaths?.[0] ? `${aiAdvice.recommendedPaths[0].matchScore}% match` : "", icon: Sparkles, color: "indigo" },
              { label: "Avg Compatibility", value: `${avgMatch || (aiAdvice ? Math.round(aiAdvice.recommendedPaths.reduce((s, p) => s + p.matchScore, 0) / aiAdvice.recommendedPaths.length) : 0)}%`, sub: `Across ${paths.length || aiAdvice?.recommendedPaths?.length || 0} paths`, icon: Target, color: "emerald" },
              { label: "AI Safety Score", value: `${avgSafety}%`, sub: "Your paths on average", icon: Shield, color: avgSafety > 70 ? "emerald" : avgSafety > 40 ? "yellow" : "red" },
              { label: "Skill Gaps", value: `${highPriorityGaps || aiAdvice?.skillGaps?.filter(g => g.priority === "High").length || 0}`, sub: "High priority to fill", icon: AlertTriangle, color: (highPriorityGaps || 0) > 3 ? "red" : "yellow" },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="glass p-5 glass-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div className="text-xl font-bold mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Application Activity */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Applications Sent", value: applications.length, icon: FileText, color: "indigo" },
              { label: "Auto-Applied", value: applications.filter(a => a.autoApplied).length, icon: Zap, color: "purple" },
            ].map((stat, i) => (
              <motion.div key={i} custom={i + 4} variants={fadeUp} initial="hidden" animate="visible" className="glass p-5 glass-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div className="text-xl font-bold mb-0.5">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Career Paths */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2 glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Your Top Career Paths</h2>
                <Link href="/paths" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-3">
                {paths.slice(0, 5).map((p) => (
                  <Link key={p.id} href="/paths" className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-indigo-500/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">#{p.rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-indigo-400 transition-colors truncate">{p.careerPath.title}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">{formatSalary(p.careerPath.salaryMin)}–{formatSalary(p.careerPath.salaryMax)}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${getRiskBg(p.careerPath.aiRisk)}`}>AI: {p.careerPath.aiRisk}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${getGrowthBg(p.careerPath.growthOutlook)}`}>{p.careerPath.growthOutlook}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-indigo-400">{Math.round(p.matchScore * 100)}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">match</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Skill Gaps */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Skill Gaps</h2>
                <Link href="/skills" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">Fix <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-4">
                {gaps.slice(0, 6).map(gap => (
                  <div key={gap.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{gap.skillName}</span>
                      <span className={`text-xs ${gap.priority === "high" ? "text-red-400" : gap.priority === "medium" ? "text-yellow-400" : "text-slate-500"}`}>{gap.gap} gap</span>
                    </div>
                    <div className="skill-bar"><div className="skill-bar-fill bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${gap.currentLevel * 10}%` }} /></div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-600">Current: {gap.currentLevel}/10</span>
                      <span className="text-[10px] text-slate-600">Need: {gap.requiredLevel}/10</span>
                    </div>
                  </div>
                ))}
                {gaps.length === 0 && aiAdvice?.skillGaps && (
                  <div className="space-y-3">
                    {aiAdvice.skillGaps.slice(0, 4).map((gap, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{gap.skill}</span>
                          <span className={`text-xs ${gap.priority === "High" ? "text-red-400" : gap.priority === "Medium" ? "text-yellow-400" : "text-slate-500"}`}>{gap.priority}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed">{gap.howToLearn}</p>
                      </div>
                    ))}
                  </div>
                )}
                {gaps.length === 0 && !aiAdvice && <p className="text-sm text-slate-500 text-center py-4">Complete your assessment to see skill gaps</p>}
              </div>
            </motion.div>
          </div>

          {/* Weekly Report */}
          {weeklyReport && (
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-emerald-400" /></div>
                <div><h3 className="font-semibold">Weekly Progress Report</h3><p className="text-xs text-slate-500">Your activity this week</p></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5"><div className="text-2xl font-bold text-indigo-400">{weeklyReport.applicationsSent}</div><div className="text-xs text-slate-500">Applications Sent</div></div>
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5"><div className="text-2xl font-bold text-emerald-400">{weeklyReport.interviewsScheduled}</div><div className="text-xs text-slate-500">Interviews Scheduled</div></div>
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5"><div className="text-lg font-bold text-amber-400 truncate">{weeklyReport.topCareerMatch}</div><div className="text-xs text-slate-500">Top Match</div></div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{weeklyReport.summary}</p>
              {weeklyReport.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Recommendations</h4>
                  <ul className="space-y-1">{weeklyReport.recommendations.slice(0, 3).map((rec, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-400"><span className="text-indigo-400 mt-0.5">•</span>{rec}</li>))}</ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Recent Applications */}
          {applications.length > 0 && (
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 glass p-6">
              <h2 className="font-semibold mb-4">Recent Applications</h2>
              <div className="space-y-2">
                {applications.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${app.status === "applied" ? "bg-green-400" : app.status === "viewed" ? "bg-blue-400" : "bg-slate-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500">{app.company} · {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                    {app.autoApplied && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">AUTO</span>}
                    {app.matchScore > 0 && <span className="text-xs text-indigo-400">{Math.round(app.matchScore * 10)}%</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Insight */}
          {(topPath || aiAdvice) && (
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 glass p-6 glow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0"><Sparkles className="w-6 h-6 text-indigo-400" /></div>
                <div>
                  <h3 className="font-semibold mb-1">AI Career Insight</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {topPath ? (
                      <>Based on your profile, <strong className="text-white">{topPath.careerPath.title}</strong> is your strongest match at <strong className="text-indigo-400">{Math.round(topPath.matchScore * 100)}%</strong> compatibility. {topPath.careerPath.futureOutlook} {highPriorityGaps > 0 ? `Focus on building ${highPriorityGaps} high-priority skills.` : ""}</>
                    ) : aiAdvice ? (
                      <><strong className="text-white">{aiAdvice.recommendedPaths[0]?.title}</strong> is your top AI-recommended career at <strong className="text-indigo-400">{aiAdvice.recommendedPaths[0]?.matchScore}%</strong> match. {aiAdvice.recommendedPaths[0]?.reason}</>
                    ) : null}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
