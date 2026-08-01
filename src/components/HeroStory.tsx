"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass, Loader2, Sparkles, UserPlus, Zap } from "lucide-react";

const HeroCompass = dynamic(() => import("@/components/HeroCompass"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

interface Feature {
  dir: string;
  name: string;
  tag: string;
  color: string;
  body: string;
  points: string[];
}

const FEATURES: Feature[] = [
  { dir: "N", name: "AI Career Assessment", tag: "Know yourself", color: "#f59e0b", body: "Map your RIASEC code, Big Five traits and strengths in minutes — your true north, computed.", points: ["RIASEC Interest Code", "Big Five Personality", "Skill Graph"] },
  { dir: "NE", name: "Explore Career Paths", tag: "Find your way", color: "#22d3ee", body: "650+ real paths with salaries, demand and next steps — see the road before you walk it.", points: ["650+ Career Paths", "Salary & Demand", "Next Steps"] },
  { dir: "E", name: "AI Mock Interview", tag: "Face the panel", color: "#a855f7", body: "Practice against an AI panel, scored live with honest feedback for every round.", points: ["AI Panel", "Live Scoring", "Analytics"] },
  { dir: "SE", name: "Resume Builder", tag: "Open every door", color: "#f472b6", body: "An ATS-ready resume built in minutes — plus AI outreach that actually gets replies.", points: ["Resume Builder", "ATS Check", "AI Outreach"] },
  { dir: "S", name: "Aptitude Training", tag: "Train your mind", color: "#10b981", body: "Bite-sized drills with instant scoring, weekly tests and live performance tracking.", points: ["Daily Quiz", "Weekly Test", "Live Performance"] },
  { dir: "SW", name: "Jobs & Internships", tag: "Land offers", color: "#34d399", body: "Openings matched to your profile — tracked end to end from apply to accepted offer.", points: ["Matched Jobs", "Internships", "Live Tracker"] },
  { dir: "W", name: "Compass AI Coach", tag: "Think together", color: "#818cf8", body: "An agent that plans, drafts and guides you — from first question to final offer, 24/7.", points: ["Career Coach", "Live Agent", "24/7"] },
  { dir: "NW", name: "Learning Roadmap", tag: "Close the gap", color: "#f97316", body: "A sequenced plan built around exactly what you're missing — not a generic syllabus.", points: ["Courses", "Skill Gaps", "Personal Coach"] },
];

const AUTO_MS = 4000;
const LAST = 9;
const clamp = (v: number) => Math.max(0, Math.min(LAST, v));

export default function HeroStory() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const target = useMotionValue(0);
  const pos = useSpring(target, { stiffness: 110, damping: 26, mass: 0.9 });
  const posRef = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [hovering, setHovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const wheelLock = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });

  useMotionValueEvent(pos, "change", (v) => {
    posRef.current = v;
    const r = Math.round(v);
    if (r !== activeRef.current) {
      activeRef.current = r;
      setActive(r);
      setBusy(true);
      setTimeout(() => setBusy(false), 850);
    }
  });

  const goNext = useCallback(() => target.set(clamp(Math.round(target.get()) + 1)), [target]);
  const goPrev = useCallback(() => target.set(clamp(Math.round(target.get()) - 1)), [target]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "Enter") { e.preventDefault(); goNext(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 16) return;
      if (Date.now() - wheelLock.current < 260) return;
      wheelLock.current = Date.now();
      target.set(clamp(target.get() + e.deltaY / 420));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [target]);

  useEffect(() => {
    if (active >= LAST || reduced || hovering) return;
    const t = setTimeout(() => target.set(clamp(target.get() + 1)), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, reduced, hovering, target]);

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) router.push("/assessment");
    } catch (e) { console.error("startDemo", e); }
    finally { setDemoLoading(false); }
  };

  const feature = active >= 1 && active <= 8 ? FEATURES[active - 1] : null;
  const col = feature?.color ?? (active === 9 ? "#fbbf24" : "#f59e0b");

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none"
      onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}
      onPointerMove={(e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry.set(nx * -6);
        rx.set(ny * 6);
      }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) goNext(); else goPrev(); }
        else if (Math.abs(dy) > 56) { if (dy < 0) goNext(); else goPrev(); }
      }}>

      <AnimatePresence>
        <motion.div key={active} className="absolute inset-0 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
          style={{ background: `radial-gradient(60% 60% at 60% 46%, ${col}2e, transparent 70%), radial-gradient(40% 40% at 80% 15%, ${col}14, transparent 70%), radial-gradient(30% 30% at 10% 84%, ${col}10, transparent 70%)` }} />
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <HeroCompass feature={posRef} />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.07, animation: "storyGrain 0.6s steps(3) infinite" }} />

      <motion.div key={`vig-${active}`} className="absolute inset-0 z-[6] pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        style={{ boxShadow: `inset 0 0 26vmax ${col}14, inset 0 0 22vmax rgba(0,0,0,0.8), inset 0 0 6vmax rgba(0,0,0,0.9)` }} />

      <AnimatePresence>
        {!reduced && (
          <motion.div key={`sweep-${active}`} className="pointer-events-none absolute inset-y-0 z-[7] w-[45%] -skew-x-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04), transparent)" }}
            initial={{ left: "-50%" }} animate={{ left: "115%" }} exit={{ left: "115%" }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
        )}
      </AnimatePresence>

      <div className="absolute top-0 inset-x-0 z-50 h-[6.5vh] bg-black/90 border-b pointer-events-none" style={{ borderColor: `${col}22` }} />
      <div className="absolute bottom-0 inset-x-0 z-50 h-[6.5vh] bg-black/90 border-t pointer-events-none" style={{ borderColor: `${col}22` }} />

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
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">The Master Compass</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Rec
          </span>
          <span className="text-[11px] tracking-[0.25em] text-slate-500 tabular-nums hidden sm:block">{String(active + 1).padStart(2, "0")} / 10</span>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">Skip →</Link>
        </div>
      </div>

      <div className="absolute top-0 inset-x-0 z-40 h-[3px] bg-white/5">
        <motion.div key={active} className="h-full origin-left" style={{ background: `linear-gradient(90deg, ${col}, #a78bfa)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: active === LAST || reduced || hovering ? 0 : 1 }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
      </div>

      <AnimatePresence>
        {active === 0 && (
          <motion.div key="intro" className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }} transition={{ duration: 0.9 }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="text-[10px] sm:text-xs tracking-[0.6em] uppercase text-slate-400">Compass presents</motion.p>
            <h1 className="mt-3 text-[clamp(2.6rem,9vw,6.5rem)] font-black leading-none tracking-tight"
              style={{ backgroundImage: "linear-gradient(180deg,#ffffff 30%,#d9c088 95%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 40px rgba(245,158,11,0.25))" }}>
              MASTER COMPASS
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-4 max-w-md text-sm sm:text-base text-slate-400">
              Eight directions. One career operating system. Spin the compass — every needle points to a part of your future.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-8">
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-amber-300/90">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" /> Scroll to begin
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feature && (
          <motion.div key={`card-${active}`}
            className="absolute left-0 right-0 z-20 bottom-0 pb-32 sm:pb-28 sm:left-auto sm:max-w-md sm:pr-10 lg:pr-14 px-6 sm:flex sm:items-center sm:top-0 sm:pt-0 sm:pl-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -24, filter: "blur(8px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div className="relative" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
              <motion.div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7"
                style={{ boxShadow: `0 30px 80px -30px ${feature.color}66, inset 0 1px 0 rgba(255,255,255,0.08)` }}
                initial={{ y: 26, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: `${feature.color}33` }} />
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: feature.color, boxShadow: `0 0 14px ${feature.color}` }} />
                    <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: feature.color }}>{feature.tag}</span>
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-slate-500 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                    {feature.dir} · {String(active).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  {feature.name}
                </h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feature.body}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {feature.points.map((p, i) => (
                    <motion.span key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                      className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.16em] uppercase border"
                      style={{ borderColor: `${feature.color}45`, color: feature.color, background: `${feature.color}14` }}>{p}</motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active === 9 && (
          <motion.div key="final" className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.6em] uppercase" style={{ color: "#fbbf24" }}>
              <Sparkles className="w-3.5 h-3.5" /> All directions lead forward
            </motion.p>
            <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] font-black leading-[1.02] tracking-tight text-white"
              style={{ textShadow: "0 0 60px rgba(251,191,36,0.35)" }}>
              Your future starts with the right direction
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-4 max-w-md text-sm sm:text-base text-slate-400">
              Join the career OS that works in Hindi and English — free, for every Indian student.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button onClick={startDemo} disabled={demoLoading}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold text-white transition-all glow-sm">
                {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {demoLoading ? "Setting up..." : "Start Your Career Journey"}
              </button>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
                <UserPlus className="w-4 h-4" /> Create Account
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1.5 pointer-events-none">
        {FEATURES.map((f, i) => {
          const on = active === i + 1;
          return (
            <motion.div key={f.dir} className="flex items-center gap-2.5 justify-end"
              animate={{ opacity: on ? 1 : 0.4, x: on ? 0 : 6 }}>
              <span className={`text-[9px] tracking-[0.25em] uppercase ${on ? "text-white" : "text-slate-500"} transition-colors`}>{f.name}</span>
              <span className="w-2 h-2 rotate-45 rounded-[2px]" style={{ background: on ? f.color : "rgba(255,255,255,0.15)", boxShadow: on ? `0 0 12px ${f.color}` : "none" }} />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute inset-x-0 z-30 flex items-center justify-center gap-4 px-6 bottom-[6vh]">
        <button onClick={goPrev} aria-label="Previous"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <button key={i} onClick={() => target.set(i)} aria-label={`Position ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-7" : "w-3 bg-white/15 hover:bg-white/30"}`}
              style={i === active ? { background: i >= 1 && i <= 8 ? FEATURES[i - 1].color : "#fbbf24" } : undefined} />
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
