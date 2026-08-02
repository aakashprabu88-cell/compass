"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Compass, ChevronLeft, ChevronRight, Play, Pause, Loader2, Zap, UserPlus, RotateCcw, House } from "lucide-react";

const CinematicFilm = dynamic(() => import("@/components/CinematicFilm"), { ssr: false, loading: () => null });
const CinematicIntro = dynamic(() => import("@/components/CinematicIntro"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

interface Chapter { no: string; tag: string; color: string; title: string[]; body: string; phase: number; chips?: string[]; cta?: boolean; }

const CHAPTERS: Chapter[] = [
  { no: "00", tag: "THE PROBLEM", color: "#ef4444", phase: 0, title: ["India's", "hiring gap"], body: "Millions graduate ready to work — but skills never meet roles, and employers can't find who's actually ready." },
  { no: "01", tag: "STEP 01 · ASSESS", color: "#818cf8", phase: 1, title: ["Find your", "true north"], body: "In minutes, an AI-guided assessment maps your strengths and interests to real, reachable career paths.", chips: ["AI Assessment", "Skill Graph", "ATS Score"] },
  { no: "02", tag: "STEP 02 · UPSKILL", color: "#a855f7", phase: 2, title: ["Close the", "gap"], body: "A sequenced learning plan built around exactly what you're missing — not a generic syllabus.", chips: ["Courses", "Career Paths", "Personal Coach"] },
  { no: "03", tag: "APTITUDE", color: "#7c3aed", phase: 2, title: ["Train your", "mind"], body: "Bite-sized aptitude drills with instant scoring, weekly tests and live performance tracking.", chips: ["Daily Quiz", "Weekly Test", "Live Performance"] },
  { no: "04", tag: "INTERVIEW PREP", color: "#d946ef", phase: 2, title: ["Master the", "interview"], body: "Every round covered — technical, verbal, reasoning, HR, behavioral and company-specific.", chips: ["Technical", "Verbal", "Reasoning", "HR", "Behavioral", "Company-wise"] },
  { no: "05", tag: "MOCK INTERVIEW", color: "#f472b6", phase: 6, title: ["Face the", "panel"], body: "Practice against an AI interview panel, scored live with honest, useful feedback.", chips: ["AI Panel", "Mock Interview", "Analytics"] },
  { no: "06", tag: "STEP 03 · LAND", color: "#10b981", phase: 3, title: ["Land real", "offers"], body: "Openings matched to your profile — tracked end to end from apply to accepted offer.", chips: ["Matched Jobs", "Internships", "Live Tracker"] },
  { no: "07", tag: "RESUME & EMAIL", color: "#f59e0b", phase: 5, title: ["Open every", "door"], body: "A sharp, ATS-ready resume plus AI-drafted outreach that actually gets replies.", chips: ["Resume Builder", "ATS Check", "AI Outreach"] },
  { no: "08", tag: "COMPASS AI", color: "#22d3ee", phase: 4, title: ["An agent that", "thinks with you"], body: "Ask anything. Compass AI plans, drafts and guides you — from first question to final offer.", chips: ["Career Coach", "Live Agent", "24/7"] },
  { no: "09", tag: "YOUR MOVE", color: "#f59e0b", phase: 4, title: ["Your career,", "mapped"], body: "Join Compass and let your true north find you.", cta: true },
];

const AUTO_MS = 8000;

export default function FilmExperience() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [title, setTitle] = useState(true);
  const slideRef = useRef(0);
  const lock = useRef(0);

  const beginFilm = useCallback(() => {
    setTitle(false);
    setBusy(true);
    setTimeout(() => setBusy(false), 900);
  }, []);

  useEffect(() => {
    if (reduced) { setTitle(false); return; }
  }, [reduced]);

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
      if (title) return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, title]);

  useEffect(() => {
    if (title || !playing || hovering || reduced) return;
    const t = setTimeout(() => goNext(), AUTO_MS);
    return () => clearTimeout(t);
  }, [title, playing, hovering, reduced, slide, goNext]);

  const wheelLock = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (title) return;
      if (Math.abs(e.deltaY) < 12) return;
      if (Date.now() - wheelLock.current < 900) return;
      wheelLock.current = Date.now();
      if (e.deltaY > 0) goNext(); else goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev, title]);

  const touch = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!touch.current) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 48) return;
    if (Math.abs(dy) > Math.abs(dx)) { if (dy < 0) goNext(); else goPrev(); }
    else { if (dx < 0) goNext(); else goPrev(); }
  };

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) router.push("/assessment");
    } catch (e) { console.error("startDemo", e); }
    finally { setDemoLoading(false); }
  };

  const ch = CHAPTERS[slide];
  const phase = ch.phase;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none"
      onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y" }}>
      <AnimatePresence>
        {title && (
          <motion.div className="absolute inset-0 z-[70]" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
            <CinematicIntro onEnter={beginFilm} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        <motion.div key={slide} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
          style={{ background: `radial-gradient(60% 58% at 50% 46%, ${ch.color}26, transparent 68%), radial-gradient(42% 42% at 78% 18%, ${ch.color}12, transparent 70%), radial-gradient(34% 34% at 18% 82%, ${ch.color}0e, transparent 70%)` }} />
      </AnimatePresence>

      <AnimatePresence>
        {!title && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }}>
            <CinematicFilm phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

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
          <Link href="/home" title="Visit the marketing site"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-white transition-colors">
            <House className="w-3.5 h-3.5" /> Site
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">Skip →</Link>
        </div>
      </div>

      <div className="absolute top-0 inset-x-0 z-40 h-[3px] bg-white/5">
        <motion.div key={slide} className="h-full origin-left" style={{ background: `linear-gradient(90deg, ${ch.color}, #a78bfa)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: playing && !hovering && !reduced ? 1 : 0 }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pb-20 sm:px-12 lg:px-16">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color: ch.color }}>{ch.tag}</span>
                <span className="h-px w-12" style={{ background: ch.color }} />
              </div>
              <h2 className="text-center text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.02] text-white">
                {ch.title.map((line, i) => (
                  <span key={i} className="block overflow-hidden py-[0.05em] -my-[0.05em]">
                    <motion.span initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="block">
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-center text-sm sm:text-base text-slate-400 leading-relaxed mt-5 max-w-md mx-auto">
                {ch.body}
              </motion.p>

              {ch.chips && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.55 }} className="flex flex-wrap justify-center gap-2 mt-6">
                  {ch.chips.map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase border"
                      style={{ borderColor: `${ch.color}40`, color: ch.color, background: `${ch.color}14` }}>{c}</span>
                  ))}
                </motion.div>
              )}

              {ch.cta && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap justify-center gap-3 mt-8">
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
