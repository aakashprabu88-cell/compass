"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass, ArrowRight, Shield, Brain, TrendingUp, Users, Zap,
  ChevronRight, Check, Mic, FileText, MessageSquare, Sparkles,
  LayoutDashboard, Target, BarChart3, GitBranch
} from "lucide-react";

const STATS = [
  { value: "30-50%", label: "of students change their major" },
  { value: "$1.7T", label: "in student loan debt" },
  { value: "60%", label: "of graduates work outside their field" },
  { value: "85M", label: "jobs displaced by AI by 2030" },
];

const FEATURES = [
  { icon: Brain, title: "AI Career Matching", desc: "Skills, interests, and personality analyzed to find careers that truly fit.", color: "rgba(168,85,247,0.15)" },
  { icon: Shield, title: "Disruption Shield", desc: "Every career scored for automation risk before you commit.", color: "rgba(16,185,129,0.15)" },
  { icon: TrendingUp, title: "Live Market Data", desc: "Real-time salary data, growth trends, and demand signals.", color: "rgba(245,158,11,0.15)" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Voice-powered practice with STAR analysis and scoring.", color: "rgba(244,63,94,0.15)" },
  { icon: FileText, title: "Resume Builder", desc: "ATS-optimized bullet points and keyword targeting.", color: "rgba(6,182,212,0.15)" },
  { icon: MessageSquare, title: "Career Simulator", desc: "500+ Monte Carlo trajectories for salary and stability.", color: "rgba(139,92,246,0.15)" },
];

const STEPS = [
  { step: "1", title: "5-Min Assessment", desc: "Skills, interests, personality, values" },
  { step: "2", title: "AI Analysis", desc: "12+ dimensions processed instantly" },
  { step: "3", title: "Career Paths", desc: "Ranked by fit, salary, safety" },
  { step: "4", title: "Build & Practice", desc: "Resume, interviews, job matching" },
];

const TECH = [
  { name: "Llama 3.3 70B", desc: "AI Engine" },
  { name: "Next.js 16", desc: "Framework" },
  { name: "PostgreSQL", desc: "Database" },
  { name: "Adzuna API", desc: "Job Market" },
  { name: "Tailwind CSS", desc: "Design" },
  { name: "Framer Motion", desc: "Animation" },
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 border-b border-white/5"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg">Compass</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero — 3-second clarity */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
                <Sparkles className="w-3 h-3" />
                AI Career Navigator
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1]">
                Your career deserves
                <br />
                <span className="gradient-text">better than guesswork</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                5-minute assessment. AI-matched career paths. Resume builder. Mock interviews.
                <strong className="text-white"> All in one place.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm group">
                  Find Your Path
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
                  See How It Works
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> 100% Free</div>
                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> No credit card</div>
                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Real job data</div>
              </div>
            </motion.div>

            {/* Right: Product Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-indigo-500/10">
                {/* Mock dashboard */}
                <div className="p-4 border-b border-white/5" style={{ background: "rgba(17,17,24,0.8)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-slate-500">compass.app/dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                      <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-xs font-medium">Compass</span>
                  </div>
                </div>
                <div className="p-4 space-y-3" style={{ background: "rgba(10,10,15,0.95)" }}>
                  <div className="text-xs text-slate-500 mb-2">Dashboard</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: LayoutDashboard, label: "Career Score", value: "92/100", color: "text-indigo-400" },
                      { icon: Target, label: "Skill Match", value: "87%", color: "text-emerald-400" },
                      { icon: BarChart3, label: "Market Fit", value: "Top 15%", color: "text-amber-400" },
                    ].map((m, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                        <m.icon className={`w-3.5 h-3.5 ${m.color} mb-1.5`} />
                        <div className="text-[10px] text-slate-500 mb-0.5">{m.label}</div>
                        <div className="text-sm font-bold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] text-slate-500">Pipeline</span>
                    </div>
                    <div className="flex gap-1.5">
                      {["Wishlist", "Applied", "Interview", "Offer"].map((s, i) => (
                        <div key={i} className="flex-1 text-center py-1 rounded text-[9px] bg-white/5 text-slate-400">{s}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["AI Co-pilot", "Mock Interview", "Resume Builder"].map((f, i) => (
                      <div key={i} className="flex-1 p-2 rounded-lg border border-white/5 bg-white/[0.02] text-center">
                        <div className="text-[9px] text-slate-400">{f}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -inset-10 opacity-20 -z-10" style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.3), transparent 70%)" }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-slate-500 mb-6 uppercase tracking-widest">The problem we solve</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">From assessment to career plan<br />in under 5 minutes</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="glass glass-hover p-5 h-full">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3 group-hover:bg-indigo-500/30 transition-colors">
                    <span className="text-sm font-bold text-indigo-400">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-slate-600">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Six AI-powered tools<br />that eliminate career uncertainty</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`glass p-6 transition-all duration-300 cursor-default group ${
                  activeFeature === i ? "border-indigo-500/20" : ""
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                  style={{ background: f.color }}
                >
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-slate-500 mb-6 uppercase tracking-widest">Built with</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {TECH.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-xs font-semibold text-white mb-0.5">{t.name}</div>
                <div className="text-[10px] text-slate-500">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-14 glow relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-30" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Stop guessing.<br />Start navigating.</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Take a 5-minute assessment. Get AI-matched career paths ranked by compatibility, salary potential, and automation safety.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm group">
                  Start for Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
                  I have an account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Compass — AI Career Operating System</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Built for the future of work</span>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400">Powered by Llama 3.3 70B</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
