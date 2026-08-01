"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass, Loader2, Play, UserPlus, Zap } from "lucide-react";

const HeroCompass = dynamic(() => import("@/components/HeroCompass"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

interface Slide {
  no: string;
  tag: string;
  color: string;
  title: string[];
  body: string;
  points?: string[];
  cta?: boolean;
}

const SLIDES: Slide[] = [
  { no: "01", tag: "Welcome", color: "#f59e0b", title: ["Every student", "has potential."], body: "Somewhere inside you is a career that fits. Compass helps you find the direction that was always yours." },
  { no: "02", tag: "Know Yourself", color: "#818cf8", title: ["Map your", "true north"], body: "An AI-guided assessment maps your personality, strengths and interests onto the RIASEC wheel and Big Five — in minutes, not months.", points: ["RIASEC Interest Code", "Big Five Personality", "Skill Graph"] },
  { no: "03", tag: "Explore Careers", color: "#22d3ee", title: ["Discover where", "you fit"], body: "Career paths light up around your profile — with salaries, skills and steps, so you can see the road ahead.", points: ["650+ Career Paths", "Salary & Demand", "Next Steps"] },
  { no: "04", tag: "Future-Proof Decisions", color: "#34d399", title: ["Win the", "AI era"], body: "See how automation reshapes every role — and build the skills the future rewards, before the market shifts.", points: ["AI Automation Risk", "Growth Projections", "Future Skills"] },
  { no: "05", tag: "Prepare for Success", color: "#a855f7", title: ["Master every", "round"], body: "Practice against an AI interview panel, build an ATS-ready resume, follow a learning roadmap — and reach out with emails that get replies.", points: ["AI Mock Interview", "Resume Builder", "Learning Roadmap", "AI Outreach"] },
  { no: "06", tag: "Jobs & Opportunities", color: "#f472b6", title: ["Land real", "offers"], body: "Openings matched to your profile, tracked from apply to offer — internships, campus placements, jobs.", points: ["Matched Jobs", "Internships", "Live Tracker"] },
  { no: "07", tag: "Your Move", color: "#fbbf24", title: ["Your future starts", "with the right direction"], body: "Join the career OS that works in Hindi and English — free, for every Indian student.", cta: true },
];

const AUTO_MS = 4300;
const LAST = SLIDES.length - 1;

export default function HeroStory() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const slideRef = useRef(0);
  const lock = useRef(0);
  const wheelLock = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });

  const goTo = useCallback((i: number) => {
    const target = Math.max(0, Math.min(LAST, i));
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
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 24) return;
      if (Date.now() - wheelLock.current < 1100) return;
      wheelLock.current = Date.now();
      if (e.deltaY > 0) goNext(); else goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (slide === LAST || reduced || hovering) return;
    const t = setTimeout(() => goNext(), AUTO_MS);
    return () => clearTimeout(t);
  }, [slide, reduced, hovering, goNext]);

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) router.push("/assessment");
    } catch (e) { console.error("startDemo", e); }
    finally { setDemoLoading(false); }
  };

  const ch = SLIDES[slide];

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none"
      onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}
      onPointerMove={(e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry.set(nx * -7);
        rx.set(ny * 7);
      }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) goNext(); else goPrev(); }
        else if (Math.abs(dy) > 64) { if (dy < 0) goNext(); else goPrev(); }
      }}>

      <AnimatePresence>
        <motion.div key={slide} className="absolute inset-0 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
          style={{ background: `radial-gradient(60% 60% at 62% 46%, ${ch.color}30, transparent 70%), radial-gradient(40% 40% at 80% 15%, ${ch.color}16, transparent 70%), radial-gradient(30% 30% at 12% 82%, ${ch.color}12, transparent 70%)` }} />
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <HeroCompass slide={slide} />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 48%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.07, animation: "storyGrain 0.6s steps(3) infinite" }} />

      <motion.div key={`vig-${slide}`} className="absolute inset-0 z-[6] pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        style={{ boxShadow: `inset 0 0 26vmax ${ch.color}14, inset 0 0 22vmax rgba(0,0,0,0.78), inset 0 0 6vmax rgba(0,0,0,0.9)` }} />

      <AnimatePresence>
        {!reduced && (
          <motion.div key={`sweep-${slide}`} className="pointer-events-none absolute inset-y-0 z-[7] w-[45%] -skew-x-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04), transparent)" }}
            initial={{ left: "-50%" }} animate={{ left: "115%" }} exit={{ left: "115%" }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
        )}
      </AnimatePresence>

      <div className="absolute top-0 inset-x-0 z-50 h-[6.5vh] bg-black/90 border-b pointer-events-none" style={{ borderColor: `${ch.color}22` }} />
      <div className="absolute bottom-0 inset-x-0 z-50 h-[6.5vh] bg-black/90 border-t pointer-events-none" style={{ borderColor: `${ch.color}22` }} />

      <motion.div className="absolute top-0 left-0 right-0 z-30 bg-black"
        animate={{ height: busy && !reduced ? 44 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
      <motion.div className="absolute bottom-0 left-0 right-0 z-30 bg-black"
        animate={{ height: busy && !reduced ? 44 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />

      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">Your Direction</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Rec
          </span>
          <span className="text-[11px] tracking-[0.25em] text-slate-500 tabular-nums hidden sm:block">{String(slide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</span>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">Skip →</Link>
        </div>
      </div>

      <div className="absolute top-0 inset-x-0 z-40 h-[3px] bg-white/5">
        <motion.div key={slide} className="h-full origin-left" style={{ background: `linear-gradient(90deg, ${ch.color}, #a78bfa)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: slide === LAST || reduced || hovering ? 0 : 1 }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
      </div>

      <div className="absolute left-0 right-0 z-20 bottom-0 pb-32 sm:pb-28 sm:left-auto sm:max-w-2xl sm:pl-0 sm:pr-12 lg:pr-16 px-6 sm:flex sm:items-center sm:justify-start sm:top-0 sm:pt-0">
        <motion.div className="relative max-w-xl" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
          <motion.div key={`ghost-${slide}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -left-6 -top-14 sm:-left-16 sm:-top-20 text-[clamp(8rem,24vw,20rem)] font-black leading-none select-none"
            style={{ color: `${ch.color}0f`, WebkitTextStroke: `1px ${ch.color}26` }}>
            {ch.no}
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color: ch.color }}>{ch.tag}</span>
                <span className="h-px w-12" style={{ background: ch.color }} />
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02] text-white"
                style={{ textShadow: `0 0 60px ${ch.color}59, 0 0 18px ${ch.color}2e` }}>
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

              {ch.points && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.55 }} className="flex flex-wrap gap-2 mt-5 max-w-md">
                  {ch.points.map(p => (
                    <span key={p} className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase border"
                      style={{ borderColor: `${ch.color}40`, color: ch.color, background: `${ch.color}14` }}>{p}</span>
                  ))}
                </motion.div>
              )}

              {ch.cta && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-3 mt-6">
                  <button onClick={startDemo} disabled={demoLoading}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold text-white transition-all glow-sm">
                    {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {demoLoading ? "Setting up..." : "Start Your Career Journey"}
                  </button>
                  <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
                    <UserPlus className="w-4 h-4" /> Create Account
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute left-6 bottom-24 z-30 text-[9px] tracking-[0.4em] uppercase text-slate-600 hidden sm:block pointer-events-none">
        Compass · A career story in 7 scenes
      </div>

      <div className="absolute inset-x-0 z-30 flex items-center justify-center gap-4 px-6 bottom-[6vh]">
        <button onClick={goPrev} aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button key={s.no} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-7" : "w-3 bg-white/15 hover:bg-white/30"}`}
              style={i === slide ? { background: s.color } : undefined} />
          ))}
        </div>
        <button onClick={goNext} aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {slide < LAST && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-slate-500">
          Scroll <Play className="w-3 h-3 rotate-90" />
        </motion.div>
      )}

      <style>{`@keyframes storyGrain { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,3px)} 50%{transform:translate(3px,-2px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(2px,2px)} }`}</style>
    </div>
  );
}
