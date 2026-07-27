"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Check, Brain, Mic, FileText, Layers, TrendingUp, Shield, UsersRound } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "AI Career Matching", desc: "5-minute assessment. AI finds careers that match your skills, interests, and personality.", color: "rgba(99,102,241,0.15)" },
  { icon: UsersRound, title: "Panel Interview", desc: "3 AI interviewers — HR, Technical, Behavioral — conduct a real panel interview.", color: "rgba(168,85,247,0.15)" },
  { icon: Layers, title: "Digital Twin", desc: "See your skills as a living constellation. Market demand, salary impact, gaps.", color: "rgba(6,182,212,0.15)" },
  { icon: FileText, title: "Resume Builder", desc: "AI-generated bullet points, ATS optimization, and one-click job tailoring.", color: "rgba(16,185,129,0.15)" },
  { icon: TrendingUp, title: "Job Matching", desc: "Real-time job data matched to your profile with compatibility scores.", color: "rgba(245,158,11,0.15)" },
  { icon: Shield, title: "Disruption Shield", desc: "Every career scored for AI automation risk before you commit.", color: "rgba(244,63,94,0.15)" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg">Compass</span>
          </div>
          <Link href="/dashboard" className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
            AI Career Navigator
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
            Your career deserves<br />
            <span className="gradient-text">better than guesswork</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            AI-powered career platform. Assessment, matching, interviews, resume — all in one place.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm group">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-5 mt-8 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Free forever</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> No credit card</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> AI-powered</div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need<br />to navigate your career</h2>
            <p className="text-slate-400 max-w-lg mx-auto">From assessment to offer letter. One platform.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }} className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color }}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-10 rounded-2xl border border-indigo-500/20 relative overflow-hidden" style={{ background: "rgba(99,102,241,0.05)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-20" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-3">Start navigating.</h2>
              <p className="text-slate-400 mb-6">5-minute assessment. AI-matched career paths. Real job data.</p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm">
                Open Compass <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2"><Compass className="w-3.5 h-3.5" /> Compass</div>
          <div>AI Career Operating System</div>
        </div>
      </footer>
    </div>
  );
}
