"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Flame, Calendar, CheckCircle2, Clock, Zap, Users, Star, ChevronRight, Gift, Target, Layers } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const DAILY_CHALLENGES = [
  { day: "Mon", title: "Array Manipulation", difficulty: "Medium", points: 50, completed: true },
  { day: "Tue", title: "String Processing", difficulty: "Easy", points: 30, completed: true },
  { day: "Wed", title: "Graph Traversal", difficulty: "Hard", points: 100, completed: false },
  { day: "Thu", title: "Dynamic Programming", difficulty: "Hard", points: 100, completed: false },
  { day: "Fri", title: "Tree Algorithms", difficulty: "Medium", points: 50, completed: false },
  { day: "Sat", title: "System Design Mini", difficulty: "Hard", points: 150, completed: false },
  { day: "Sun", title: "Mixed Challenge", difficulty: "Medium", points: 75, completed: false },
];

const WEEKLY_CHALLENGES = [
  { week: "Week 1", title: "Sorting & Searching Marathon", problems: 5, points: 500, participants: 234, status: "Upcoming" },
  { week: "Week 2", title: "DP & Recursion Battle", problems: 5, points: 500, participants: 198, status: "Upcoming" },
  { week: "Week 3", title: "System Design Challenge", problems: 3, points: 750, participants: 156, status: "Upcoming" },
];

const COMPANY_CHALLENGES = [
  { company: "Google", title: "Google Mock OA", problems: 4, time: "90 min", difficulty: "Hard", attempts: 1289 },
  { company: "Amazon", title: "Amazon SDE Challenge", problems: 3, time: "70 min", difficulty: "Hard", attempts: 2145 },
  { company: "Microsoft", title: "Microsoft SWE Test", problems: 3, time: "60 min", difficulty: "Medium", attempts: 1876 },
  { company: "TCS", title: "TCS NQT Simulator", problems: 5, time: "90 min", difficulty: "Medium", attempts: 3456 },
];

const BADGES = [
  { name: "7-Day Streak", icon: Flame, progress: 2, target: 7, color: "text-orange-400" },
  { name: "50 Challenges", icon: Trophy, progress: 23, target: 50, color: "text-yellow-400" },
  { name: "Perfect Score", icon: Star, progress: 0, target: 5, color: "text-purple-400" },
];

export default function ChallengesPage() {
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
      } catch (e) { console.error("challenges load", e); if (!cancelled) router.push("/"); }
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

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6" data-tour="prep-challenges-header">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Coding Challenges</h1>
                <p className="text-sm text-slate-400">Daily, weekly, and company-specific challenges with leaderboards and rewards</p>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-3 mb-6" data-tour="prep-challenges-badges">
            {BADGES.map((badge, i) => (
              <motion.div key={badge.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="p-3 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <badge.icon className={`w-5 h-5 ${badge.color} mb-1`} />
                <div className="text-xs font-medium mb-0.5">{badge.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <div className="flex-1 h-1 rounded-full bg-white/5"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${(badge.progress / badge.target) * 100}%` }} /></div>
                  {badge.progress}/{badge.target}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daily Challenges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="p-4 rounded-xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" /> This Week's Challenges</h2>
            <div className="grid grid-cols-7 gap-2">
              {DAILY_CHALLENGES.map((c, i) => (
                <button key={c.day}
                  className="text-center p-2 rounded-lg border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
                  disabled={i > 2} style={{ background: c.completed ? "rgba(16,185,129,0.05)" : "rgba(17,17,24,0.3)" }}>
                  <div className="text-[10px] text-slate-500 mb-1">{c.day}</div>
                  {c.completed ? <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-400" /> : <Zap className="w-4 h-4 mx-auto text-slate-600" />}
                  <div className="text-[10px] mt-0.5 text-slate-500">{c.points}pts</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Weekly & Company Challenges in grid */}
          <div className="grid lg:grid-cols-2 gap-4" data-tour="prep-challenges-cards">
            {/* Weekly Challenges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /> Weekly Battles</h2>
              <div className="space-y-2">
                {WEEKLY_CHALLENGES.map((c, i) => (
                  <button key={c.week} className="w-full text-left p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium">{c.title}</span>
                      <span className="text-[10px] text-slate-500">{c.points}pts</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>{c.problems} problems</span>
                      <span><Users className="w-3 h-3 inline mr-0.5" />{c.participants}</span>
                      <span className="text-indigo-400">{c.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Company Challenges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-amber-400" /> Company-Specific</h2>
              <div className="space-y-2">
                {COMPANY_CHALLENGES.map((c, i) => (
                  <button key={c.company} className="w-full text-left p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium">{c.title}</span>
                      <span className={`text-[10px] ${c.difficulty === "Hard" ? "text-rose-400" : "text-amber-400"}`}>{c.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span><Clock className="w-3 h-3 inline mr-0.5" />{c.time}</span>
                      <span><Users className="w-3 h-3 inline mr-0.5" />{c.attempts} attempts</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <PageTour
          id="prep-challenges"
          steps={[
            { target: "[data-tour='prep-challenges-header']", title: "Coding Challenges", body: "Structured competitions to push your problem-solving skill." },
            { target: "[data-tour='prep-challenges-badges']", title: "Your stats", body: "Streaks, stars and challenge wins at a glance." },
            { target: "[data-tour='prep-challenges-cards']", title: "Weekly battles", body: "New challenges every week plus company-specific sets." },
          ]}
        />
      </main>
    </div>
  );
}
