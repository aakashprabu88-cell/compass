"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, TrendingUp, Award, BarChart3, Target, Briefcase, Mic, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import Sidebar from "@/components/Sidebar";

interface PeerData {
  metric: string;
  user: number;
  average: number;
  top10: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
  isUser?: boolean;
}

export default function BenchmarkPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [peerData, setPeerData] = useState<PeerData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [percentile, setPercentile] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        // Gather user stats from localStorage + API
        const [pathsRes, gapsRes, appsRes] = await Promise.all([
          fetch("/api/paths").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/skills").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/apply").then(r => r.ok ? r.json() : []).catch(() => []),
        ]);

        const paths = Array.isArray(pathsRes) ? pathsRes : [];
        const gaps = Array.isArray(gapsRes) ? gapsRes : [];
        const apps = Array.isArray(appsRes) ? appsRes : [];

        let interviewHistory: any[] = [];
        try { interviewHistory = JSON.parse(localStorage.getItem("compass_interview_history") || "[]"); } catch {}

        const avgMatch = paths.length ? Math.round(paths.reduce((s: number, p: any) => s + (p.matchScore || 0), 0) / paths.length * 100) : 0;
        const skillCount = gaps.length;
        const interviewScore = interviewHistory.length ? Math.round(interviewHistory.reduce((s: number, i: any) => s + i.overallScore, 0) / interviewHistory.length) : 0;
        const appsSent = apps.length;

        // Simulated peer data (in production this comes from aggregate DB)
        const peers: PeerData[] = [
          { metric: "Career Match %", user: avgMatch || 72, average: 58, top10: 85 },
          { metric: "Skills Mastered", user: Math.max(0, 15 - skillCount) || 8, average: 5, top10: 12 },
          { metric: "Interview Score", user: interviewScore || 65, average: 52, top10: 82 },
          { metric: "Applications Sent", user: Math.min(appsSent, 50) || 12, average: 8, top10: 35 },
          { metric: "Resume ATS Score", user: 74, average: 55, top10: 88 },
          { metric: "Profile Completeness", user: 85, average: 60, top10: 95 },
        ];
        setPeerData(peers);

        // Calculate percentile based on composite score
        const composite = peers.reduce((s, p) => s + (p.user / p.top10) * 100, 0) / peers.length;
        setPercentile(Math.min(99, Math.round(composite)));

        // Generate mock leaderboard
        const fakeNames = ["Priya M.", "Arjun K.", "Sneha R.", "Vikram S.", "Ananya P.", "Rohan D.", "Kavya L.", "Aditya T.", "Meera N.", "Sanjay B."];
        const entries: LeaderboardEntry[] = fakeNames.map((name, i) => ({
          rank: i + 1,
          name,
          score: 95 - i * 3 + Math.floor(Math.random() * 5),
          badge: i === 0 ? "🏆" : i < 3 ? "🥈" : i < 5 ? "🥉" : "⭐",
        }));
        entries.push({ rank: 0, name: "You", score: Math.round(composite), badge: "🎯", isUser: true });
        entries.sort((a, b) => b.score - a.score);
        entries.forEach((e, i) => e.rank = i + 1);
        setLeaderboard(entries.slice(0, 12));

        setLoading(false);
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const radarData = peerData.map(p => ({
    subject: p.metric.replace(" %", ""),
    you: p.user,
    average: p.average,
    top10: p.top10,
  }));

  const getPercentileLabel = () => {
    if (percentile >= 90) return { label: "Top 10%", color: "text-emerald-400", bg: "from-emerald-500/20 to-cyan-500/20" };
    if (percentile >= 75) return { label: "Top 25%", color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/20" };
    if (percentile >= 50) return { label: "Above Average", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" };
    return { label: "Getting Started", color: "text-slate-400", bg: "from-slate-500/20 to-slate-400/20" };
  };
  const pLabel = getPercentileLabel();

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-indigo-400" /> Competitive Benchmarking</h1>
            <p className="text-slate-400 text-sm mt-1">See how you compare to peers on the Compass platform</p>
          </motion.div>

          {/* Percentile banner */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl bg-gradient-to-r ${pLabel.bg} border border-white/10 mb-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <span className="text-3xl font-black">{percentile}</span>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${pLabel.color}`}>{pLabel.label}</div>
                  <p className="text-sm text-slate-400">Your overall platform percentile</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-center">
                <div><div className="text-lg font-bold">{peerData.length}</div><div className="text-[10px] text-slate-500 uppercase">Metrics</div></div>
                <div><div className="text-lg font-bold">1000+</div><div className="text-[10px] text-slate-500 uppercase">Peers</div></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Radar chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="lg:col-span-2 p-6 rounded-xl bg-white/[0.03] border border-white/5">
              <h3 className="font-semibold mb-4">Skill Radar</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                  <Radar name="You" dataKey="you" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Average" dataKey="average" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
                  <Radar name="Top 10%" dataKey="top10" stroke="#34d399" fill="none" strokeWidth={1} strokeDasharray="2 2" />
                  <Tooltip contentStyle={{ background: "rgba(17,17,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-0.5 bg-indigo-400 rounded" /> You</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-0.5 bg-amber-400 rounded border-dashed" /> Average</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-0.5 bg-emerald-400 rounded" /> Top 10%</div>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${entry.isUser ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-white/[0.03]"}`}>
                    <span className="text-xs w-5 text-center font-mono text-slate-500">{entry.rank}</span>
                    <span>{entry.badge}</span>
                    <span className={`flex-1 text-sm truncate ${entry.isUser ? "font-bold text-indigo-400" : ""}`}>{entry.name}</span>
                    <span className={`text-xs font-medium ${entry.isUser ? "text-indigo-400" : "text-slate-400"}`}>{entry.score}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Detailed comparison bars */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="p-6 rounded-xl bg-white/[0.03] border border-white/5 mb-8">
            <h3 className="font-semibold mb-4">Detailed Comparison</h3>
            <div className="space-y-5">
              {peerData.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{p.metric}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-indigo-400 font-medium">You: {p.user}</span>
                      <span className="text-amber-400">Avg: {p.average}</span>
                      <span className="text-emerald-400">Top: {p.top10}</span>
                    </div>
                  </div>
                  <div className="relative h-6 rounded-lg bg-white/[0.03] overflow-hidden">
                    {/* Average marker */}
                    <div className="absolute top-0 h-full w-0.5 bg-amber-400/60 z-10" style={{ left: `${p.average}%` }} />
                    {/* Top 10 marker */}
                    <div className="absolute top-0 h-full w-0.5 bg-emerald-400/60 z-10" style={{ left: `${p.top10}%` }} />
                    {/* User bar */}
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(p.user, 100)}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className={`h-full rounded-lg ${p.user >= p.top10 * 0.8 ? "bg-emerald-500/40" : p.user >= p.average ? "bg-indigo-500/40" : "bg-amber-500/40"}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" /> Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Strongest Area", desc: peerData.sort((a, b) => (b.user / b.top10) - (a.user / a.top10))[0]?.metric || "—", color: "emerald" },
                { title: "Biggest Gap", desc: peerData.sort((a, b) => (a.user / a.top10) - (b.user / b.top10))[0]?.metric || "—", color: "rose" },
                { title: "Quickest Win", desc: peerData.find(p => p.user < p.average && p.top10 - p.user < 30)?.metric || "—" , color: "amber" },
              ].map((insight, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className={`text-xs text-${insight.color}-400 font-semibold uppercase mb-1`}>{insight.title}</div>
                  <div className="text-sm font-medium">{insight.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
