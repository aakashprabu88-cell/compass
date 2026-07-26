"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, Briefcase, FileText, GraduationCap, Building2, Zap, GitBranch, Shield, Radar, IndianRupee, Flame, Code, BookOpen, CheckCircle, TrendingUp, Calendar, Award, Trophy, Star, ChevronRight, Mic } from "lucide-react";
import { BADGES, calculateLevel, getDailyChallenge, getEarnableBadges, type Badge } from "@/lib/gamification";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/simulator", label: "Simulator", icon: GitBranch },
  { href: "/govt-exams", label: "Govt Exams", icon: Shield },
  { href: "/intelligence", label: "Intelligence", icon: Radar },
  { href: "/negotiation", label: "Negotiate", icon: IndianRupee },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/company-prep", label: "Company Prep", icon: Target },
  { href: "/mock-interview", label: "Mock Interview", icon: Mic },
  { href: "/resume-builder", label: "Resume Builder", icon: FileText },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

interface UserProgress {
  xp: number;
  badges: string[];
  streak: number;
  totalQuestions: number;
  applicationsSent: number;
  coursesCompleted: number;
  companiesResearched: number;
  dailyChallengeCompleted: string;
}

interface ActivityLog {
  date: string;
  action: string;
  xp: number;
}

const defaultProgress: UserProgress = {
  xp: 0,
  badges: [],
  streak: 1,
  totalQuestions: 0,
  applicationsSent: 0,
  coursesCompleted: 0,
  companiesResearched: 0,
  dailyChallengeCompleted: "",
};

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem("compass_tracker_progress");
    if (saved) return { ...defaultProgress, ...JSON.parse(saved) };
  } catch {}
  return defaultProgress;
}

function saveProgress(p: UserProgress) {
  localStorage.setItem("compass_tracker_progress", JSON.stringify(p));
}

