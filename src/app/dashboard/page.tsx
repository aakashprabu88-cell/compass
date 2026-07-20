"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Shield, ChevronRight, TrendingUp, TrendingDown, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { formatSalary, getRiskBg, getGrowthBg } from "@/lib/utils";

interface UserData { id: string; name: string; email: string; onboarded: boolean; }
interface PathData { id: string; matchScore: number; skillMatch: number; interestMatch: number; aiSafetyScore: number; rank: number; careerPath: any; }
interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/skills", label: "Skill Gaps", icon: Target },
  { href: "/market", label: "Market Intel", icon: BarChart3 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [gaps, setGaps] = useState<SkillGapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/paths").then(r => r.json()),
      fetch("/api/skills").then(r => r.json()),
    ]).then(([userData, pathsData, gapsData]) => {
      if (userData.error) { router.push("/login"); return; }
      if (!userData.onboarded) { router.push("/onboarding"); return; }
      setUser(userData);
      setPaths(Array.isArray(pathsData) ? pathsData : []);
      setGaps(Array.isArray(gapsData) ? gapsData : []);
      setLoading(false);
    }).catch(() => router.push("/login"));
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.href === "/dashboard" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
              {user?.name?.[0]}
            </div>
            <div className="text-sm truncate">{user?.name}</div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-slate-400 text-sm mb-8">Here&apos;s your career intelligence overview</p>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Top Match", value: topPath?.careerPath?.title?.split(" ").slice(0, 2).join(" ") || "—", sub: topPath ? `${Math.round(topPath.matchScore * 100)}% match` : "", icon: Sparkles, color: "indigo" },
              { label: "Avg Compatibility", value: `${avgMatch}%`, sub: `Across ${paths.length} paths`, icon: Target, color: "emerald" },
              { label: "AI Safety Score", value: `${avgSafety}%`, sub: "Your paths on average", icon: Shield, color: avgSafety > 70 ? "emerald" : avgSafety > 40 ? "yellow" : "red" },
              { label: "Skill Gaps", value: `${highPriorityGaps}`, sub: "High priority to fill", icon: AlertTriangle, color: highPriorityGaps > 3 ? "red" : "yellow" },
            ].map((stat, i) => (
              <div key={i} className="glass p-5 glass-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div className="text-xl font-bold mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Top 3 Career Paths */}
            <div className="col-span-2 glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Your Top Career Paths</h2>
                <Link href="/paths" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {paths.slice(0, 5).map((p, i) => (
                  <Link key={p.id} href={`/paths`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-indigo-500/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                      #{p.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-indigo-400 transition-colors truncate">{p.careerPath.title}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">{formatSalary(p.careerPath.salaryMin)}–{formatSalary(p.careerPath.salaryMax)}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${getRiskBg(p.careerPath.aiRisk)}`}>
                          AI: {p.careerPath.aiRisk}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${getGrowthBg(p.careerPath.growthOutlook)}`}>
                          {p.careerPath.growthOutlook}
                        </span>
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
            </div>

            {/* Skill Gaps Summary */}
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Skill Gaps</h2>
                <Link href="/skills" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Fix <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {gaps.slice(0, 6).map(gap => (
                  <div key={gap.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{gap.skillName}</span>
                      <span className={`text-xs ${gap.priority === "high" ? "text-red-400" : gap.priority === "medium" ? "text-yellow-400" : "text-slate-500"}`}>
                        {gap.gap} gap
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${gap.currentLevel * 10}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-600">Current: {gap.currentLevel}/10</span>
                      <span className="text-[10px] text-slate-600">Need: {gap.requiredLevel}/10</span>
                    </div>
                  </div>
                ))}
                {gaps.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">Complete your assessment to see skill gaps</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Insight */}
          {topPath && (
            <div className="mt-6 glass p-6 glow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Career Insight</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Based on your profile, <strong className="text-white">{topPath.careerPath.title}</strong> is your strongest match at <strong className="text-indigo-400">{Math.round(topPath.matchScore * 100)}%</strong> compatibility. 
                    {topPath.careerPath.futureOutlook ? ` ${topPath.careerPath.futureOutlook}` : ""}
                    {highPriorityGaps > 0 ? ` Focus on building ${highPriorityGaps} high-priority skills to strengthen your candidacy.` : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
