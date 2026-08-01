"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Target, Award, Radar, Brain, Code2, BookOpen, Mic, Users, Zap, ChevronRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const MODULE_SCORES = [
  { name: "Aptitude", score: 78, icon: Brain, color: "text-indigo-400", bg: "rgba(99,102,241,0.1)" },
  { name: "Reasoning", score: 65, icon: TrendingUp, color: "text-purple-400", bg: "rgba(168,85,247,0.1)" },
  { name: "Verbal", score: 82, icon: BookOpen, color: "text-cyan-400", bg: "rgba(6,182,212,0.1)" },
  { name: "Technical", score: 58, icon: Code2, color: "text-rose-400", bg: "rgba(244,63,94,0.1)" },
  { name: "Mock Interview", score: 45, icon: Mic, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
  { name: "Behavioral", score: 71, icon: Users, color: "text-amber-400", bg: "rgba(245,158,11,0.1)" },
];

const WEAK_AREAS = [
  { topic: "Dynamic Programming", module: "Technical", attempts: 12, success: 25 },
  { topic: "Data Interpretation", module: "Aptitude", attempts: 8, success: 37 },
  { topic: "Sentence Correction", module: "Verbal", attempts: 15, success: 40 },
  { topic: "Graph Algorithms", module: "Technical", attempts: 6, success: 33 },
  { topic: "Blood Relations", module: "Reasoning", attempts: 10, success: 30 },
];

const RECENT_ACTIVITY = [
  { type: "Quiz", name: "Aptitude Daily Quiz", score: "7/10", time: "2 hours ago" },
  { type: "Practice", name: "Python Coding Challenge", score: "Completed", time: "1 day ago" },
  { type: "Mock", name: "Technical Mock Interview", score: "65%", time: "2 days ago" },
  { type: "Quiz", name: "Verbal Weekly Test", score: "8/10", time: "3 days ago" },
];

const INSIGHTS = [
  { label: "Overall Readiness", value: "62%", color: "text-amber-400" },
  { label: "Placement Probability", value: "48%", color: "text-rose-400" },
  { label: "Questions Solved", value: "347", color: "text-emerald-400" },
  { label: "Avg Accuracy", value: "71%", color: "text-indigo-400" },
  { label: "Streak", value: "3 days", color: "text-orange-400" },
  { label: "Rank", value: "#1,234", color: "text-purple-400" },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("analytics load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div data-tour="prep-analytics-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Smart Analytics</h1>
                <p className="text-sm text-slate-400">Track your preparation with detailed metrics, trends, and AI-powered insights</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div data-tour="prep-analytics-stats" className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {INSIGHTS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="p-3 rounded-xl border border-white/5 text-center" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            {/* Module Scores */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Radar className="w-4 h-4 text-indigo-400" /> Module Performance</h2>
              <div className="space-y-2.5">
                {MODULE_SCORES.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                        {m.name}
                      </div>
                      <span className={m.color}>{m.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.score}%`, background: m.bg.match(/[\d.]+/)?.[0] ? `rgba(${m.bg.match(/[\d.]+/g)?.slice(0,3).join(",")},0.8)` : undefined }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weak Areas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-400" /> Weak Areas</h2>
              <div className="space-y-2">
                {WEAK_AREAS.map((area, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: "rgba(244,63,94,0.05)" }}>
                    <div>
                      <div className="text-xs font-medium">{area.topic}</div>
                      <div className="text-[10px] text-slate-500">{area.module} · {area.attempts} attempts</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-rose-400">{area.success}%</div>
                      <div className="text-[10px] text-slate-500">success</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/interview-preparation/aptitude"
                className="flex items-center justify-center gap-1 w-full mt-3 p-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-all">
                Practice Weak Areas <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div data-tour="prep-analytics-activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
            className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> Recent Activity</h2>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${a.type === "Quiz" ? "bg-indigo-500/10" : a.type === "Practice" ? "bg-emerald-500/10" : "bg-purple-500/10"}`}>
                      {a.type === "Quiz" ? <Brain className="w-3 h-3 text-indigo-400" /> : a.type === "Practice" ? <Code2 className="w-3 h-3 text-emerald-400" /> : <Mic className="w-3 h-3 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{a.name}</div>
                      <div className="text-[10px] text-slate-500">{a.time}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${a.score === "Completed" ? "text-emerald-400" : "text-indigo-400"}`}>{a.score}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <PageTour
          id="prep-analytics"
          steps={[
            { target: "[data-tour='prep-analytics-header']", title: "Smart Analytics", body: "Your complete interview-prep performance across every module." },
            { target: "[data-tour='prep-analytics-stats']", title: "Key insights", body: "Questions answered, accuracy, streaks and more at a glance." },
            { target: "[data-tour='prep-analytics-activity']", title: "Recent activity", body: "Every practice session logged — see your momentum." },
          ]}
        />
      </main>
    </div>
  );
}
