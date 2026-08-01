"use client";

import { motion } from "framer-motion";

function CompassMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
    </svg>
  );
}

function OrbitRing({ sizePct, duration, border, dotColor, tilt }: { sizePct: number; duration: number; border: string; dotColor: string; tilt: string }) {
  const inset = `${(100 - sizePct) / 2}%`;
  return (
    <motion.div className="absolute inset-0" style={{ transform: tilt, transformStyle: "preserve-3d" }}
      animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      <div className="absolute rounded-full" style={{ inset, border }} />
      <div className="absolute w-[2.5%] h-[2.5%] rounded-full" style={{ left: "50%", top: inset, transform: "translate(-50%,-50%)", background: dotColor, boxShadow: `0 0 14px ${dotColor}` }} />
    </motion.div>
  );
}

export default function AmbientCompass({ opacity = 0.1, anchor = "55% 38%" }: { opacity?: number; anchor?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden style={{ opacity }}>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_var(--mask-pos),black_32%,transparent_76%)]" style={{ "--mask-pos": anchor } as React.CSSProperties}>
        <div className="absolute left-[54%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(140vh,110rem)] h-[min(140vh,110rem)]" style={{ perspective: 1200 }}>
          <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(18deg)" }}>
            <OrbitRing sizePct={100} duration={34} tilt="rotateX(70deg)" border="1px dashed rgba(129,140,248,0.42)" dotColor="#818cf8" />
            <OrbitRing sizePct={72} duration={46} tilt="rotateY(72deg)" border="1px solid rgba(52,211,153,0.34)" dotColor="#34d399" />
            <OrbitRing sizePct={50} duration={27} tilt="rotateX(-64deg)" border="1px solid rgba(232,121,249,0.36)" dotColor="#e879f9" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%]">
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center"
                style={{ boxShadow: "0 0 60px rgba(129,140,248,0.5)" }}>
                <CompassMark className="w-[45%] h-[45%] text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
