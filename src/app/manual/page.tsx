"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Compass, ChevronLeft, ChevronRight, Play, Pause, Loader2, Zap, UserPlus, RotateCcw } from "lucide-react";

const CinematicFilm = dynamic(() => import("@/components/CinematicFilm"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

interface Chapter { no: string; tag: string; color: string; title: string[]; body: string; cta?: boolean; }

const CHAPTERS: Chapter[] = [
  { no: "00", tag: "THE PROBLEM", color: "#ef4444", title: ["India's", "hiring gap"], body: "Millions graduate every year with skills nobody maps to roles — while employers can't find who's actually ready." },
  { no: "01", tag: "STEP 01 · ASSESS", color: "#818cf8", title: ["Map your", "strengths"], body: "An AI-guided assessment builds a precise graph of your skills, interests and ideal career paths in minutes." },
  { no: "02", tag: "STEP 02 · UPSKILL", color: "#a855f7", title: ["Close every", "gap"], body: "Courses, aptitude drills and interview prep — sequenced exactly to your gaps, powered by a personal coach." },
  { no: "03", tag: "STEP 03 · LAND", color: "#10b981", title: ["Real offers", "faster"], body: "Matched openings, AI-drafted outreach and mock interviews until you get hired." },
  { no: "04", tag: "THE CORE", color: "#22d3ee", title: ["Compass AI", "is alive"], body: "One living career OS that thinks with you — from first assessment to accepted offer." },
  { no: "05", tag: "YOUR MOVE", color: "#f59e0b", title: ["Your career,", "mapped"], body: "Join Compass and let your true north find you.", cta: true },
];

const AUTO_MS = 9000;

export default function CinematicManualPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const slideRef = useRef(0);
  const lock = useRef(0);

  const goTo = useCallback((i: number) => {
    const target = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    if (target === slideRef.current) return;
    if (Date.now() - lock.current < 850) return;
    lock.current = Date.now();
    setBusy(true);
    setSlide(target);
  }, []);

  const goNext = useCallback(() => goTo(slideRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(slideRef.current - 1), [goTo]);

  useEffect(() => { slideRef.current = slide; }, [slide]);

  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => setBusy(false), 850);
    return () => clearTimeout(t);
  }, [busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!playing || hovering || reduced) return;
    const t = setTimeout(() => goNext(), AUTO_MS);
    return () => clearTimeout(t);
  }, [playing, hovering, reduced, slide, goNext]);

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) router.push("/assessment");
    } catch (e) { console.error("startDemo", e); }
    finally { setDemoLoading(false); }
  };

  const ch = CHAPTERS[slide];
  const phase = Math.min(4, slide);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none"
      onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
      <AnimatePresence>
        <motion.div key={slide} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
          style={{ background: `radial-gradient(60% 58% at 50% 46%, ${ch.color}26, transparent 68%), radial-gradient(42% 42% at 78% 18%, ${ch.color}12, transparent 70%), radial-gradient(34% 34% at 18% 82%, ${ch.color}0e, transparent 70%)` }} />
      </AnimatePresence>

      <div className="absolute inset-0">
        <CinematicFilm phase={phase} />
      </div>

      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />

      <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.07, animation: "grain 0.6s steps(3) infinite" }} />

      <motion.div className="absolute top-0 left-0 right-0 z-30 bg-black"
        animate={{ height: busy && !reduced ? 46 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
      <motion.div className="absolute bottom-0 left-0 right-0 z-30 bg-black"
        animate={{ height: busy && !reduced ? 46 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />

      {slide < CHAPTERS.length - 1 && <div className="absolute inset-0 z-10" onClick={goNext} />}

      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">The Film</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.25em] text-slate-500 tabular-nums hidden sm:block">{String(slide + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}</span>
          <button onClick={() => setPlaying(p => !p)} title={playing ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">Skip →</Link>
        </div>
      </div>

      <div className="absolute top-0 inset-x-0 z-40 h-[3px] bg-white/5">
        <motion.div key={slide} className="h-full origin-left" style={{ background: `linear-gradient(90deg, ${ch.color}, #a78bfa)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: playing && !hovering && !reduced ? 1 : 0 }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-20 px-6 pb-28 sm:px-12 lg:px-16">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color: ch.color }}>{ch.tag}</span>
                <span className="h-px w-12" style={{ background: ch.color }} />
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02] text-white">
                {ch.title.map((line, i) => (
                  <span key={i} className="block overflow-hidden py-[0.05em] -my-[0.05em]">
                    <motion.span initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="block">
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-sm sm:text-base text-slate-400 leading-relaxed mt-4 max-w-md">
                {ch.body}
              </motion.p>

              {ch.cta && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-3 mt-6">
                  <button onClick={startDemo} disabled={demoLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold text-white transition-all glow-sm">
                    {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {demoLoading ? "Setting up..." : "Launch Demo"}
                  </button>
                  <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
                    <UserPlus className="w-4 h-4" /> Create Account
                  </Link>
                  <button onClick={() => goTo(0)} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs text-slate-500 hover:text-white transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Replay
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-30 flex items-center justify-center gap-4 px-6 pb-7">
        <button onClick={goPrev} aria-label="Previous chapter"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {CHAPTERS.map((c, i) => (
            <button key={c.no} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-7" : "w-3 bg-white/15 hover:bg-white/30"}`}
              style={i === slide ? { background: c.color } : undefined} />
          ))}
        </div>
        <button onClick={goNext} aria-label="Next chapter"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`@keyframes grain { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,3px)} 50%{transform:translate(3px,-2px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(2px,2px)} }`}</style>
    </div>
  );
}
