"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

const HEADLINE = ["Your", "career,", "plotted."];

function OrbitMark() {
  return (
    <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[42rem] h-[42rem] opacity-[0.22] pointer-events-none" aria-hidden>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <motion.g initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#orbGrad)" strokeWidth="1" strokeDasharray="4 10" opacity="0.6" />
        </motion.g>
        <motion.g initial={{ rotate: 360 }} animate={{ rotate: 0 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1" strokeDasharray="40 14 4 14" />
        </motion.g>
        <motion.g initial={{ rotate: 0 }} animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(52,211,153,0.45)" strokeWidth="1" />
          <circle cx="200" cy="130" r="3.5" fill="#818cf8" />
        </motion.g>
        <circle cx="200" cy="200" r="8" fill="url(#orbGrad)" />
        <circle cx="200" cy="200" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); return; }
      router.push(data.user?.onboarded ? "/dashboard" : "/assessment");
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const fillDemo = () => {
    setForm({ email: "demo@compass.app", password: "demo123456" });
    setError("");
  };

  const inputCls = "w-full pl-11 pr-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#07070f] text-slate-200 overflow-hidden">
      {/* ambient background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-56 -left-40 w-[46rem] h-[46rem] rounded-full bg-indigo-600/[0.10] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] rounded-full bg-purple-600/[0.07] blur-3xl" />
      </div>

      {/* ── Hero / statement ───────────────────────────── */}
      <section className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[52vh] lg:min-h-screen overflow-hidden">
        <OrbitMark />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <CompassIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Compass</span>
          </div>
          <span className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 border border-white/[0.08] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI Career Intelligence
          </span>
        </div>

        <div className="relative max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-indigo-300/90 mb-6">
            From assessment to offer letter
          </motion.p>

          <h1 className="font-extrabold tracking-tight leading-[0.95] text-[13vw] sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white">
            {HEADLINE.map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${i === 2 ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent" : ""}`}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px bg-gradient-to-r from-indigo-500/60 via-purple-500/40 to-transparent w-72" />

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="mt-7 text-sm sm:text-base text-slate-400 max-w-md leading-relaxed">
            Discover the right path, build the skills employers demand, and land real opportunities across Tamil Nadu — all in one place.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">40+</span> career paths</span>
            <span className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">AI</span> interview coach</span>
            <span className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">Live</span> TN jobs</span>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="relative hidden lg:flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise-grade security · Your data stays private
        </motion.p>
      </section>

      {/* ── Sign-in panel ──────────────────────────────── */}
      <section className="relative w-full lg:w-[460px] xl:w-[500px] border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-white/[0.015] flex flex-col p-8 sm:p-12 lg:p-14">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <p className="text-[11px] tracking-[0.25em] uppercase text-slate-600 mb-2">Sign in</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1.5">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-8">Enter your credentials to continue</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  type="email" placeholder="you@example.com" required autoFocus className={inputCls} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <button type="button" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  type={show ? "text" : "password"} placeholder="Enter your password" required className={`${inputCls} pr-11`} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
            )}

            <motion.button type="submit" disabled={loading || !form.email || !form.password}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="group w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </motion.div>

          <motion.button onClick={fillDemo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            className="group w-full py-3 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-xs text-slate-300 transition-colors flex items-center justify-center gap-2">
            Use demo account
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="max-w-sm mx-auto w-full">
          <p className="text-sm text-slate-500 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one</Link>
          </p>
          <Link href="/" className="block text-center mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
    </svg>
  );
}
