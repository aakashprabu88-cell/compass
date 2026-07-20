"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, ArrowRight, Shield, Brain, TrendingUp, Users, Zap, ChevronRight } from "lucide-react";

const STATS = [
  { value: "30-50%", label: "of students change their major" },
  { value: "$1.7T", label: "in student loan debt" },
  { value: "60%", label: "of graduates work outside their field" },
  { value: "85M", label: "jobs displaced by AI by 2030" },
];

const FEATURES = [
  { icon: Brain, title: "AI Career Matching", desc: "Multi-dimensional assessment matches your unique skills, interests, and personality to career paths with proven compatibility." },
  { icon: Shield, title: "AI Disruption Shield", desc: "Every career scored for automation risk. Know which paths are safe and which are transforming before you commit." },
  { icon: TrendingUp, title: "Live Market Intelligence", desc: "Real-time salary data, growth trends, and demand signals. No more guessing what the job market wants." },
  { icon: Zap, title: "Skill Gap Analysis", desc: "AI identifies exactly which skills you're missing for your target career and builds a personalized learning roadmap." },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)" }}>
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
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your career deserves<br />
            <span className="gradient-text">better than guesswork</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            30-50% of students change their major. $1.7 trillion in student debt. 
            AI is reshaping every industry. <strong className="text-white">Compass uses AI to help you find careers 
            that match who you are — and survive what&apos;s coming.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold text-base transition-all glow-sm">
              Find Your Path
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Compass works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Four AI-powered tools that eliminate career uncertainty</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass glass-hover p-8 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass p-12 glow relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-30" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop guessing.<br />Start navigating.</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Take a 5-minute assessment. Get AI-matched career paths ranked by compatibility, salary potential, and automation safety.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm">
                Start for Free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Compass</span>
          </div>
          <span>Built for the future of work</span>
        </div>
      </footer>
    </div>
  );
}
