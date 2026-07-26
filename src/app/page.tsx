"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, ArrowRight, Shield, Brain, TrendingUp, Users, Zap, ChevronRight, Play, Check, Globe, BarChart3, MessageSquare, FileText, Star, Sparkles, Mic } from "lucide-react";

const STATS = [
  { value: "30-50%", label: "of students change their major", icon: Users },
  { value: "$1.7T", label: "in student loan debt globally", icon: BarChart3 },
  { value: "60%", label: "of graduates work outside their field", icon: Globe },
  { value: "85M", label: "jobs displaced by AI by 2030", icon: Zap },
];

const FEATURES = [
  { icon: Brain, title: "AI Career Matching", desc: "Gemini 2.0 Flash analyzes your skills, interests, and personality to find careers that truly fit — not just what sounds good.", color: "from-purple-500 to-indigo-500" },
  { icon: Shield, title: "AI Disruption Shield", desc: "Every career scored for automation risk. Know which paths are safe and which are transforming before you commit.", color: "from-emerald-500 to-teal-500" },
  { icon: TrendingUp, title: "Live Market Intelligence", desc: "Real-time salary data, growth trends, and demand signals pulled from Adzuna. No more guessing what the job market wants.", color: "from-amber-500 to-orange-500" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Voice-powered mock interviews with real-time AI evaluation. STAR analysis, follow-up questions, and scoring — like a real interview coach.", color: "from-rose-500 to-pink-500" },
  { icon: FileText, title: "AI Resume Builder", desc: "Paste your experience, get ATS-optimized bullet points, professional summaries, and keyword targeting — all powered by AI.", color: "from-cyan-500 to-blue-500" },
  { icon: MessageSquare, title: "Career Simulator", desc: "Monte Carlo simulation of 500+ career trajectories. See probability-weighted outcomes for salary, satisfaction, and stability.", color: "from-violet-500 to-purple-500" },
];

const DEMO_STEPS = [
  { step: "1", title: "Take the Assessment", desc: "5-minute quiz on your skills, interests, personality, and values", icon: Brain },
  { step: "2", title: "AI Analyzes Your Profile", desc: "Gemini 2.0 Flash processes 12+ dimensions of your career identity", icon: Sparkles },
  { step: "3", title: "Get Personalized Paths", desc: "5 career matches ranked by compatibility, salary, and automation safety", icon: TrendingUp },
  { step: "4", title: "Build & Practice", desc: "AI resume builder, mock interviews, and job matching — all in one place", icon: Check },
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
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
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
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-10" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.3), transparent 70%)" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Sparkles className="w-3 h-3" />
            Powered by Google Gemini 2.0 Flash
          </div>

          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Your career deserves
            <br />
            <span className="gradient-text">better than guesswork</span>
          </h1>

          <p className={`text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            30-50% of students change their major. $1.7 trillion in student debt.
            AI is reshaping every industry.
            <br />
            <strong className="text-white">Compass uses AI to find careers that match who you are — and survive what&apos;s coming.</strong>
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold text-base transition-all glow-sm group">
              Find Your Path
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </div>

          {/* Trust badges */}
          <div className={`flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-500 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> 100% Free</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> No credit card required</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> AI-powered analysis</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Real job market data</div>
          </div>
        </div>
      </section>

      {/* Stats — The Problem */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest">The problem we solve</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Step by Step */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">From assessment to career plan<br />in under 5 minutes</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No more guessing. No more generic advice. Just AI that actually understands you.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {DEMO_STEPS.map((s, i) => (
              <div key={i} className="relative group">
                <div className="glass glass-hover p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                    <span className="text-lg font-bold text-indigo-400">{s.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
                {i < DEMO_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — with rotating highlight */}
      <section id="features" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-indigo-400 mb-2 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Six AI-powered tools<br />that eliminate career uncertainty</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every feature is built to answer one question: what should I do with my life?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i}
                className={`glass p-8 transition-all duration-500 cursor-default group ${
                  activeFeature === i ? "glass-hover border-indigo-500/20 scale-[1.02]" : "hover:glass-hover"
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} bg-opacity-10 flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
                  style={{ background: `linear-gradient(135deg, ${f.color.includes('purple') ? 'rgba(168,85,247,0.15)' : f.color.includes('emerald') ? 'rgba(16,185,129,0.15)' : f.color.includes('amber') ? 'rgba(245,158,11,0.15)' : f.color.includes('rose') ? 'rgba(244,63,94,0.15)' : f.color.includes('cyan') ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.15)'}, transparent)` }}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest">Built with</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {TECH.map((t, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-sm font-semibold text-white mb-0.5">{t.name}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 md:p-16 glow relative overflow-hidden">
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
          </div>
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
