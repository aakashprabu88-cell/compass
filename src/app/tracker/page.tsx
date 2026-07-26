"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Flame, Award, Zap, TrendingUp, Calendar, CheckCircle,
  Code, Briefcase, BookOpen, Building2, Target, Star, ChevronRight,
  Crown, Medal, Sparkles, Lock, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "@/components/Sidebar";
import { BADGES, calculateLevel, getDailyChallenge, getEarnableBadges, type Badge } from "@/lib/gamification";

interface UserProgress {
  xp: number;
  badges: string[];
  streak: number;
  lastActiveDate: string;
  totalQuestions: number;
  applicationsSent: number;
  coursesCompleted: number;
  companiesResearched: number;
  interviewsCompleted: number;
  dailyChallengeCompleted: string;
  xpMultiplier: number;
}

interface ActivityLog { date: string; action: string; xp: number; }

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  xp: number;
  badge: string;
  streak: number;
  isUser?: boolean;
}

const defaultProgress: UserProgress = {
  xp: 0, badges: [], streak: 0, lastActiveDate: "",
  totalQuestions: 0, applicationsSent: 0, coursesCompleted: 0,
  companiesResearched: 0, interviewsCompleted: 0,
  dailyChallengeCompleted: "", xpMultiplier: 1,
};

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem("compass_tracker_progress");
    if (saved) return { ...defaultProgress, ...JSON.parse(saved) };
  } catch {}
  return defaultProgress;
}
function saveProgress(p: UserProgress) { localStorage.setItem("compass_tracker_progress", JSON.stringify(p)); }
function loadActivity(): ActivityLog[] {
  try { const s = localStorage.getItem("compass_tracker_activity"); if (s) return JSON.parse(s); } catch {} return [];
}
function saveActivity(a: ActivityLog[]) { localStorage.setItem("compass_tracker_activity", JSON.stringify(a.slice(-100))); }

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  green: "bg-green-500/20 text-green-400 border-green-500/20",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/20 text-red-400 border-red-500/20",
  violet: "bg-violet-500/20 text-violet-400 border-violet-500/20",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  teal: "bg-teal-500/20 text-teal-400 border-teal-500/20",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/20",
  lime: "bg-lime-500/20 text-lime-400 border-lime-500/20",
};

const fakeLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Priya M.", level: 8, xp: 8200, badge: "🏆", streak: 14 },
  { rank: 2, name: "Arjun K.", level: 7, xp: 6100, badge: "🥈", streak: 9 },
  { rank: 3, name: "Sneha R.", level: 7, xp: 5800, badge: "🥉", streak: 12 },
  { rank: 4, name: "Vikram S.", level: 6, xp: 4200, badge: "⭐", streak: 5 },
  { rank: 5, name: "Ananya P.", level: 6, xp: 3900, badge: "⭐", streak: 7 },
  { rank: 6, name: "Rohan D.", level: 5, xp: 3100, badge: "⭐", streak: 3 },
  { rank: 7, name: "Kavya L.", level: 5, xp: 2800, badge: "⭐", streak: 2 },
  { rank: 8, name: "Aditya T.", level: 4, xp: 2200, badge: "⭐", streak: 1 },
  { rank: 9, name: "Meera N.", level: 3, xp: 1500, badge: "⭐", streak: 0 },
  { rank: 10, name: "Sanjay B.", level: 2, xp: 800, badge: "⭐", streak: 0 },
];

