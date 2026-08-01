"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";

const HeroCompass = dynamic(() => import("@/components/HeroCompass"), { ssr: false, loading: () => null });

export default function CompassHero() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#04040a] text-slate-200 select-none">
      <div className="absolute inset-0 z-0">
        <HeroCompass slide={0} />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />

      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-slate-500 mt-0.5">Career Intelligence</div>
          </div>
        </div>
        <Link href="/login" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          Sign in
        </Link>
      </div>

      <div className="absolute inset-x-0 z-10 flex flex-col items-center justify-center text-center px-6 -mt-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className="text-[10px] sm:text-xs tracking-[0.6em] uppercase text-amber-300/90">Your true north, computed</p>
          <h1 className="mt-4 text-[clamp(2.8rem,9vw,6rem)] font-black leading-none tracking-tight"
            style={{ backgroundImage: "linear-gradient(180deg,#ffffff 30%,#d9c088 95%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 40px rgba(245,158,11,0.25))" }}>
            Compass
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base text-slate-400 leading-relaxed">
            Discover the career that fits you. AI assessments, mock interviews, jobs and a learning roadmap — one direction at a time.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-sm font-semibold text-white transition-all glow-sm">
            Start Your Career Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/home"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors">
            Explore Features
          </Link>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-6">
        {["Assess", "Explore", "Practice", "Apply"].map((step, i) => (
          <div key={step} className="flex items-center gap-6">
            {i > 0 && <span className="w-8 h-px bg-white/15" />}
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
