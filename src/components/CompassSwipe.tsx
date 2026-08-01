"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Sparkles, UserPlus, Zap } from "lucide-react";
import { DIRS } from "@/lib/directions";

const DirectionCompass = dynamic(() => import("@/components/DirectionCompass"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

const AUTO_MS = 5200;
const LAST = 8;
const clamp = (v: number) => Math.max(0, Math.min(LAST, v));
const IDLE_DRAG = { x: 0, y: 0, active: false };

const FROM = [
  { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
  { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 },
];

function Burst({ color }: { color: string }) {
  const particles = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const d = 16 + Math.random() * 34;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 3 + Math.random() * 6, delay: Math.random() * 0.1 };
  }), []);
  return (
    <>
      {[0, 0.12, 0.24].map((delay, i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: "50%", top: "50%", width: 36, height: 36, marginLeft: -18, marginTop: -18, border: `2px solid ${color}`, boxShadow: `0 0 50px ${color}77, inset 0 0 24px ${color}33` }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 8 + i * 3.2, opacity: 0 }}
          transition={{ delay, duration: 1.15, ease: "easeOut" }} />
      ))}
      {particles.map((p, i) => (
        <motion.span key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: "50%", top: "50%", width: p.s, height: p.s, marginLeft: -p.s / 2, marginTop: -p.s / 2, background: color, boxShadow: `0 0 14px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          transition={{ delay: p.delay, duration: 1.05, ease: [0.16, 1, 0.3, 1] }} />
      ))}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(45% 45% at 50% 50%, ${color}22, transparent 70%)` }}
        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1.6 }} transition={{ duration: 1.0, ease: "easeOut" }} />
    </>
  );
}

