"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Move, RotateCcw, X } from "lucide-react";
import { DIRS, dirFromHeading, headingFromDrag } from "@/lib/directions";
import type { DragState } from "@/components/DirectionCompass";

const DirectionCompass = dynamic(() => import("@/components/DirectionCompass"), { ssr: false, loading: () => null });

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

const RING_RADIUS = "min(36vw, 280px)";

export default function CompassSwipe() {
  const [dir, setDir] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<DragState>({ x: 0, y: 0, active: false });
  const showHint = !revealed && dir == null;

  const select = useCallback((i: number) => {
    setDir(i);
    setRevealed(true);
  }, []);

  const goBy = useCallback((step: number) => {
    setDir(prev => (prev == null ? 0 : (prev + step + 8) % 8));
    setRevealed(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goBy(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goBy(-1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(0); }
      else if (e.key === "ArrowDown") { e.preventDefault(); select(4); }
      else if (e.key === "Escape") { setDir(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBy, select]);

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    dragRef.current.x = 0;
    dragRef.current.y = 0;
    dragRef.current.active = true;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current || !dragRef.current.active) return;
    dragRef.current.x = e.clientX - start.current.x;
    dragRef.current.y = e.clientY - start.current.y;
  };

  const finishDrag = (e: React.PointerEvent | null) => {
    if (!start.current) return;
    const dx = e ? e.clientX - start.current.x : dragRef.current.x;
    const dy = e ? e.clientY - start.current.y : dragRef.current.y;
    start.current = null;
    dragRef.current.active = false;
    setDragging(false);
    const len = Math.hypot(dx, dy);
    if (len > 42) {
      select(dirFromHeading(headingFromDrag(dx, dy)));
    }
  };

  const active = dir != null ? DIRS[dir] : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none">
      <div className="absolute inset-0 z-0">
        <DirectionCompass dir={dir} dragRef={dragRef.current} />
      </div>

      <div className="absolute inset-0 z-10" style={{ touchAction: "none", cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={finishDrag} />

      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.06, animation: "storyGrain 0.6s steps(3) infinite" }} />

      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">Spin · Swipe · Discover</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {active && (
            <button onClick={() => setDir(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
          <Link href="/home" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Skip →
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {DIRS.map((d, i) => {
          const ang = d.rad;
          const x = `calc(50% + sin(${ang}rad) * ${RING_RADIUS})`;
          const y = `calc(50% - cos(${ang}rad) * ${RING_RADIUS})`;
          const on = dir === i;
          const near = dir != null && dir === i;
          return (
            <button key={d.key}
              onClick={() => select(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-1 group"
              style={{ left: x, top: y }}>
              <motion.span
                animate={{ opacity: near ? 1 : showHint ? 0.5 : 0.28, scale: near ? 1.15 : 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-sm transition-colors"
                style={{
                  background: near ? d.color : "rgba(255,255,255,0.04)",
                  borderColor: near ? d.color : "rgba(255,255,255,0.14)",
                  boxShadow: near ? `0 0 24px ${d.color}aa` : "none",
                  color: near ? "#fff" : "#94a3b8",
                }}>
                <span className="text-xs font-black tracking-tight">{d.key}</span>
              </motion.span>
              <span className={`text-[9px] tracking-[0.18em] uppercase hidden sm:block transition-colors ${near ? "text-white" : "text-slate-500"}`}>{d.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.8 }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16 rounded-full border border-dashed border-amber-300/40 flex items-center justify-center">
                <span className="absolute inset-2 rounded-full border border-amber-300/20" />
                <Move className="w-6 h-6 text-amber-300" />
              </div>
              <p className="text-xs tracking-[0.4em] uppercase text-amber-200/90">Drag the compass in any direction</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500">Each direction reveals a Compass feature</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={dir} className="absolute inset-x-0 z-30 flex justify-center px-4 sm:px-6 pointer-events-none"
            style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, filter: "blur(8px)" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div className="pointer-events-auto w-full max-w-lg relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-6"
              style={{ boxShadow: `0 30px 90px -30px ${active.color}77, inset 0 1px 0 rgba(255,255,255,0.08)` }}>
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${active.color}2e` }} />
              <button onClick={() => setDir(null)} aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between mb-4 pr-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: active.color, boxShadow: `0 0 14px ${active.color}` }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: active.color }}>{active.tag}</span>
                </div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-slate-500 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                  {active.key} · {String(dir! + 1).padStart(2, "0")} / 08
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">{active.name}</h2>
              <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">{active.body}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {active.points.map((p, i) => (
                  <motion.span key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
                    className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.16em] uppercase border"
                    style={{ borderColor: `${active.color}45`, color: active.color, background: `${active.color}14` }}>{p}</motion.span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 mt-5">
                <div className="flex items-center gap-2">
                  <button onClick={() => goBy(-1)} aria-label="Previous direction"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => goBy(1)} aria-label="Next direction"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <Link href={active.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ background: `linear-gradient(90deg, ${active.color}, ${active.color}cc)` }}>
                  Explore {active.key} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes storyGrain { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,3px)} 50%{transform:translate(3px,-2px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(2px,2px)} }`}</style>
    </div>
  );
}
