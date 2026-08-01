"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Play, Check } from "lucide-react";

export interface TourStep {
  target?: string;
  title: string;
  body: string;
}

interface Rect { top: number; left: number; width: number; height: number; }

function getRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function Tour({
  steps, open, onClose, accent = "indigo",
}: { steps: TourStep[]; open: boolean; onClose: () => void; accent?: string }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);

  const step = steps[Math.min(index, steps.length - 1)];

  const recompute = useCallback(() => {
    if (!step.target) { setRect(null); setMissing(false); setTooltipPos({ top: 20, left: 20 }); setReady(true); return; }
    const el = document.querySelector(step.target);
    if (!el) { setRect(null); setMissing(true); setTooltipPos({ top: 20, left: 20 }); setReady(true); return; }
    setMissing(false);
    const r = getRect(el);
    setRect(r);
    // Place tooltip below by default, above if too close to bottom
    const w = 300;
    let top = r.top + r.height + 14;
    let left = r.left + r.width / 2 - w / 2;
    if (top + 220 > window.innerHeight) top = r.top - 230;
    left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
    setTooltipPos({ top, left });
    setReady(true);
  }, [step.target, index]);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setReady(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [open, recompute]);

  // Keep polling until a late-rendering target appears (async content)
  useEffect(() => {
    if (!open || !missing || !step.target) return;
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (document.querySelector(step.target!)) { recompute(); clearInterval(t); }
      else if (tries > 60) clearInterval(t);
    }, 150);
    return () => clearInterval(t);
  }, [open, missing, step.target, recompute]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex(i => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, steps.length]);

  const next = () => {
    if (index >= steps.length - 1) onClose();
    else { setIndex(i => i + 1); setReady(false); }
  };

  const grad = accent === "emerald" ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-purple-500";

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none">
          {/* Dim + spotlight */}
          <div className="absolute inset-0 bg-black/55" />
          {rect && ready && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="absolute rounded-xl border-2 border-indigo-400/70"
              style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }}
            />
          )}

          {/* Tooltip */}
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute pointer-events-auto w-[300px] rounded-2xl border border-white/10 p-4 shadow-2xl"
              style={{ top: tooltipPos.top, left: tooltipPos.left, background: "rgba(18,18,28,0.97)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white font-bold tracking-wider`}>
                  STEP {index + 1}/{steps.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {missing && <span className="flex items-center gap-1 text-[9px] text-slate-500"><motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 h-1 rounded-full bg-indigo-400 inline-block" /> locating…</span>}
                  <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h4 className="text-sm font-bold mb-1 text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{step.body}</p>
              <div className="flex items-center gap-1 mb-3">
                {steps.map((_, i) => (
                  <button key={i} onClick={() => { setIndex(i); setReady(false); }}
                    className={`h-1 rounded-full transition-all ${i === index ? `bg-gradient-to-r ${grad} w-5` : "bg-white/15 w-2.5"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIndex(i => Math.max(i - 1, 0))} disabled={index === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 disabled:opacity-40 hover:text-white transition-colors">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <button onClick={next}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r ${grad} text-[11px] font-semibold text-white shadow-lg`}>
                  {index >= steps.length - 1 ? (<><Check className="w-3 h-3" /> Done</>) : (<><Play className="w-3 h-3" /> Next <ChevronRight className="w-3 h-3" /></>)}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
