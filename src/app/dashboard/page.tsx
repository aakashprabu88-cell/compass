"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Target, Shield, AlertTriangle, ArrowRight, FileText, TrendingUp, UsersRound, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { Sparkles, ChevronRight } from "lucide-react";

interface UserData { id: string; name: string; email: string; onboarded: boolean; }
interface PathData { id: string; matchScore: number; careerPath: any; }
interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [gaps, setGaps] = useState<SkillGapData[]>([]);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getVal = (key: string) => {
    const keys = key.split(".");
    let val: any = t;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === "string" ? val : key;
  };

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    async function load() {
      try {
        const safeFetch = (url: string) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
        const [pathsData, gapsData] = await Promise.all([safeFetch("/api/paths"), safeFetch("/api/skills")]);
        if (cancelled) return;
        setPaths(Array.isArray(pathsData) ? pathsData : []);
        setGaps(Array.isArray(gapsData) ? gapsData : []);

        try { const c = localStorage.getItem("compass_career_advice"); if (c) setAiAdvice(JSON.parse(c)); } catch (e) { console.error("parse cached advice", e); }
        setLoading(false);
      } catch (e) { console.error("dashboard load", e); if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const topPath = paths[0];
  const avgMatch = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.matchScore, 0) / paths.length * 100) : 0;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">{getVal("dashboard.welcome")}, {(user as any)?.name?.split(" ")[0] || "there"}</h1>
            <p className="text-slate-400 text-sm mb-8">{getVal("dashboard.overview")}</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { href: "/panel-interview", label: getVal("dashboard.panelInterview"), icon: UsersRound, color: "from-indigo-500 to-purple-500" },
              { href: "/resume-builder", label: getVal("dashboard.buildResume"), icon: FileText, color: "from-emerald-500 to-teal-500" },
              { href: "/jobs", label: getVal("dashboard.findJobs"), icon: Zap, color: "from-amber-500 to-orange-500" },
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

          {/* AI Career Advice */}
          {aiAdvice?.recommendedPaths?.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="p-6 mb-8 rounded-2xl border border-indigo-500/20 relative overflow-hidden" style={{ background: "rgba(99,102,241,0.05)" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-semibold">{getVal("dashboard.aiAnalysis")}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium">AI POWERED</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{aiAdvice.summary}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {aiAdvice.recommendedPaths.slice(0, 5).map((p: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-sm font-medium truncate">{p.title}</div>
                        <div className="text-xs text-indigo-400 font-bold">{p.matchScore}%</div>
                        <div className="text-[10px] text-slate-500">{p.salaryRange}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: getVal("dashboard.topMatch"), value: topPath?.careerPath?.title?.split(" ").slice(0, 2).join(" ") || aiAdvice?.recommendedPaths?.[0]?.title?.split(" ").slice(0, 2).join(" ") || "—", icon: Sparkles },
              { label: getVal("dashboard.avgMatch"), value: `${avgMatch || (aiAdvice?.recommendedPaths?.length ? Math.round(aiAdvice.recommendedPaths.reduce((s: number, p: any) => s + p.matchScore, 0) / aiAdvice.recommendedPaths.length) : 0)}%`, icon: Target },
              { label: getVal("dashboard.skillGaps"), value: `${gaps.filter(g => g.priority === "high").length || aiAdvice?.skillGaps?.filter((g: any) => g.priority === "High").length || 0}`, icon: AlertTriangle },
              { label: getVal("dashboard.pathsFound"), value: `${paths.length || aiAdvice?.recommendedPaths?.length || 0}`, icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Career Paths + Skill Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm">{getVal("dashboard.topCareerPaths")}</h2>
                <Link href="/paths" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">{getVal("dashboard.viewAll")} <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-2">
                {(paths.length > 0 ? paths.slice(0, 5) : aiAdvice?.recommendedPaths?.slice(0, 5)?.map((p: any, i: number) => ({ id: String(i), matchScore: p.matchScore / 100, careerPath: { title: p.title, salaryMin: 0, salaryMax: 0, aiRisk: "Low", growthOutlook: p.growthOutlook } })) || []).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                      {Math.round(p.matchScore * 100)}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.careerPath.title}</div>
                      <div className="text-xs text-slate-500">{p.careerPath.growthOutlook} growth</div>
                    </div>
                  </div>
                ))}
                {paths.length === 0 && !aiAdvice && <p className="text-sm text-slate-500 text-center py-4">{getVal("dashboard.noPaths")}</p>}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm">{getVal("dashboard.skillGapsTitle")}</h2>
                <Link href="/skills" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">{getVal("dashboard.fix")} <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-3">
                {gaps.slice(0, 5).map(gap => (
                  <div key={gap.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{gap.skillName}</span>
                      <span className={gap.priority === "high" ? "text-red-400" : "text-amber-400"}>{gap.gap} gap</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${gap.currentLevel * 10}%` }} />
                    </div>
                  </div>
                ))}
                {gaps.length === 0 && aiAdvice?.skillGaps && aiAdvice.skillGaps.slice(0, 4).map((g: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{g.skill}</span>
                      <span className={g.priority === "High" ? "text-red-400" : "text-amber-400"}>{g.priority}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">{g.howToLearn}</p>
                  </div>
                ))}
                {gaps.length === 0 && !aiAdvice && <p className="text-sm text-slate-500 text-center py-4">{getVal("dashboard.noGaps")}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
