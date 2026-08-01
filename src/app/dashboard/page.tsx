"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles, ChevronRight, Target, FileText, UsersRound, Mail, Zap, TrendingUp,
  AlertTriangle, BrainCircuit, Rocket, GraduationCap, Send, CheckCircle2, Clock,
  Activity, Layers, BarChart3, ListChecks, Flame, Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";

interface PathData { id: string; matchScore: number; careerPath: any; }
interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }
interface PipelineStats { saved: number; applied: number; shortlisted: number; assessment: number; interview: number; rejected: number; offer: number; accepted: number; }

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
};

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);
  return <>{display}{suffix}</>;
}

function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 42; const c = 2 * Math.PI * r; const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative w-24 h-24">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <motion.circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (pct / 100) * c }} transition={{ duration: 1.1, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold text-lg" style={{ color }}><CountUp value={pct} suffix="%" /></span>
      </div>
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [gaps, setGaps] = useState<SkillGapData[]>([]);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [pipeline, setPipeline] = useState<PipelineStats>({ saved: 0, applied: 0, shortlisted: 0, assessment: 0, interview: 0, rejected: 0, offer: 0, accepted: 0 });
  const [appCount, setAppCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: "Apply to 3 matched internships", done: false },
    { id: 2, text: "Send 1 outreach email", done: false },
    { id: 3, text: "Practice 1 interview round", done: false },
  ]);

  const getVal = (key: string) => {
    const keys = key.split(".");
    let val: any = t;
    for (const k of keys) val = val?.[k];
    return typeof val === "string" ? val : null;
  };
  const v = (key: string, fb: string) => getVal(key) || fb;

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    async function load() {
      try {
        const safeFetch = (url: string) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
        const [pathsData, gapsData, track, apps, emails] = await Promise.all([
          safeFetch("/api/paths"), safeFetch("/api/skills"), safeFetch("/api/internships/tracker"), safeFetch("/api/apply"), safeFetch("/api/email/send"),
        ]);
        if (cancelled) return;
        setPaths(Array.isArray(pathsData) ? pathsData : []);
        setGaps(Array.isArray(gapsData) ? gapsData : []);
        if (track?.stats) setPipeline({
          saved: track.stats.total || 0, applied: track.stats.applied || 0, shortlisted: track.stats.shortlisted || 0,
          assessment: track.stats.assessment || 0, interview: track.stats.interview || 0, rejected: track.stats.rejected || 0,
          offer: track.stats.offer || 0, accepted: track.stats.accepted || 0,
        });
        if (Array.isArray(apps)) setAppCount(apps.length);
        if (emails?.emails) setSentCount(emails.emails.filter((e: any) => e.status === "sent").length);
        try { const c = localStorage.getItem("compass_career_advice"); if (c) setAiAdvice(JSON.parse(c)); } catch {}
        try { const g = localStorage.getItem("compass_daily_goals"); if (g) setGoals(JSON.parse(g)); } catch {}
      } catch (e) { console.error("dashboard load", e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  const toggleGoal = (id: number) => {
    const next = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(next);
    try { localStorage.setItem("compass_daily_goals", JSON.stringify(next)); } catch {}
  };
  const addGoal = () => {
    const text = window.prompt("New goal");
    if (!text) return;
    const next = [...goals, { id: Date.now(), text, done: false }];
    setGoals(next);
    try { localStorage.setItem("compass_daily_goals", JSON.stringify(next)); } catch {}
  };

  if (authLoading || loading) return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a12]">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-96 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
        </div>
      </main>
    </div>
  );

  const topPath = paths[0] || (aiAdvice?.recommendedPaths?.[0] ? { matchScore: aiAdvice.recommendedPaths[0].matchScore / 100, careerPath: { title: aiAdvice.recommendedPaths[0].title } } : null);
  const avgMatch = paths.length > 0 ? Math.round((paths.reduce((s, p) => s + p.matchScore, 0) / paths.length) * 100) : (aiAdvice?.recommendedPaths?.length ? Math.round(aiAdvice.recommendedPaths.reduce((s: number, p: any) => s + p.matchScore, 0) / aiAdvice.recommendedPaths.length) : 0);
  const highGaps = gaps.filter(g => g.priority === "high").length || aiAdvice?.skillGaps?.filter((g: any) => g.priority === "High").length || 0;
  const pipelineTotal = pipeline.saved || 0;
  const applied = pipeline.applied || 0;
  const interviewRate = applied > 0 ? Math.round((pipeline.interview / applied) * 100) : 0;
  const offerRate = applied > 0 ? Math.round(((pipeline.offer + pipeline.accepted) / applied) * 100) : 0;
  const readiness = Math.max(0, Math.min(100, Math.round(avgMatch * 0.5 + Math.min(100, gaps.length * 12) * 0.2 + Math.min(100, pipelineTotal * 10) * 0.3)));
  const resumeHealth = Math.round(Math.min(100, 55 + (paths.length ? 15 : 0) + (gaps.length ? Math.min(15, gaps.length * 3) : 0) + (sentCount ? 10 : 0)));

  const stageDefs = [
    { key: "saved" as const, label: "Saved", color: "bg-slate-400" },
    { key: "applied" as const, label: "Applied", color: "bg-sky-400" },
    { key: "shortlisted" as const, label: "Shortlisted", color: "bg-indigo-400" },
    { key: "assessment" as const, label: "Assessment", color: "bg-violet-400" },
    { key: "interview" as const, label: "Interview", color: "bg-purple-400" },
    { key: "offer" as const, label: "Offer", color: "bg-emerald-400" },
    { key: "accepted" as const, label: "Accepted", color: "bg-emerald-500" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a12]">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-7">
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {v("dashboard.welcome", "Welcome back")},{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    {user?.name?.split(" ")[0] || "there"}
                  </span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">{greeting} — here&apos;s your career command center.</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5"><Flame className="w-3 h-3" /> {applied + sentCount} actions this week</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 hidden sm:flex items-center gap-1.5"><BrainCircuit className="w-3 h-3 text-indigo-400" /> AI Coach active</span>
              </div>
            </motion.div>
          </motion.div>

          {/* KPI cards */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: v("dashboard.topMatch", "Top Career Match"), value: <span className="truncate">{topPath?.careerPath?.title?.split(" ").slice(0, 2).join(" ") || "—"}</span>, icon: Target, tone: "from-indigo-500/25 to-purple-500/10 text-indigo-300", bar: "from-indigo-500 to-purple-500" },
              { label: v("dashboard.avgMatch", "Average Match"), value: <><CountUp value={avgMatch} suffix="%" /></>, icon: Activity, tone: "from-emerald-500/25 to-teal-500/10 text-emerald-300", bar: "from-emerald-500 to-teal-500" },
              { label: v("dashboard.skillGaps", "High-Priority Gaps"), value: <CountUp value={highGaps} />, icon: AlertTriangle, tone: "from-amber-500/25 to-orange-500/10 text-amber-300", bar: "from-amber-500 to-orange-500" },
              { label: "Interview Readiness", value: <><CountUp value={readiness} suffix="%" /></>, icon: Rocket, tone: "from-purple-500/25 to-fuchsia-500/10 text-purple-300", bar: "from-purple-500 to-fuchsia-500" },
            ].map((s, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden p-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] group">
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.tone.replace(" text-", " ") } opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`} />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.tone} bg-clip-padding flex items-center justify-center`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-extrabold">{s.value}</div>
                <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className={`h-full bg-gradient-to-r ${s.bar}`} initial={{ width: 0 }}
                    animate={{ width: i === 0 ? "70%" : i === 1 ? `${avgMatch}%` : i === 2 ? `${Math.min(100, highGaps * 20)}%` : `${readiness}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* AI insights banner */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-indigo-500/25 p-5" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(168,85,247,0.05))" }}>
              <div className="absolute -top-20 right-0 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="relative flex flex-wrap items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                  <BrainCircuit className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="font-bold text-sm">{v("dashboard.aiAnalysis", "AI Career Insights")}</h2>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold tracking-wider">AI POWERED</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {aiAdvice?.summary || "Complete your assessment to unlock personalized AI career insights, skill-gap roadmaps and hiring strategies."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(aiAdvice?.recommendedPaths || []).slice(0, 3).map((p: any, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                        {p.title} <span className="text-indigo-400 font-bold">{p.matchScore}%</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href="/assessment" className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">Re-assess</Link>
                  <Link href="/agent" className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-[11px] font-semibold text-white shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 hover:from-indigo-400 hover:to-purple-400">Ask AI Coach <ChevronRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main grid */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Pipeline */}
            <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> Internship Pipeline</h2>
                <Link href="/internships" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">Manage <ChevronRight className="w-3 h-3" /></Link>
              </div>
              {pipelineTotal > 0 ? (
                <>
                  <div className="flex items-end h-36 gap-1.5 mb-3">
                    {stageDefs.map((st, i) => {
                      const val = pipeline[st.key] || 0;
                      const maxVal = Math.max(1, ...stageDefs.map(s => pipeline[s.key] || 0));
                      const h = val === 0 ? 4 : Math.max(12, (val / maxVal) * 120);
                      return (
                        <div key={st.key} className="flex-1 flex flex-col items-center gap-1.5 group" title={`${st.label}: ${val}`}>
                          <span className="text-[10px] font-bold text-slate-400">{val}</span>
                          <motion.div initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                            className={`w-full rounded-t-lg ${st.color} ${val === 0 ? "opacity-20" : "opacity-90 group-hover:opacity-100"} transition-all`} style={{ boxShadow: "0 0 14px rgba(99,102,241,0.15)" }} />
                          <span className="text-[9px] text-slate-600 uppercase tracking-wider truncate w-full text-center">{st.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Stat label="Interview rate" value={`${interviewRate}%`} sub="of applied" />
                    <Stat label="Offer rate" value={`${offerRate}%`} sub="of applied" />
                    <Stat label="In progress" value={`${pipeline.assessment + pipeline.interview}`} sub="active stages" />
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <Rocket className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-1">Your internship pipeline is empty</p>
                  <p className="text-xs text-slate-600 mb-4">Track internships to see your progress here.</p>
                  <Link href="/internships" className="inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-semibold text-white">Browse internships</Link>
                </div>
              )}
            </motion.div>

            {/* Daily goals */}
            <motion.div variants={item} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><ListChecks className="w-4 h-4 text-emerald-400" /> Daily Goals</h2>
                <button onClick={addGoal} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add</button>
              </div>
              <div className="space-y-2 flex-1">
                {goals.map(g => (
                  <button key={g.id} onClick={() => toggleGoal(g.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${g.done ? "bg-emerald-500/[0.06] border-emerald-500/25" : "bg-white/[0.02] border-white/[0.07] hover:border-white/20"}`}>
                    <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 ${g.done ? "bg-emerald-500 border-emerald-500" : "border-white/25"}`}>
                      {g.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${g.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{g.text}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  animate={{ width: `${goals.length ? (goals.filter(g => g.done).length / goals.length) * 100 : 0}%` }} />
              </div>
              <p className="text-[10px] text-slate-600 text-center mt-2">{goals.filter(g => g.done).length}/{goals.length} complete</p>
            </motion.div>
          </motion.div>

          {/* Bottom grid */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Skill analytics */}
            <motion.div variants={item} className="lg:col-span-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-400" /> Skill Analytics</h2>
                <Link href="/skills" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">Fix gaps <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-3">
                {(gaps.length > 0 ? gaps : (aiAdvice?.skillGaps || []).map((g: any, i: number) => ({ id: String(i), skillName: g.skill, currentLevel: 3, gap: g.gap || 4, priority: g.priority === "High" ? "high" : "medium" }))).slice(0, 5).map((g: any) => (
                  <div key={g.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{g.skillName}</span>
                      <span className={g.priority === "high" ? "text-red-400 font-medium" : "text-amber-400 font-medium"}>{g.gap} gap</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400" initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (g.currentLevel || 3) * 10)}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                  </div>
                ))}
                {gaps.length === 0 && !aiAdvice && <p className="text-sm text-slate-500 text-center py-4">No skill data yet.</p>}
              </div>
            </motion.div>

            {/* Resume health + progress */}
            <motion.div variants={item} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col items-center">
              <h2 className="font-semibold text-sm mb-4 self-start flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> Resume Health</h2>
              <Ring value={resumeHealth} label="Health" color="#34d399" />
              <div className="grid grid-cols-3 gap-2 mt-5 w-full">
                <Stat label="Paths" value={`${paths.length || aiAdvice?.recommendedPaths?.length || 0}`} sub="matched" />
                <Stat label="Skills" value={`${gaps.length || aiAdvice?.skillGaps?.length || 0}`} sub="tracked" />
                <Stat label="Emails" value={`${sentCount}`} sub="sent" />
              </div>
              <Link href="/resume-builder" className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:from-emerald-400 hover:to-teal-400 transition-colors">
                <FileText className="w-3.5 h-3.5" /> Open Resume Builder
              </Link>
            </motion.div>

            {/* Recent activity timeline */}
            <motion.div variants={item} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" /> Career Progress</h2>
              </div>
              <div className="space-y-0">
                {[
                  { icon: Award, text: `Top match: ${topPath?.careerPath?.title?.split(" ").slice(0, 3).join(" ") || "—"}`, sub: `${avgMatch}% AI match score`, tone: "text-indigo-400 bg-indigo-500/10" },
                  { icon: Send, text: `${sentCount} outreach email${sentCount !== 1 ? "s" : ""} sent`, sub: "Recruiter reach via Email Studio", tone: "text-emerald-400 bg-emerald-500/10" },
                  { icon: Rocket, text: `${applied} application${applied !== 1 ? "s" : ""} submitted`, sub: `${pipeline.shortlisted} shortlisted so far`, tone: "text-sky-400 bg-sky-500/10" },
                  { icon: GraduationCap, text: `${paths.length || aiAdvice?.recommendedPaths?.length || 0} career path${paths.length !== 1 ? "s" : ""} discovered`, sub: "Guided by AI assessment", tone: "text-amber-400 bg-amber-500/10" },
                ].map((row, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                    className="relative flex gap-3 pb-4 last:pb-0">
                    {i < 3 && <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/[0.07]" />}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative z-10 ${row.tone}`}>
                      <row.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="text-xs font-medium text-slate-200 truncate">{row.text}</div>
                      <div className="text-[10px] text-slate-500">{row.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { href: "/panel-interview", label: v("dashboard.panelInterview", "Panel Interview"), icon: UsersRound, color: "from-indigo-500 to-purple-500" },
              { href: "/resume-builder", label: v("dashboard.buildResume", "Resume Builder"), icon: FileText, color: "from-emerald-500 to-teal-500" },
              { href: "/jobs", label: v("dashboard.findJobs", "Find Jobs"), icon: Zap, color: "from-amber-500 to-orange-500" },
              { href: "/email-campaign", label: v("dashboard.emailOutreach", "Email Studio"), icon: Mail, color: "from-rose-500 to-pink-500" },
            ].map((action, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -3 }}>
                <Link href={action.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <action.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium group-hover:text-indigo-400 transition-colors block truncate">{action.label}</span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">Launch <ChevronRight className="w-2.5 h-2.5" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-[10px] text-slate-700 mt-6">Compass Career OS · AI-powered career intelligence</p>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-[9px] text-slate-600">{sub}</div>
    </div>
  );
}
