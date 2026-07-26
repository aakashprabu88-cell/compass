"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, Shield, Brain, TrendingUp, Users, Zap, ChevronRight, Play, Check, Globe, BarChart3, MessageSquare, FileText, Star, Sparkles, Mic } from "lucide-react";

const STATS = [
  { value: "30-50%", label: "of students change their major", icon: Users },
  { value: "$1.7T", label: "in student loan debt globally", icon: BarChart3 },
  { value: "60%", label: "of graduates work outside their field", icon: Globe },
  { value: "85M", label: "jobs displaced by AI by 2030", icon: Zap },
];

const FEATURES = [
  { icon: Brain, title: "AI Career Matching", desc: "Gemini 2.0 Flash analyzes your skills, interests, and personality to find careers that truly fit — not just what sounds good.", color: "rgba(168,85,247,0.15)" },
  { icon: Shield, title: "AI Disruption Shield", desc: "Every career scored for automation risk. Know which paths are safe and which are transforming before you commit.", color: "rgba(16,185,129,0.15)" },
  { icon: TrendingUp, title: "Live Market Intelligence", desc: "Real-time salary data, growth trends, and demand signals pulled from Adzuna. No more guessing what the job market wants.", color: "rgba(245,158,11,0.15)" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Voice-powered mock interviews with real-time AI evaluation. STAR analysis, follow-up questions, and scoring.", color: "rgba(244,63,94,0.15)" },
  { icon: FileText, title: "AI Resume Builder", desc: "Paste your experience, get ATS-optimized bullet points, professional summaries, and keyword targeting.", color: "rgba(6,182,212,0.15)" },
  { icon: MessageSquare, title: "Career Simulator", desc: "Monte Carlo simulation of 500+ career trajectories. See probability-weighted outcomes for salary, satisfaction, and stability.", color: "rgba(139,92,246,0.15)" },
];

const DEMO_STEPS = [
  { step: "1", title: "Take the Assessment", desc: "5-minute quiz on your skills, interests, personality, and values" },
  { step: "2", title: "AI Analyzes Your Profile", desc: "Gemini 2.0 Flash processes 12+ dimensions of your career identity" },
  { step: "3", title: "Get Personalized Paths", desc: "5 career matches ranked by compatibility, salary, and automation safety" },
  { step: "4", title: "Build & Practice", desc: "AI resume builder, mock interviews, and job matching — all in one place" },
];

const TECH = [
  { name: "Google Gemini 2.0 Flash", desc: "AI Engine" },
  { name: "Next.js 16", desc: "Framework" },
  { name: "PostgreSQL", desc: "Database" },
  { name: "Adzuna API", desc: "Job Market Data" },
  { name: "Clearbit", desc: "Company Logos" },
  { name: "Tailwind CSS", desc: "Design System" },
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-10" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.3), transparent 70%)" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-8"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Google Gemini 2.0 Flash
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]"
          >
            Your career deserves
            <br />
            <span className="gradient-text">better than guesswork</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            30-50% of students change their major. $1.7 trillion in student debt.
            AI is reshaping every industry.
            <br />
            <strong className="text-white">Compass uses AI to find careers that match who you are — and survive what&apos;s coming.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold text-base transition-all glow-sm group">
              Find Your Path
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-500"
          >
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> 100% Free</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> No credit card required</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> AI-powered analysis</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Real job market data</div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest">The problem we solve</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">From assessment to career plan<br />in under 5 minutes</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No more guessing. No more generic advice. Just AI that actually understands you.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {DEMO_STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                <div className="glass glass-hover p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                    <span className="text-lg font-bold text-indigo-400">{s.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Six AI-powered tools<br />that eliminate career uncertainty</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every feature is built to answer one question: what should I do with my life?</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`glass p-8 transition-all duration-300 cursor-default group ${
                    activeFeature === i ? "border-indigo-500/20" : ""
                  }`}
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                    style={{ background: f.color }}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest">Built with</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {TECH.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-sm font-semibold text-white mb-0.5">{t.name}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass p-12 md:p-16 glow relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-30" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
                <Star className="w-3 h-3" />
                Free for all students
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Stop guessing.<br />Start navigating.</h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg">
                Take a 5-minute assessment. Get AI-matched career paths ranked by compatibility, salary potential, and automation safety.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold text-lg transition-all glow-sm group">
                  Start for Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
                  I have an account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Compass — AI Career Operating System</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Built for the future of work</span>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400">Powered by Gemini 2.0 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