export default function TrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [tab, setTab] = useState<"overview" | "badges" | "leaderboard" | "activity">("overview");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        const p = loadProgress();
        const a = loadActivity();

        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        let streak = p.streak;
        if (p.lastActiveDate === today) {
          // already active today
        } else if (p.lastActiveDate === yesterday) {
          streak = p.streak + 1;
        } else if (p.lastActiveDate) {
          streak = 1;
        } else {
          streak = 1;
        }

        const updatedProgress = { ...p, streak, lastActiveDate: today };
        saveProgress(updatedProgress);

        setProgress(updatedProgress);
        setActivity(a);
        setChallengeDone(p.dailyChallengeCompleted === today);

        const prevLevel = calculateLevel(p.xp).level;
        const currLevel = calculateLevel(updatedProgress.xp).level;
        if (currLevel > prevLevel) {
          setNewLevel(currLevel);
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }

        setLoaded(true);
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const earnXP = (action: string, xp: number) => {
    const multipliedXP = Math.round(xp * progress.xpMultiplier);
    const newProgress = { ...progress, xp: progress.xp + multipliedXP };
    if (action === "Solved coding question") newProgress.totalQuestions++;
    if (action === "Applied to job") newProgress.applicationsSent++;
    if (action === "Completed course") newProgress.coursesCompleted++;
    if (action === "Researched company") newProgress.companiesResearched++;
    if (action === "Completed mock interview") newProgress.interviewsCompleted++;

    const prevLevel = calculateLevel(progress.xp).level;
    const currLevel = calculateLevel(newProgress.xp).level;
    if (currLevel > prevLevel) {
      setNewLevel(currLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    saveProgress(newProgress);
    setProgress(newProgress);
    const log = { date: new Date().toISOString(), action, xp: multipliedXP };
    const newActivity = [...activity, log];
    saveActivity(newActivity);
    setActivity(newActivity);
  };

  const completeChallenge = () => {
    const today = new Date().toISOString().slice(0, 10);
    const challenge = getDailyChallenge(today);
    const multipliedXP = Math.round(challenge.xp * progress.xpMultiplier);
    const newProgress = { ...progress, xp: progress.xp + multipliedXP, dailyChallengeCompleted: today };
    saveProgress(newProgress);
    setProgress(newProgress);
    setChallengeDone(true);
    const log = { date: new Date().toISOString(), action: `Daily: ${challenge.title}`, xp: multipliedXP };
    const newActivity = [...activity, log];
    saveActivity(newActivity);
    setActivity(newActivity);
  };

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  if (!loaded || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const levelInfo = calculateLevel(progress.xp);
  const today = new Date().toISOString().slice(0, 10);
  const dailyChallenge = getDailyChallenge(today);
  const { earned, locked } = getEarnableBadges({ ...progress, level: levelInfo.level, badges: progress.badges, mockInterviews: progress.interviewsCompleted, dailyChallenges: [] });

  const userEntry: LeaderboardEntry = {
    rank: 0, name: user.name?.split(" ")[0] || "You", level: levelInfo.level, xp: progress.xp,
    badge: "🎯", streak: progress.streak, isUser: true,
  };
  const allEntries = [...fakeLeaderboard, userEntry].sort((a, b) => b.xp - a.xp);
  allEntries.forEach((e, i) => e.rank = i + 1);
  const userRank = allEntries.find(e => e.isUser)?.rank || 0;

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = activity.filter(a => a.date.slice(0, 10) === dateStr).length;
    return { day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], xp: activity.filter(a => a.date.slice(0, 10) === dateStr).reduce((s, a) => s + a.xp, 0) };
  });

  const streakMultiplier = progress.streak >= 7 ? 2 : progress.streak >= 3 ? 1.5 : 1;
  const effectiveMultiplier = progress.xpMultiplier * streakMultiplier;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Level Up Animation */}
          <AnimatePresence>
            {showLevelUp && (
              <motion.div initial={{ opacity: 0, scale: 0.5, y: -50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 border border-white/20 shadow-2xl shadow-indigo-500/30">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-yellow-300" />
                  <div>
                    <div className="text-xs text-white/70 uppercase font-semibold">Level Up!</div>
                    <div className="text-2xl font-black text-white">Level {newLevel}</div>
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-400" /> Preparation Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Level up your career — earn XP, unlock badges, climb the leaderboard</p>
          </motion.div>

          {/* XP Multiplier Banner */}
          {effectiveMultiplier > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="text-sm">
                <span className="text-amber-400 font-bold">{effectiveMultiplier}x XP Multiplier</span>
                <span className="text-slate-400 ml-2">
                  {progress.streak >= 7 ? "7+ day streak bonus (2x)" : "3+ day streak bonus (1.5x)"}
                </span>
              </div>
            </motion.div>
          )}

          {/* Tab nav */}
          <div className="flex gap-2 mb-6">
            {(["overview", "badges", "leaderboard", "activity"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Top 3 stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.8), transparent 70%)" }} />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-black text-indigo-400 mb-1">Level {levelInfo.level}</div>
                  <div className="text-sm text-slate-400 mb-3">{levelInfo.title}</div>
                  <div className="h-2.5 rounded-full bg-white/10 mb-1.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${levelInfo.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  </div>
                  <div className="text-[10px] text-slate-500">{progress.xp} / {levelInfo.nextLevelXp} XP</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(progress.streak, 14) }).map((_, i) => (
                        <Flame key={i} className={`w-${i < 7 ? "4" : "3"} h-${i < 7 ? "4" : "3"} text-orange-400`}
                          style={{ opacity: 0.5 + (i / 14) * 0.5 }} />
                      ))}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-orange-400 mb-1">{progress.streak}</div>
                  <div className="text-sm text-slate-400">Day Streak</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {progress.streak >= 7 ? "🔥 On fire! 2x XP active" : progress.streak >= 3 ? "⚡ Building momentum! 1.5x XP" : `${3 - Math.min(progress.streak, 3)} days to streak bonus`}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400 mb-1">{earned.length}<span className="text-lg text-slate-600">/{BADGES.length}</span></div>
                  <div className="text-sm text-slate-400">Badges Earned</div>
                  <div className="text-[10px] text-slate-500 mt-1">Rank #{userRank} of {allEntries.length}</div>
                </motion.div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {[
                  { label: "Questions", value: progress.totalQuestions, icon: Code, color: "blue", xp: 10 },
                  { label: "Applications", value: progress.applicationsSent, icon: Briefcase, color: "indigo", xp: 5 },
                  { label: "Interviews", value: progress.interviewsCompleted, icon: Target, color: "rose", xp: 15 },
                  { label: "Courses", value: progress.coursesCompleted, icon: BookOpen, color: "emerald", xp: 20 },
                  { label: "Companies", value: progress.companiesResearched, icon: Building2, color: "amber", xp: 5 },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">{s.label}</span>
                      <s.icon className={`w-3.5 h-3.5 text-${s.color}-400`} />
                    </div>
                    <div className="text-xl font-bold mb-2">{s.value}</div>
                    <button onClick={() => earnXP(`Earned from ${s.label.toLowerCase()}`, s.xp)}
                      className={`w-full py-1.5 rounded-lg bg-${s.color}-500/10 text-${s.color}-400 text-[10px] font-medium hover:bg-${s.color}-500/20 transition-colors`}>
                      +{Math.round(s.xp * effectiveMultiplier)} XP
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Daily Challenge */}
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center"><Zap className="w-5 h-5 text-amber-400" /></div>
                    <div><h3 className="font-semibold text-sm">Daily Challenge</h3><p className="text-[10px] text-slate-500">Fresh challenge every day</p></div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dailyChallenge.title}</span>
                      <span className="text-xs text-amber-400 font-bold">+{Math.round(dailyChallenge.xp * effectiveMultiplier)} XP</span>
                    </div>
                    <p className="text-xs text-slate-400">{dailyChallenge.description}</p>
                  </div>
                  {challengeDone ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle className="w-4 h-4" /> Challenge completed!</div>
                  ) : (
                    <button onClick={completeChallenge}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all">
                      Complete Challenge
                    </button>
                  )}
                </div>

                {/* Weekly XP Chart */}
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-indigo-400" /></div>
                    <div><h3 className="font-semibold text-sm">Weekly XP</h3><p className="text-[10px] text-slate-500">Your activity this week</p></div>
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "rgba(17,17,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                        formatter={(value) => [`${value} XP`, "XP"]} />
                      <Bar dataKey="xp" fill="#818cf8" radius={[4, 4, 0, 0]} name="XP Earned" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* BADGES TAB */}
          {tab === "badges" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{earned.length} of {BADGES.length} badges unlocked</p>
                <div className="h-2 w-48 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all"
                    style={{ width: `${(earned.length / BADGES.length) * 100}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {BADGES.map((badge, i) => {
                  const isEarned = progress.badges.includes(badge.id);
                  return (
                    <motion.div key={badge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className={`p-4 rounded-xl text-center border transition-all ${isEarned ? (colorMap[badge.color] || "bg-white/10 text-white border-white/10") : "bg-white/[0.02] border-white/5 opacity-50"}`}>
                      <div className="text-3xl mb-2">{isEarned ? "🏆" : "🔒"}</div>
                      <div className="text-xs font-semibold mb-0.5">{badge.name}</div>
                      <div className="text-[10px] opacity-60 mb-2">{badge.description}</div>
                      <div className={`text-[10px] font-bold ${isEarned ? "text-amber-400" : "text-slate-600"}`}>{badge.xp} XP</div>
                      {!isEarned && <div className="text-[9px] text-slate-600 mt-1">{badge.requirement}</div>}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD TAB */}
          {tab === "leaderboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Crown className="w-6 h-6 text-amber-400" /></div>
                  <div>
                    <div className="text-sm text-slate-400">Your Rank</div>
                    <div className="text-2xl font-black text-amber-400">#{userRank} <span className="text-sm text-slate-500 font-normal">of {allEntries.length}</span></div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-slate-400">Your XP</div>
                    <div className="text-xl font-bold text-indigo-400">{progress.xp.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {allEntries.slice(0, 15).map((entry, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${entry.isUser ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}>
                    <span className={`w-8 text-center font-bold ${entry.rank <= 3 ? "text-amber-400 text-lg" : "text-slate-500 text-sm"}`}>
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${entry.isUser ? "bg-indigo-500/20 text-indigo-400 font-bold" : "bg-white/5 text-slate-400"}`}>
                      {entry.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${entry.isUser ? "text-indigo-400" : ""}`}>{entry.name}{entry.isUser ? " (You)" : ""}</div>
                      <div className="text-[10px] text-slate-500">Level {entry.level}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {entry.streak > 0 && <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{entry.streak}</span>}
                      <span className="font-bold text-indigo-400">{entry.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ACTIVITY TAB */}
          {tab === "activity" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activity.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No activity yet. Start earning XP!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activity.slice().reverse().map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <div className="flex-1 text-sm">{a.action}</div>
                      <div className="text-xs font-bold text-indigo-400">+{a.xp} XP</div>
                      <div className="text-[10px] text-slate-600 shrink-0">{new Date(a.date).toLocaleDateString()} {new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
