"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Award, Target, ChevronRight, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface ScoreData {
  scores: { topic: string; score: number }[];
  overall: number;
  strong: string[];
  weak: string[];
}

export default function PerformancePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [meRes, perfRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/aptitude/performance"),
        ]);
        if (!meRes.ok) { router.push("/"); return; }
        const me = await meRes.json();
        if (!me || me.error) { router.push("/"); return; }
        if (!cancelled) setUser(me);
        if (perfRes.ok) {
          const perf = await perfRes.json();
          if (!cancelled) setData(perf);
        }
      } catch (e) { console.error("performance load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const scores = data?.scores ?? [];
  const overall = data?.overall ?? 0;
  const strong = data?.strong ?? [];
  const weak = data?.weak ?? [];

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Link href="/interview-preparation/aptitude" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Aptitude
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Performance Analytics</h1>
                <p className="text-xs text-slate-400">AI-estimated strengths based on your profile</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="p-6 rounded-2xl border border-white/5 text-center mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
            <div className="text-4xl font-bold mb-1" style={{ color: overall >= 70 ? "#22c55e" : overall >= 50 ? "#f59e0b" : "#ef4444" }}>
              {overall}%
            </div>
            <div className="text-sm text-slate-400">Estimated Aptitude Readiness</div>
          </motion.div>

          {scores.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl border border-white/5 mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="font-semibold text-sm mb-4">Topic-wise Estimate</h2>
              <div className="space-y-3">
                {scores.map((t, i) => {
                  const color = t.score >= 70 ? "bg-green-500" : t.score >= 50 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{t.topic}</span>
                        <span className="font-medium" style={{ color: t.score >= 70 ? "#22c55e" : t.score >= 50 ? "#f59e0b" : "#ef4444" }}>
                          {t.score}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${t.score}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-green-500/20" style={{ background: "rgba(16,185,129,0.03)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold">Likely Strong Areas</h3>
              </div>
              {strong.length > 0 ? (
                <ul className="space-y-1">
                  {strong.map(t => (
                    <li key={t} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-green-400" /> {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">Keep practicing to build strengths</p>
              )}
            </div>
            <div className="p-4 rounded-xl border border-red-500/20" style={{ background: "rgba(239,68,68,0.03)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold">Focus Areas</h3>
              </div>
              {weak.length > 0 ? (
                <ul className="space-y-1">
                  {weak.map(t => (
                    <li key={t} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-red-400" /> {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No critical gaps detected</p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
