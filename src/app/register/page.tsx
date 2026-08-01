"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Loader2, Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck, BrainCircuit, Zap, FileText, TrendingUp, UserPlus } from "lucide-react";

const CHIPS = [
  { text: "AI career matching", icon: Zap, color: "text-amber-400", x: "72%", y: "18%", z: 70, delay: 0.4 },
  { text: "Skill discovery", icon: BrainCircuit, color: "text-purple-400", x: "56%", y: "68%", z: 90, delay: 0.8 },
  { text: "Interview readiness", icon: TrendingUp, color: "text-emerald-400", x: "84%", y: "52%", z: 110, delay: 1.2 },
  { text: "Resume builder", icon: FileText, color: "text-indigo-400", x: "40%", y: "30%", z: 60, delay: 1.6 },
];

function OrbitRing({ size, duration, border, dotColor, tilt, dotDelay = 0 }: { size: number; duration: number; border: string; dotColor: string; tilt: string; dotDelay?: number }) {
  return (
    <motion.div className="absolute inset-0" style={{ transform: tilt, transformStyle: "preserve-3d" }}
      animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      <div className="absolute rounded-full" style={{ inset: (500 - size) / 2, border }} />
      <div className="absolute w-2.5 h-2.5 rounded-full" style={{ left: "50%", top: (500 - size) / 2, transform: "translate(-50%,-50%)", background: dotColor, boxShadow: `0 0 16px ${dotColor}` }} />
      <motion.div className="absolute rounded-full" style={{ left: "50%", top: (500 - size) / 2 + size - 12, transform: "translate(-50%,-50%)" }}
        animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: 3, repeat: Infinity, delay: dotDelay }} />
    </motion.div>
  );
}

function Orrery() {
  return (
    <div className="absolute right-[-14%] top-1/2 -translate-y-1/2 w-[34rem] h-[34rem] xl:w-[40rem] xl:h-[40rem] pointer-events-none" style={{ perspective: 1100 }} aria-hidden>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(16deg)" }}>
        <OrbitRing size={500} duration={28} tilt="rotateX(70deg)" border="1px dashed rgba(129,140,248,0.35)" dotColor="#818cf8" dotDelay={0.5} />
        <OrbitRing size={380} duration={38} tilt="rotateY(72deg)" border="1px solid rgba(52,211,153,0.28)" dotColor="#34d399" dotDelay={1.4} />
        <OrbitRing size={270} duration={22} tilt="rotateX(-64deg)" border="1px solid rgba(232,121,249,0.3)" dotColor="#e879f9" dotDelay={2.1} />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center"
            style={{ boxShadow: "0 0 60px rgba(129,140,248,0.6)" }}>
            <CompassIcon className="w-9 h-9 text-white" />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-indigo-400/40" style={{ inset: "-14px" }} />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 70, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 70, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const w = window.innerWidth, h = window.innerHeight;
    mx.set(e.clientX / w - 0.5);
    my.set(e.clientY / h - 0.5);
  };

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
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600";

  return (
    <div onMouseMove={onMove} className="min-h-screen flex flex-col lg:flex-row bg-[#07070f] text-slate-200 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-56 -left-40 w-[46rem] h-[46rem] rounded-full bg-indigo-600/[0.10] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] rounded-full bg-purple-600/[0.07] blur-3xl" />
      </div>

      {/* ── 3D hero ─────────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[54vh] lg:min-h-screen overflow-hidden" style={{ perspective: 1200 }}>
        <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0" style={{ transform: "translateZ(-80px)" }}>
            <Orrery />
          </div>

          {CHIPS.map((chip, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.15 }}
              className="absolute hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-xs text-slate-300 shadow-xl shadow-black/40"
              style={{ left: chip.x, top: chip.y, transform: `translateZ(${chip.z}px)` }}>
              <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i }}>
                <chip.icon className={`w-3.5 h-3.5 ${chip.color}`} />
              </motion.span>
              {chip.text}
            </motion.div>
          ))}
        </motion.div>

        <div className="relative flex items-center justify-between" style={{ transform: "translateZ(50px)" }}>
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

        <div className="relative max-w-3xl" style={{ transformStyle: "preserve-3d" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-indigo-300/90 mb-6" style={{ transform: "translateZ(70px)" }}>
            Free forever · 2-minute setup
          </motion.p>

          <h1 className="font-extrabold tracking-tight leading-[1.04] text-[13vw] sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white drop-shadow-[0_8px_24px_rgba(99,102,241,0.28)]" style={{ transformStyle: "preserve-3d" }}>
            {["Your", "future,", "mapped."].map((word, i) => (
              <span key={i} className="block overflow-hidden pt-[0.06em] pb-[0.1em] -mt-[0.06em] -mb-[0.1em]" style={{ transform: `translateZ(${40 + i * 30}px)` }}>
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
            className="mt-8 h-px bg-gradient-to-r from-indigo-500/60 via-purple-500/40 to-transparent w-72" style={{ transform: "translateZ(60px)" }} />

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="mt-7 text-sm sm:text-base text-slate-400 max-w-md leading-relaxed" style={{ transform: "translateZ(45px)" }}>
            Create a free account to unlock your personalised career OS — assessments, skills, interviews and real opportunities across Tamil Nadu.
          </motion.p>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="relative hidden lg:flex items-center gap-2 text-[11px] text-slate-600" style={{ transform: "translateZ(40px)" }}>
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise-grade security · Your data stays private
        </motion.p>
      </section>

      {/* ── Sign-up panel ───────────────────────────────── */}
      <section className="relative w-full lg:w-[460px] xl:w-[500px] border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-white/[0.015] flex flex-col p-8 sm:p-12 lg:p-14">
        <motion.div initial={{ opacity: 0, rotateY: 10 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 900 }} className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <p className="text-[11px] tracking-[0.25em] uppercase text-slate-600 mb-2">Sign up</p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-1.5">Create your account</h2>
          <p className="text-sm text-slate-500 mb-8">Start your career journey in under 2 minutes</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name" required autoFocus className={inputCls} style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  type="email" placeholder="you@example.com" required className={inputCls} style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  type={show ? "text" : "password"} placeholder="At least 6 characters" required minLength={6} className={inputCls} style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</p>
            )}

            <button type="submit" disabled={loading || !form.name || !form.email || !form.password}
              className="group w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">already have an account</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <p className="text-sm text-slate-500 text-center">
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in instead</Link>
          </p>
        </motion.div>

        <div className="max-w-sm mx-auto w-full">
          <Link href="/" className="block text-center mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
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
