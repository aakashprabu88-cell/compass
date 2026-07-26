"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, TrendingUp, Target, Clock, Star, ChevronRight, BarChart3, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import Sidebar from "@/components/Sidebar";

interface InterviewSession {
  id: string;
  date: string;
  role: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  starScore: number;
  questionCount: number;
  duration: number; // seconds
  strengths: string[];
  improvements: string[];
}

export default function InterviewTrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InterviewSession | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        try {
          const stored = JSON.parse(localStorage.getItem("compass_interview_history") || "[]");
          setSessions(Array.isArray(stored) ? stored.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []);
        } catch { setSessions([]); }
        setLoading(false);
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const clearHistory = () => {
    if (confirm("Clear all interview history?")) {
      localStorage.removeItem("compass_interview_history");
      setSessions([]);
      setSelected(null);
    }
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    localStorage.setItem("compass_interview_history", JSON.stringify(updated));
    setSessions(updated);
    if (selected?.id === id) setSelected(null);
  };

  const stats = {
    totalSessions: sessions.length,
    avgScore: sessions.length ? Math.round(sessions.reduce((s, x) => s + x.overallScore, 0) / sessions.length) : 0,
    bestScore: sessions.length ? Math.max(...sessions.map(s => s.overallScore)) : 0,
    totalTime: sessions.reduce((s, x) => s + x.duration, 0),
    trend: sessions.length >= 2 ? sessions[0].overallScore - sessions[sessions.length - 1].overallScore : 0,
  };

  const chartData = sessions.slice(0, 20).reverse().map((s, i) => ({
    name: `#${i + 1}`,
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overall: s.overallScore,
    communication: s.communicationScore,
    technical: s.technicalScore,
    star: s.starScore,
  }));

  const categoryData = [
    { name: "Communication", avg: sessions.length ? Math.round(sessions.reduce((s, x) => s + x.communicationScore, 0) / sessions.length) : 0 },
    { name: "Technical", avg: sessions.length ? Math.round(sessions.reduce((s, x) => s + x.technicalScore, 0) / sessions.length) : 0 },
    { name: "STAR Method", avg: sessions.length ? Math.round(sessions.reduce((s, x) => s + x.starScore, 0) / sessions.length) : 0 },
  ];

  const allStrengths = [...new Set(sessions.flatMap(s => s.strengths))];
  const allImprovements = [...new Set(sessions.flatMap(s => s.improvements))];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Mic className="w-6 h-6 text-rose-400" /> Interview Performance</h1>
              <p className="text-slate-400 text-sm mt-1">Track your mock interview scores and improvement over time</p>
            </div>
            <div className="flex gap-2">
              {sessions.length > 0 && (
                <button onClick={clearHistory} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs transition-colors">Clear History</button>
              )}
              <button onClick={() => router.push("/mock-interview")}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors">Start Practice</button>
            </div>
          </motion.div>

          {sessions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No interviews yet</h2>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">Complete your first mock interview to start tracking your performance and improvement over time.</p>
              <button onClick={() => router.push("/mock-interview")}
                className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors">Start First Interview</button>
            </motion.div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Sessions", value: stats.totalSessions, icon: Mic, color: "rose" },
                  { label: "Avg Score", value: `${stats.avgScore}%`, icon: Target, color: "indigo" },
                  { label: "Best Score", value: `${stats.bestScore}%`, icon: Star, color: "amber" },
                  { label: "Total Time", value: `${Math.round(stats.totalTime / 60)}m`, icon: Clock, color: "cyan" },
                  { label: "Trend", value: stats.trend > 0 ? `+${stats.trend}%` : stats.trend < 0 ? `${stats.trend}%` : "—", icon: TrendingUp, color: stats.trend >= 0 ? "emerald" : "red" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                    </div>
                    <div className="text-xl font-bold">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="lg:col-span-2 p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <h3 className="font-semibold mb-4">Score History</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "rgba(17,17,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                        labelStyle={{ color: "#94a3b8" }} />
                      <Area type="monotone" dataKey="overall" stroke="#818cf8" fill="url(#gOverall)" strokeWidth={2} name="Overall" />
                      <Area type="monotone" dataKey="communication" stroke="#34d399" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Communication" />
                      <Area type="monotone" dataKey="technical" stroke="#fbbf24" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Technical" />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <h3 className="font-semibold mb-4">Category Averages</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} width={100} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "rgba(17,17,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="avg" fill="#818cf8" radius={[0, 6, 6, 0]} name="Average Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Strengths</h3>
                  <div className="flex flex-wrap gap-2">
                    {allStrengths.slice(0, 10).map((s, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                    ))}
                    {allStrengths.length === 0 && <span className="text-sm text-slate-500">Complete interviews to see your strengths</span>}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-rose-400" /> Areas to Improve</h3>
                  <div className="flex flex-wrap gap-2">
                    {allImprovements.slice(0, 10).map((s, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>
                    ))}
                    {allImprovements.length === 0 && <span className="text-sm text-slate-500">Complete interviews to see improvement areas</span>}
                  </div>
                </motion.div>
              </div>

              {/* Session History */}
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                <h3 className="font-semibold mb-4">Session History</h3>
                <div className="space-y-2">
                  {sessions.map(session => (
                    <div key={session.id}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${selected?.id === session.id ? "bg-indigo-500/10 border-indigo-500/20" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
                      onClick={() => setSelected(selected?.id === session.id ? null : session)}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        session.overallScore >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                        session.overallScore >= 60 ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      }`}>{session.overallScore}%</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{session.role}</div>
                        <div className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()} · {session.questionCount} questions · {Math.round(session.duration / 60)}m</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                        <span className="text-emerald-400">Comm: {session.communicationScore}%</span>
                        <span className="text-amber-400">Tech: {session.technicalScore}%</span>
                        <span className="text-purple-400">STAR: {session.starScore}%</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${selected?.id === session.id ? "rotate-90" : ""}`} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
