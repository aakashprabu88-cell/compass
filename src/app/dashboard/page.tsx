"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Target, FileText, Mail, Zap, TrendingUp,
  AlertTriangle, BrainCircuit, Rocket, GraduationCap, Send, CheckCircle2,
  Activity, Layers, BarChart3, ListChecks, Flame, Award, ArrowUpRight, UsersRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import PageTour from "@/components/PageTour";

interface PathData { id: string; matchScore: number; careerPath: any; }
interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }
interface PipelineStats { saved: number; applied: number; shortlisted: number; assessment: number; interview: number; rejected: number; offer: number; accepted: number; }

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any } },
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
        <span className="font-extrabold text-lg tabular-nums" style={{ color }}><CountUp value={pct} suffix="%" /></span>
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
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
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
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const card = "rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5";

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a12]">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-7">
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">{today}</p>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {v("dashboard.welcome", "Welcome back")},{" "}
                  <span className="text-indigo-400">{user?.name?.split(" ")[0] || "there"}</span>
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
          <motion.div data-tour="kpis" variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: v("dashboard.topMatch", "Top Career Match"), value: <span className="truncate">{topPath?.careerPath?.title?.split(" ").slice(0, 2).join(" ") || "—"}</span>, icon: Target, text: "text-indigo-400", bg: "bg-indigo-500/10", bar: "bg-indigo-500" },
              { label: v("dashboard.avgMatch", "Average Match"), value: <><CountUp value={avgMatch} suffix="%" /></>, icon: Activity, text: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
              { label: v("dashboard.skillGaps", "High-Priority Gaps"), value: <CountUp value={highGaps} />, icon: AlertTriangle, text: "text-amber-400", bg: "bg-amber-500/10", bar: "bg-amber-500" },
              { label: "Interview Readiness", value: <><CountUp value={readiness} suffix="%" /></>, icon: Rocket, text: "text-purple-400", bg: "bg-purple-500/10", bar: "bg-purple-500" },
            ].map((s, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.text}`} />
                  </div>
                </div>
                <div className="text-xl font-bold text-white tabular-nums leading-none mb-3">{s.value}</div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className={`h-full ${s.bar}`} initial={{ width: 0 }}
                    animate={{ width: i === 0 ? "70%" : i === 1 ? `${avgMatch}%` : i === 2 ? `${Math.min(100, highGaps * 20)}%` : `${readiness}%` }} transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* AI insights banner */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} data-tour="insights" className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.07] to-purple-500/[0.03] p-5">
              <div className="relative flex flex-wrap items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="font-semibold text-sm text-white">{v("dashboard.aiAnalysis", "AI Career Insights")}</h2>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold tracking-wider">AI POWERED</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {aiAdvice?.summary || "Complete your assessment to unlock personalized AI career insights, skill-gap roadmaps and hiring strategies."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(aiAdvice?.recommendedPaths || []).slice(0, 3).map((p: any, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                        {p.title} <span className="text-indigo-400 font-semibold">{p.matchScore}%</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href="/assessment" className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors">Re-assess</Link>
                  <Link href="/agent" className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white transition-colors flex items-center gap-1.5">Ask AI Coach <ChevronRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main grid */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Pipeline */}
            <motion.div variants={item} data-tour="pipeline" className={`lg:col-span-2 ${card}`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-sm text-white flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> Internship Pipeline</h2>
                <Link href="/internships" className="text-xs text-slate-500 hover:text-indigo-300 flex items-center gap-1 transition-colors">Manage <ChevronRight className="w-3 h-3" /></Link>
              </div>
              {pipelineTotal > 0 ? (
                <>
                  <div className="flex items-end h-32 gap-1.5 mb-4">
                    {stageDefs.map((st, i) => {
                      const val = pipeline[st.key] || 0;
                      const maxVal = Math.max(1, ...stageDefs.map(s => pipeline[s.key] || 0));
                      const h = val === 0 ? 4 : Math.max(12, (val / maxVal) * 110);
                      return (
                        <div key={st.key} className="flex-1 flex flex-col items-center gap-1.5 group" title={`${st.label}: ${val}`}>
                          <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{val}</span>
                          <motion.div initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                            className={`w-full rounded-t-md ${st.color} ${val === 0 ? "opacity-15" : "opacity-80 group-hover:opacity-100"} transition-opacity`} />
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
                  <Link href="/internships" className="inline-flex px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors">Browse internships</Link>
                </div>
              )}
            </motion.div>

            {/* Daily goals */}
            <motion.div variants={item} className={`${card} flex flex-col`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm text-white flex items-center gap-2"><ListChecks className="w-4 h-4 text-emerald-400" /> Daily Goals</h2>
                <button onClick={addGoal} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">+ Add</button>
              </div>
              <div className="space-y-2 flex-1">
                {goals.map(g => (
                  <button key={g.id} onClick={() => toggleGoal(g.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${g.done ? "bg-emerald-500/[0.06] border-emerald-500/25" : "bg-white/[0.02] border-white/[0.07] hover:border-white/20"}`}>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${g.done ? "bg-emerald-500 border-emerald-500" : "border-white/25"}`}>
                      {g.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${g.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{g.text}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    animate={{ width: `${goals.length ? (goals.filter(g => g.done).length / goals.length) * 100 : 0}%` }} />
                </div>
                <p className="text-[10px] text-slate-600 text-center mt-2 tabular-nums">{goals.filter(g => g.done).length}/{goals.length} complete</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom grid */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Skill analytics */}
            <motion.div variants={item} className={`${card} lg:col-span-1`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-400" /> Skill Analytics</h2>
                <Link href="/skills" className="text-xs text-slate-500 hover:text-indigo-300 flex items-center gap-1 transition-colors">Fix gaps <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-3.5">
                {(gaps.length > 0 ? gaps : (aiAdvice?.skillGaps || []).map((g: any, i: number) => ({ id: String(i), skillName: g.skill, currentLevel: 3, gap: g.gap || 4, priority: g.priority === "High" ? "high" : "medium" }))).slice(0, 5).map((g: any) => (
                  <div key={g.id}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">{g.skillName}</span>
                      <span className={g.priority === "high" ? "text-red-400 font-medium tabular-nums" : "text-amber-400 font-medium tabular-nums"}>{g.gap} gap</span>
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
            <motion.div variants={item} data-tour="resume" className={`${card} flex flex-col items-center`}>
              <h2 className="font-semibold text-sm text-white mb-5 self-start flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> Resume Health</h2>
              <Ring value={resumeHealth} label="Health" color="#34d399" />
              <div className="grid grid-cols-3 gap-2 mt-5 w-full">
                <Stat label="Paths" value={`${paths.length || aiAdvice?.recommendedPaths?.length || 0}`} sub="matched" />
                <Stat label="Skills" value={`${gaps.length || aiAdvice?.skillGaps?.length || 0}`} sub="tracked" />
                <Stat label="Emails" value={`${sentCount}`} sub="sent" />
              </div>
              <Link href="/resume-builder" className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors">
                <FileText className="w-3.5 h-3.5" /> Open Resume Builder
              </Link>
            </motion.div>

            {/* Recent activity timeline */}
            <motion.div variants={item} className={card}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-sm text-white flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" /> Career Progress</h2>
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
          <motion.div data-tour="actions" variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { href: "/panel-interview", label: v("dashboard.panelInterview", "Panel Interview"), icon: UsersRound, text: "text-indigo-400", bg: "bg-indigo-500/10" },
              { href: "/resume-builder", label: v("dashboard.buildResume", "Resume Builder"), icon: FileText, text: "text-emerald-400", bg: "bg-emerald-500/10" },
              { href: "/jobs", label: v("dashboard.findJobs", "Find Jobs"), icon: Zap, text: "text-amber-400", bg: "bg-amber-500/10" },
              { href: "/email-campaign", label: v("dashboard.emailOutreach", "Email Studio"), icon: Mail, text: "text-rose-400", bg: "bg-rose-500/10" },
            ].map((action, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -3 }}>
                <Link href={action.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center shrink-0`}>
                    <action.icon className={`w-4 h-4 ${action.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors block truncate">{action.label}</span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">Launch</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-[10px] text-slate-700 mt-6">Compass Career OS · AI-powered career intelligence</p>
        </div>

        {/* ── Guided demo tour ── */}
        <PageTour
          id="dashboard"
          accent="indigo"
          steps={[
            { target: "[data-tour='kpis']", title: "Your career at a glance", body: "Live AI match scores, priority skill gaps and interview readiness — animated the moment you log in." },
            { target: "[data-tour='insights']", title: "AI Career Insights", body: "Every assessment feeds a personal AI coach. Review your top paths, skill gaps and hiring strategy — or ask the coach directly." },
            { target: "[data-tour='pipeline']", title: "Internship pipeline", body: "Track every application across 7 stages — from saved to accepted — with your goals persisted daily." },
            { target: "[data-tour='resume']", title: "Resume health", body: "A live health score based on your paths, tracked skills and outreach activity. One click opens the resume builder." },
            { target: "[data-tour='actions']", title: "Jump anywhere", body: "Launch the Panel Interview, Resume Builder, Job Hunt or the flagship AI Email Studio from here." },
          ]}
        />
      </main>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="text-sm font-bold text-white tabular-nums">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-[9px] text-slate-600">{sub}</div>
    </div>
  );
}