export default function CompassSwipe() {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [hovering, setHovering] = useState(false);
  const wheelLock = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const goNext = useCallback(() => setSlide(s => clamp(s + 1)), []);
  const goPrev = useCallback(() => setSlide(s => clamp(s - 1)), []);
  const goTo = useCallback((i: number) => setSlide(clamp(i)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "Enter") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12) return;
      if (Date.now() - wheelLock.current < 750) return;
      wheelLock.current = Date.now();
      if (e.deltaY > 0) goNext(); else goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (slide >= LAST || reduced || hovering) return;
    const t = setTimeout(() => goNext(), AUTO_MS);
    return () => clearTimeout(t);
  }, [slide, reduced, hovering, goNext]);

  const onPointerDown = (e: React.PointerEvent) => {
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!touch.current) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    touch.current = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 48) return;
    if (absX > absY) { if (dx < 0) goNext(); else goPrev(); }
    else { if (dy < 0) goNext(); else goPrev(); }
  };

  const feature = slide >= 0 && slide <= 7 ? DIRS[slide] : null;
  const dir = feature ? slide : null;
  const col = feature?.color ?? (slide === 8 ? "#fbbf24" : "#22d3ee");
  const from = feature ? FROM[slide] : { x: 0, y: -1 };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none"
      onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "none" }}>

      <div className="absolute inset-0 z-0">
        <DirectionCompass dir={dir} dragRef={IDLE_DRAG} />
      </div>

      <AnimatePresence>
        <motion.div key={`wash-${slide}`} className="absolute inset-0 z-[4] pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
          style={{ background: `radial-gradient(55% 55% at 50% 42%, ${col}22, transparent 70%), radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(2,4,16,0.55) 100%)` }} />
      </AnimatePresence>

      <motion.div key={`flash-${slide}`} className="absolute inset-0 z-[6] pointer-events-none"
        initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 1.0, ease: "easeOut" }}
        style={{ background: `radial-gradient(60% 60% at 50% 50%, ${col}18, transparent 70%)` }} />

      <Burst key={`burst-${slide}`} color={col} />

      <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.06, animation: "storyGrain 0.6s steps(3) infinite" }} />

      <AnimatePresence>
        {!reduced && (
          <motion.div key={`sweep-${slide}`} className="pointer-events-none absolute inset-y-0 z-[7] w-[45%] -skew-x-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05), transparent)" }}
            initial={{ left: "-50%" }} animate={{ left: "115%" }} exit={{ left: "115%" }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }} />
        )}
      </AnimatePresence>

      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">A Guided Tour</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.25em] text-slate-500 tabular-nums hidden sm:block">{String(slide + 1).padStart(2, "0")} / {String(LAST + 1).padStart(2, "0")}</span>
          <Link href="/home" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Skip →
          </Link>
        </div>
      </div>

      <div className="absolute top-0 inset-x-0 z-30 h-[3px] bg-white/5">
        <motion.div key={`bar-${slide}`} className="h-full origin-left" style={{ background: `linear-gradient(90deg, ${col}, #a78bfa)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: slide >= LAST || reduced || hovering ? 0 : 1 }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
      </div>

      <AnimatePresence mode="wait">
        {feature && (
          <motion.div key={`feat-${slide}`} className="absolute inset-0 z-20 flex items-center justify-center px-6 pb-24 pointer-events-none"
            initial={{ x: `${from.x * 46}vw`, y: `${from.y * 34}vh`, opacity: 0, filter: "blur(16px)", scale: 0.96 }}
            animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(12px)" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div className="relative w-full max-w-3xl text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="pointer-events-none absolute inset-x-0 -top-7 flex justify-center">
                <motion.span className="font-black text-[26vh] leading-none text-white/[0.045]"
                  style={{ WebkitTextStroke: `1px ${feature.color}33` }}
                  initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
                  {feature.key}
                </motion.span>
              </div>

              {slide === 0 && (
                <>
                  <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
                    className="text-[10px] sm:text-xs tracking-[0.6em] uppercase text-cyan-300/90">Compass presents</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }}
                    className="mt-2 mb-2 text-sm sm:text-base text-slate-400">
                    Eight directions. Eight ways to build your career. The compass turns itself — just follow along.
                  </motion.p>
                </>
              )}

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
                className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border"
                style={{ borderColor: `${feature.color}45`, background: `${feature.color}14` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: feature.color, boxShadow: `0 0 14px ${feature.color}` }} />
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color: feature.color }}>{feature.tag}</span>
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 text-[clamp(2.4rem,7.5vw,5.2rem)] font-black leading-[1.02] tracking-tight"
                style={{ backgroundImage: `linear-gradient(180deg,#ffffff 25%, ${feature.color} 130%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 0 50px ${feature.color}44)` }}>
                {feature.name}
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-4 mx-auto max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
                {feature.body}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                {feature.points.map((p, i) => (
                  <motion.span key={p} initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.85 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="px-4 py-2 rounded-full text-[10px] tracking-[0.18em] uppercase border"
                    style={{ borderColor: `${feature.color}50`, color: feature.color, background: `${feature.color}12`, boxShadow: `0 0 24px ${feature.color}22` }}>{p}</motion.span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-9 flex items-center justify-center gap-3">
                <Link href={feature.href}
                  className="pointer-events-auto inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
                  style={{ background: `linear-gradient(90deg, ${feature.color}, ${feature.color}bb)`, boxShadow: `0 20px 60px -20px ${feature.color}aa` }}>
                  Explore {feature.key} <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={goNext}
                  className="pointer-events-auto inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
                  Next feature <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {slide === 8 && (
          <motion.div key="final" className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.6em] uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> All directions lead forward
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-3 max-w-3xl text-[clamp(2.2rem,7vw,4.8rem)] font-black leading-[1.02] tracking-tight text-white"
              style={{ textShadow: "0 0 60px rgba(251,191,36,0.3)" }}>
              Your future starts with the right direction
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-4 max-w-md text-sm sm:text-base text-slate-400">
              Join the career OS that works in Hindi and English — free, for every Indian student.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-sm font-semibold text-white transition-all glow-sm">
                <Zap className="w-4 h-4" /> Start Your Career Journey
              </Link>
              <Link href="/home" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
                <UserPlus className="w-4 h-4" /> Explore Features
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 z-30 flex items-center justify-center gap-4 px-6 bottom-5">
        <button onClick={goPrev} aria-label="Previous"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: LAST + 1 }, (_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-7" : "w-3 bg-white/15 hover:bg-white/30"}`}
              style={i === slide ? { background: i <= 7 ? DIRS[i].color : "#fbbf24" } : undefined} />
          ))}
        </div>
        <button onClick={goNext} aria-label="Next"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`@keyframes storyGrain { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,3px)} 50%{transform:translate(3px,-2px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(2px,2px)} }`}</style>
    </div>
  );
}
