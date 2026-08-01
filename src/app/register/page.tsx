"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Loader2, Eye, EyeOff, UserPlus, ArrowRight, Mail, Lock, User, Sparkles, Target, TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/assessment");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const features = [
    { icon: Target, text: "Skill discovery", color: "text-indigo-400" },
    { icon: Sparkles, text: "AI career matching", color: "text-emerald-400" },
    { icon: TrendingUp, text: "Interview readiness", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a12] flex items-center justify-center p-4">
      {/* ── Animated background ─────────────────────────────── */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)", backgroundSize: "44px 44px" }} />
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[34rem] h-[34rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 65%)" }} />
        <motion.div
          animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-48 w-[36rem] h-[36rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 65%)" }} />
        <motion.div
          animate={{ x: [0, 40, -50, 0], y: [0, -30, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 65%)" }} />
      </div>

      {/* ── Card ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl p-[1px]"
        style={{ background: "linear-gradient(160deg, rgba(168,85,247,0.5), rgba(99,102,241,0.25) 40%, rgba(255,255,255,0.08) 60%, rgba(168,85,247,0.4))" }}
      >
        <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden"
          style={{ background: "rgba(13,13,20,0.88)", backdropFilter: "blur(24px)" }}>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5), transparent 70%)" }} />

          <div className="relative">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-2xl"
                  style={{ background: "conic-gradient(from 0deg, rgba(168,85,247,0.7), rgba(99,102,241,0.1), rgba(16,185,129,0.5), rgba(168,85,247,0.7))" }}
                />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Compass className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-center text-3xl font-extrabold mb-1.5">
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Create your account
              </span>
            </h1>
            <p className="text-center text-sm text-slate-400 mb-7">
              Start your career journey in under 2 minutes
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {features.map((f, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                  <f.icon className={`w-3 h-3 ${f.color}`} /> {f.text}
                </motion.span>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name" required autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-purple-500/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all placeholder:text-slate-600" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    type="email" placeholder="you@example.com" required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-purple-500/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all placeholder:text-slate-600" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    type={show ? "text" : "password"} placeholder="At least 6 characters" required minLength={6}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-purple-500/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all placeholder:text-slate-600" />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                  {error}
                </motion.p>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }}>
                <button type="submit" disabled={loading || !form.name || !form.email || !form.password}
                  className="group w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 text-white">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
                </button>
              </motion.div>
            </form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign In <ArrowRight className="w-3 h-3 inline -mt-0.5" />
                </Link>
              </p>
              <Link href="/" className="mt-4 inline-block text-xs text-slate-600 hover:text-slate-400 transition-colors">
                ← Back to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
