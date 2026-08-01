"use client";

import { useEffect, useMemo, useState } from "react";

const DEG = Math.PI / 180;
const R = 120;

const WINDS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function toWind(deg: number) {
  return WINDS[Math.round(deg / 22.5) % 16];
}

export default function TrueNorthCompass({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [show, setShow] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const heading = useMemo(() => hashString(title) % 360, [title]);
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const circumference = 2 * Math.PI * (R - 14);

  useEffect(() => {
    let raf = 0;
    const t1 = setTimeout(() => setShow(true), 80);
    const t2 = setTimeout(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setArmed(true);
      if (!reduced) {
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          setDisplayScore(Math.round(e * clampedScore));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayScore(clampedScore);
      }
    }, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf);
    };
  }, [clampedScore]);

  const needleAngle = armed ? heading : -90;
  const ticks: number[] = [];
  for (let i = 0; i < 60; i++) ticks.push(i);
  const cardinals: [string, number][] = [["N", 0], ["E", 90], ["S", 180], ["W", 270]];

  return (
    <div
      className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-10 rounded-2xl border border-indigo-500/20 p-6 md:p-8 overflow-hidden transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ background: "rgba(15,15,30,0.6)" }}
    >
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full opacity-20 transition-opacity duration-1000" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)", opacity: armed ? 0.3 : 0.1 }} aria-hidden />

      <div className="relative shrink-0">
        <svg viewBox="0 0 260 260" className="w-52 h-52 sm:w-56 sm:h-56">
          <circle cx="130" cy="130" r={R} fill="rgba(10,10,18,0.65)" stroke="rgba(129,140,248,0.3)" strokeWidth="2" />
          <circle cx="130" cy="130" r={R - 34} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {ticks.map(i => {
            const a = i * 6 * DEG;
            const major = i % 15 === 0;
            const r1 = major ? R - 16 : R - 10;
            const r2 = R - 3;
            return (
              <line key={i}
                x1={130 + Math.sin(a) * r1} y1={130 - Math.cos(a) * r1}
                x2={130 + Math.sin(a) * r2} y2={130 - Math.cos(a) * r2}
                stroke={major ? "rgba(148,163,184,0.85)" : "rgba(148,163,184,0.28)"}
                strokeWidth={major ? 2.5 : 1} />
            );
          })}

          {cardinals.map(([label, deg]) => {
            const a = deg * DEG;
            const x = 130 + Math.sin(a) * (R - 30);
            const y = 130 - Math.cos(a) * (R - 30);
            return (
              <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                fontSize="14" fontWeight="800" fill={label === "N" ? "#f87171" : "#94a3b8"}>
                {label}
              </text>
            );
          })}

          <g style={{
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: "130px 130px",
            transition: `transform ${armed ? 2 : 0.6}s cubic-bezier(0.34,1.56,0.64,1)`,
          }}>
            <line x1="130" y1="52" x2="130" y2="130" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
            <line x1="130" y1="208" x2="130" y2="130" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
            <circle cx="130" cy="130" r="8" fill="#0c1020" stroke="#b08a3e" strokeWidth="3" />
          </g>

          <circle cx="130" cy="130" r={R - 14} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="130" cy="130" r={R - 14} fill="none" stroke="url(#ringGrad)" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - clampedScore / 100)}
            style={{ transform: "rotate(-90deg)", transformOrigin: "130px 130px", transition: `stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1) ${armed ? 0.4 : 0}s` }} />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative flex-1 text-center md:text-left">
        <div className="text-[10px] tracking-[0.35em] uppercase text-indigo-300/80 mb-2">Your True North</div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-lg">{description}</p>}
        <div className="flex items-center justify-center md:justify-start gap-6">
          <div>
            <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {displayScore}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Match Signal</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-3xl font-extrabold text-white">{toWind(heading)}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{heading}° Heading</div>
          </div>
        </div>
      </div>
    </div>
  );
}
