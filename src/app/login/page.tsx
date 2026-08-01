"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass, Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck,
  Target, FileText, BrainCircuit, TrendingUp, Zap
} from "lucide-react";

const FEATURES = [
  { icon: Target, title: "AI career matching", desc: "40+ career paths scored against your real profile" },
  { icon: BrainCircuit, title: "Interview readiness", desc: "Mock rounds with live AI feedback" },
  { icon: FileText, title: "Resume & outreach", desc: "ATS-scored resumes and professional email drafts" },
];

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

  const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600";

  return (
    <div className="min-h-screen flex bg-[#0a0a12] text-slate-200">
      {/* ── Brand panel ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[46%] flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-indigo-600/[0.14] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-purple-600/[0.10] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">Compass</div>
            <div className="text-[10px] text-slate-500 tracking-wide">Career Intelligence</div>
          </div>
        </div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-[11px] font-medium text-indigo-300 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> AI-Powered Career Platform
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-bold tracking-tight text-white leading-[1.15] mb-4">
            From assessment to<br />offer letter.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-slate-400 text-sm leading-relaxed mb-10 max-w-md">
            One platform for Tamil Nadu&apos;s students to discover their career, build the skills employers demand, and land real opportunities.
          </motion.p>

          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <f.icon className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{f.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Enterprise-grade security · Your data stays private
        </div>
      </aside>

      {/* ── Sign-in panel ───────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-indigo-600/[0.07] blur-3xl" />
        </div>

        <div className="relative w-full max-w-[380px]">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Compass className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-white">Compass</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-8">Sign in to continue your career journey</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  type="email" placeholder="you@example.com" required autoFocus className={inputCls} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}>
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
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                {error}
              </motion.p>
            )}

            <motion.button type="submit" disabled={loading || !form.email || !form.password}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <button onClick={fillDemo}
            className="w-full py-2.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-xs text-slate-300 transition-colors flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Use demo account
          </button>

          <p className="text-sm text-slate-500 text-center mt-7">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>

          <Link href="/" className="block text-center mt-5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ← Back to Home
          </Link>

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[10px] text-slate-600">
            <TrendingUp className="w-3 h-3 text-indigo-500" /> Compass AI · Career Intelligence
          </div>
        </div>
      </main>
    </div>
  );
}