function loadActivity(): ActivityLog[] {
  try {
    const saved = localStorage.getItem("compass_tracker_activity");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveActivity(a: ActivityLog[]) {
  localStorage.setItem("compass_tracker_activity", JSON.stringify(a.slice(-50)));
}

function addActivity(action: string, xp: number): ActivityLog {
  return { date: new Date().toISOString(), action, xp };
}

function getWeeklyData(): number[] {
  const activity = loadActivity();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const week = [0, 0, 0, 0, 0, 0, 0];
  for (const a of activity) {
    const d = new Date(a.date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff < 7) {
      const idx = (dayOfWeek - diff + 7) % 7;
      week[idx]++;
    }
  }
  return week;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  purple: "bg-purple-500/20 text-purple-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  amber: "bg-amber-500/20 text-amber-400",
  green: "bg-green-500/20 text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  red: "bg-red-500/20 text-red-400",
  violet: "bg-violet-500/20 text-violet-400",
  orange: "bg-orange-500/20 text-orange-400",
  teal: "bg-teal-500/20 text-teal-400",
  pink: "bg-pink-500/20 text-pink-400",
  lime: "bg-lime-500/20 text-lime-400",
};

export default function TrackerPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.error) router.push("/login"); });
    const p = loadProgress();
    const a = loadActivity();
    setProgress(p);
    setActivity(a);
    const today = new Date().toISOString().slice(0, 10);
    setChallengeDone(p.dailyChallengeCompleted === today);
    setLoaded(true);
  }, [router]);

  const earnXP = (action: string, xp: number) => {
    const newProgress = { ...progress, xp: progress.xp + xp };
    if (action === "Solved coding question") newProgress.totalQuestions++;
    if (action === "Applied to job") newProgress.applicationsSent++;
    if (action === "Completed course") newProgress.coursesCompleted++;
    if (action === "Researched company") newProgress.companiesResearched++;
    saveProgress(newProgress);
    setProgress(newProgress);
    const log = addActivity(action, xp);
    const newActivity = [...activity, log];
    saveActivity(newActivity);
    setActivity(newActivity);
  };

  const completeChallenge = () => {
    const today = new Date().toISOString().slice(0, 10);
    const challenge = getDailyChallenge(today);
    const newProgress = { ...progress, xp: progress.xp + challenge.xp, dailyChallengeCompleted: today };
    saveProgress(newProgress);
    setProgress(newProgress);
    setChallengeDone(true);
    const log = addActivity(`Daily challenge: ${challenge.title}`, challenge.xp);
    const newActivity = [...activity, log];
    saveActivity(newActivity);
    setActivity(newActivity);
  };

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  if (!loaded) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const levelInfo = calculateLevel(progress.xp);
  const today = new Date().toISOString().slice(0, 10);
  const dailyChallenge = getDailyChallenge(today);
  const { earned, locked } = getEarnableBadges({ ...progress, level: levelInfo.level, badges: progress.badges, mockInterviews: 0, dailyChallenges: [] });
  const weeklyData = getWeeklyData();
  const maxWeekly = Math.max(...weeklyData, 1);

  const stats = [
    { label: "Questions Solved", value: progress.totalQuestions, icon: Code, color: "blue" },
    { label: "Applications Sent", value: progress.applicationsSent, icon: Briefcase, color: "indigo" },
    { label: "Courses Completed", value: progress.coursesCompleted, icon: BookOpen, color: "emerald" },
    { label: "Companies Researched", value: progress.companiesResearched, icon: Building2, color: "amber" },
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/tracker" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Preparation Tracker</h1>
          <p className="text-slate-400 text-sm mb-8">Track your progress, earn XP, unlock badges, and level up</p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">Level {levelInfo.level}</div>
              <div className="text-sm text-slate-400 mb-3">{levelInfo.title}</div>
              <div className="h-2 rounded-full bg-white/10 mb-1">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${levelInfo.progress}%` }} />
              </div>
              <div className="text-[10px] text-slate-500">{progress.xp} / {levelInfo.nextLevelXp} XP</div>
            </div>

            <div className="glass p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{progress.streak}</div>
              <div className="text-sm text-slate-400">Day Streak</div>
            </div>

            <div className="glass p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-1">{earned.length}</div>
              <div className="text-sm text-slate-400">Badges Earned</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="glass p-5 glass-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                </div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold">Daily Challenge</h2>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
                <div className="font-medium text-sm mb-1">{dailyChallenge.title}</div>
                <div className="text-xs text-slate-400 mb-3">{dailyChallenge.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400">+{dailyChallenge.xp} XP</span>
                  {challengeDone ? (
                    <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> Completed</span>
                  ) : (
                    <button onClick={completeChallenge} className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-all">
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold">Weekly Activity</h2>
              </div>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-indigo-500/30 transition-all" style={{ height: `${(val / maxWeekly) * 100}%`, minHeight: val > 0 ? "4px" : "0" }} />
                    <span className="text-[10px] text-slate-500">{dayLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold">Earn XP</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { action: "Solved coding question", xp: 10, icon: Code, color: "blue" },
                { action: "Applied to job", xp: 5, icon: Briefcase, color: "indigo" },
                { action: "Completed course", xp: 20, icon: BookOpen, color: "emerald" },
                { action: "Researched company", xp: 5, icon: Building2, color: "amber" },
              ].map(item => (
                <button key={item.action} onClick={() => earnXP(item.action, item.xp)}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all text-center group">
                  <item.icon className={`w-5 h-5 text-${item.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <div className="text-xs font-medium mb-1">{item.action}</div>
                  <div className={`text-[10px] text-${item.color}-400`}>+{item.xp} XP</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Badges</h2>
              <span className="text-xs text-slate-500">{earned.length} / {BADGES.length}</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {BADGES.map(badge => {
                const isEarned = progress.badges.includes(badge.id);
                return (
                  <div key={badge.id} className={`p-4 rounded-xl text-center transition-all ${isEarned ? (colorMap[badge.color] || "bg-white/10 text-white") + " border border-white/10" : "bg-white/[0.02] border border-white/5 opacity-40"}`}>
                    <div className="text-2xl mb-2">{isEarned ? "🏆" : "🔒"}</div>
                    <div className="text-xs font-medium mb-0.5">{badge.name}</div>
                    <div className="text-[10px] opacity-60">{badge.description}</div>
                    <div className="text-[10px] mt-1">{badge.xp} XP</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            {activity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No activity yet. Start earning XP!</p>
            ) : (
              <div className="space-y-2">
                {activity.slice(-10).reverse().map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <div className="flex-1 text-sm">{a.action}</div>
                    <div className="text-xs text-indigo-400">+{a.xp} XP</div>
                    <div className="text-[10px] text-slate-600">{new Date(a.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
