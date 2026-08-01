"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Play, Check, ChevronsUpDown } from "lucide-react";

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
  steps, open, onClose, accent = "indigo", autoAdvanceMs = 0,
}: { steps: TourStep[]; open: boolean; onClose: () => void; accent?: string; autoAdvanceMs?: number }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);
  const [flip, setFlip] = useState<"down" | "up">("down");
  const [arrowLeft, setArrowLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [givenUp, setGivenUp] = useState(false);

  const step = steps[Math.min(index, steps.length - 1)];

  const spotTop = useSpring(20, { stiffness: 230, damping: 27 });
  const spotLeft = useSpring(20, { stiffness: 230, damping: 27 });
  const spotW = useSpring(0, { stiffness: 190, damping: 25 });
  const spotH = useSpring(0, { stiffness: 190, damping: 25 });
  const tipTop = useSpring(0, { stiffness: 210, damping: 26 });
  const tipLeft = useSpring(0, { stiffness: 210, damping: 26 });
  const tiltX = useSpring(0, { stiffness: 280, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 280, damping: 18 });

  const navLock = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tipH = useRef(250);

  const tipW = typeof window !== "undefined" ? Math.min(330, window.innerWidth - 24) : 330;

  const navigate = useCallback((delta: number) => {
    if (delta === 0 || Date.now() - navLock.current < 420) return;
    navLock.current = Date.now();
    setIndex(prev => Math.max(0, Math.min(prev + delta, steps.length - 1)));
    setReady(false);
  }, [steps.length]);

  const goNext = useCallback(() => {
    if (index >= steps.length - 1) onClose();
    else navigate(1);
  }, [index, steps.length, onClose, navigate]);

  const goPrev = useCallback(() => navigate(-1), [navigate]);

  const recompute = useCallback(() => {
    const fallback = () => {
      if (givenUp) {
        tipTop.set(Math.max(10, window.innerHeight / 2 - 140));
        tipLeft.set(Math.max(12, window.innerWidth / 2 - tipW / 2));
      } else {
        tipTop.set(20); tipLeft.set(20);
      }
      spotTop.set(20); spotLeft.set(20); spotW.set(0); spotH.set(0);
    };
    if (!step.target) { setMissing(false); fallback(); setReady(true); return; }
    const el = document.querySelector(step.target);
    if (!el) { setMissing(true); fallback(); setReady(true); return; }
    setMissing(false);
    const r = getRect(el);
    spotTop.set(r.top - 6); spotLeft.set(r.left - 6); spotW.set(r.width + 12); spotH.set(r.height + 12);
    const w = tipW;
    const h = tipH.current;
    const below = r.top + r.height + 18 + h <= window.innerHeight;
    let top: number;
    if (below) { top = r.top + r.height + 22; setFlip("down"); }
    else {
      const aboveTop = r.top - h - 12;
      if (aboveTop >= 10) { top = aboveTop; setFlip("up"); }
      else { top = r.top + r.height + 22; setFlip("down"); }
    }
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
    top = Math.max(10, Math.min(window.innerHeight - h - 10, top));
    tipTop.set(top); tipLeft.set(left);
    setArrowLeft(Math.max(4, Math.min(w - 8, r.left + r.width / 2 - left)));
    setReady(true);
  }, [step.target, givenUp, tipW, tipTop, tipLeft, spotTop, spotLeft, spotW, spotH]);

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
      else if (tries > 60) { setGivenUp(true); clearInterval(t); }
    }, 150);
    return () => clearInterval(t);
  }, [open, missing, step.target, recompute]);

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setIndex(0); setReady(false); setProgressPct(0); setGivenUp(false); tipH.current = 250;
  }, [open]);

  // Give up state is per-step
  useEffect(() => { setGivenUp(false); }, [index]);

  // Measure the rendered tooltip and re-position once its true height is known
  useEffect(() => {
    if (!open || !ready || missing) return;
    const el = tooltipRef.current;
    if (!el) return;
    const h = el.offsetHeight;
    if (h > 0 && Math.abs(h - tipH.current) > 4) { tipH.current = h; recompute(); }
  }, [open, ready, missing, index, recompute]);

  // Auto-scroll the target into view so the spotlight centers itself
  useEffect(() => {
    if (!open || !step.target) return;
    const el = document.querySelector(step.target);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 170;
    if (r.top < pad || r.bottom > window.innerHeight - pad) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const t = setTimeout(recompute, 720);
      return () => clearTimeout(t);
    }
  }, [open, index, step.target, recompute]);

  // Swipe up/down on the dim layer
  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (Math.abs(dy) < 45) return;
    if (dy < 0) goNext(); else goPrev();
  };

  // Scroll wheel navigates steps ONLY while hovering the tooltip, so the page
  // behind the tour can scroll normally everywhere else.
  useEffect(() => {
    if (!open) return;
    const onWheel = (e: WheelEvent) => {
      if (!paused) return;
      if (e.deltaY === 0 || Date.now() - navLock.current < 450) return;
      e.preventDefault();
      navLock.current = Date.now();
      if (e.deltaY > 0) goNext(); else goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [open, paused, goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goNext, goPrev]);

  // Auto-advance with a visible progress bar (pauses on hover)
  const adv = useRef({ start: 0, elapsed: 0 });
  useEffect(() => { adv.current.elapsed = 0; setProgressPct(0); }, [index, open]);
  useEffect(() => {
    if (!open || autoAdvanceMs <= 0) { setProgressPct(0); return; }
    if (paused) { adv.current.elapsed += performance.now() - adv.current.start; return; }
    adv.current.start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = adv.current.elapsed + (now - adv.current.start);
      const p = Math.min(1, elapsed / autoAdvanceMs);
      setProgressPct(p * 100);
      if (p >= 1) {
        if (index >= steps.length - 1) return;
        goNext();
      } else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, autoAdvanceMs, paused, index, goNext]);

  const grad = accent === "emerald" ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-purple-500";
  const gradBg = accent === "emerald"
    ? "linear-gradient(120deg, rgba(16,185,129,0.95), rgba(20,184,166,0.85), rgba(52,211,153,0.9))"
    : "linear-gradient(120deg, rgba(99,102,241,0.95), rgba(168,85,247,0.85), rgba(236,72,153,0.9))";
  const glowCss = accent === "emerald"
    ? "radial-gradient(circle at 30% 20%, rgba(16,185,129,0.5), rgba(45,212,191,0.3), transparent 70%)"
    : "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.55), rgba(168,85,247,0.35), transparent 70%)";
  const spotShadow = accent === "emerald"
    ? ["0 0 30px rgba(16,185,129,0.4)", "0 0 70px rgba(45,212,191,0.55)", "0 0 30px rgba(16,185,129,0.4)"]
    : ["0 0 30px rgba(99,102,241,0.4)", "0 0 70px rgba(168,85,247,0.55)", "0 0 30px rgba(99,102,241,0.4)"];
  const spotBorder = accent === "emerald"
    ? "2px solid rgba(16,185,129,0.9)"
    : "2px solid rgba(129,140,248,0.9)";

  const onTiltMove = (e: React.PointerEvent) => {
    const el = tooltipRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -18);
  };
  const onTiltLeave = () => { tiltX.set(0); tiltY.set(0); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100]">
          {/* Click blocker + swipe capture (under the spotlight cutout) */}
          <motion.div
            className="absolute inset-0"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />

          {/* Fallback dim when the target is missing */}
          {ready && missing && <motion.div className="absolute inset-0 bg-black/50" />}

          {/* Spotlight cutout — target stays fully visible, everything else dims */}
          {ready && !missing && (
            <motion.div
              className="absolute"
              style={{ top: spotTop, left: spotLeft, width: spotW, height: spotH }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.62)",
                  borderRadius: 16,
                  border: spotBorder,
                }}
              />
              <motion.div
                className="absolute -inset-1 rounded-2xl pointer-events-none"
                animate={{ boxShadow: spotShadow }}
                transition={{ repeat: Infinity, duration: 2.6 }}
              />
            </motion.div>
          )}

          {/* 3D tooltip */}
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.88 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
              style={{ top: tipTop, left: tipLeft, width: tipW }}
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              {/* Connector arrow pointing at the spotlight */}
              {!missing && (
                <div
                  className="absolute w-3 h-3 rotate-45 rounded-[2px] z-0"
                  style={{
                    top: flip === "down" ? -6 : undefined,
                    bottom: flip === "up" ? -6 : undefined,
                    left: arrowLeft - 6,
                    background: gradBg,
                  }}
                />
              )}

              {/* Float wrapper */}
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                {/* 3D tilt wrapper */}
                <motion.div
                  ref={tooltipRef}
                  onPointerMove={onTiltMove}
                  onPointerLeave={onTiltLeave}
                  style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900, transformStyle: "preserve-3d" }}
                  className="relative"
                >
                  {/* Glow blob */}
                  <div className="absolute -inset-3 -z-10 rounded-3xl blur-2xl opacity-60" style={{ background: glowCss }} />
                  {/* Gradient border card */}
                  <div className="relative rounded-2xl p-[1.5px] shadow-2xl shadow-black/60" style={{ background: gradBg }}>
                    <div className="relative rounded-[14.5px] p-4 overflow-hidden" style={{ background: "rgba(16,16,26,0.97)", backdropFilter: "blur(24px)" }}>
                      {/* Shine sweep */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: "-130%" }}
                        animate={{ x: "230%" }}
                        transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut", repeatDelay: 1.2 }}
                        style={{
                          background: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.07) 55%, transparent 80%)",
                          transform: "skewX(-14deg)",
                        }}
                      />

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white font-bold tracking-wider`}>
                            STEP {index + 1}/{steps.length}
                          </span>
                          {autoAdvanceMs > 0 && (
                            <span className="w-10 h-1 rounded-full bg-white/10 overflow-hidden">
                              <span className={`block h-full bg-gradient-to-r ${grad}`} style={{ width: `${progressPct}%` }} />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {missing && !givenUp && <span className="flex items-center gap-1 text-[9px] text-slate-500"><motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 h-1 rounded-full bg-indigo-400 inline-block" /> locating…</span>}
                          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold mb-1 text-white" style={{ transform: "translateZ(34px)" }}>{step.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3" style={{ transform: "translateZ(22px)" }}>{step.body}</p>

                      <div className="flex items-center gap-1 mb-3">
                        {steps.map((_, i) => (
                          <button key={i} onClick={() => navigate(i - index)}
                            className={`h-1 rounded-full transition-all ${i === index ? `bg-gradient-to-r ${grad} w-5` : "bg-white/15 w-2.5 hover:bg-white/30"}`} />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={goPrev} disabled={index === 0}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 disabled:opacity-40 hover:text-white transition-colors">
                          <ChevronLeft className="w-3 h-3" /> Back
                        </button>
                        <button onClick={goNext}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r ${grad} text-[11px] font-semibold text-white shadow-lg shadow-indigo-500/30`}>
                          {index >= steps.length - 1 ? (<><Check className="w-3 h-3" /> Done</>) : (<><Play className="w-3 h-3" /> Next <ChevronRight className="w-3 h-3" /></>)}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-slate-600">
                        <ChevronsUpDown className="w-3 h-3 text-indigo-400" /> Swipe up / down or scroll · auto-advances · hover to pause
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
