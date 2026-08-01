"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence
} from "framer-motion";
import {
  Compass, Loader2, Eye, EyeOff, LogIn, ArrowRight, Mail, Lock, Zap, Sparkles,
  Target, TrendingUp, BrainCircuit, Fingerprint, Orbit, ShieldCheck
} from "lucide-react";

const WORDS = ["your dream job", "the right career path", "interview confidence", "real hiring companies", "a standout resume"];

function useTypewriter(phrases: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = phrases[index % phrases.length];
    const speed = deleting ? 40 : 75;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, text.length + 1);
        setText(next);
        if (next === full) setTimeout(() => setDeleting(true), 1600);
      } else {
        const next = full.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex(i => i + 1);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases]);

  return text;
}

function ParticleField() {
  const particles = useMemo(() => Array.from({ length: 36 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 6,
    drift: Math.random() * 40 - 20,
    color: ["99,102,241", "168,85,247", "16,185,129"][i % 3],
  })), []);

  return (
    <div className="absolute inset-0" aria-hidden>
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0], x: [0, p.drift, 0], y: [0, -30, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
            background: `rgba(${p.color},0.7)`, boxShadow: `0 0 ${p.size * 4}px rgba(${p.color},0.5)`,
          }}
        />
      ))}
    </div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 20 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["20%", "80%"]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.10), transparent 60%)`;

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      className="relative w-full max-w-md"
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl z-20"
        style={{ background: glare }}
      />
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const typewriter = useTypewriter(WORDS);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), { stiffness: 60, damping: 20 });
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 60, damping: 20 });

  const onBgMove = (e: React.MouseEvent) => {
    const w = window.innerWidth, h = window.innerHeight;
    mx.set(e.clientX / w - 0.5);
    my.set(e.clientY / h - 0.5);
  };

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

  const features = [
    { icon: Target, text: "AI career matching", color: "text-indigo-400" },
    { icon: Sparkles, text: "Resume & email builder", color: "text-emerald-400" },
    { icon: TrendingUp, text: "Interview readiness", color: "text-amber-400" },
  ];

  return (
    <div onMouseMove={onBgMove} className="min-h-screen relative overflow-hidden bg-[#07070f] flex items-center justify-center p-4">
      {/* ── Animated background (mouse parallax) ─────────────── */}
      <div className="absolute inset-0" aria-hidden>
        <motion.div className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)", backgroundSize: "44px 44px" }} />

        <motion.div style={{ x: bgX, y: bgY }}
          animate={{ rotate: [0, 12, -8, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[34rem] h-[34rem] rounded-full blur-3xl"
        >
          <motion.div
            animate={{ scale: [1, 1.18, 0.96, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)" }}
          />
        </motion.div>

        <motion.div style={{ x: useTransform(() => -bgX.get()), y: useTransform(() => -bgY.get()) }}
          animate={{ rotate: [0, -14, 10, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-48 w-[36rem] h-[36rem] rounded-full blur-3xl"
        >
          <motion.div
            animate={{ scale: [1, 0.88, 1.12, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.32), transparent 65%)" }}
          />
        </motion.div>

        <motion.div style={{ x: bgX, y: useTransform(() => bgY.get()) }}
          className="absolute -bottom-48 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl"
        >
          <motion.div
            animate={{ x: [0, 40, -50, 0], y: [0, -30, 40, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2), transparent 65%)" }}
          />
        </motion.div>

        {/* Scanline shimmer */}
        <motion.div
          animate={{ opacity: [0, 0.06, 0], top: ["0%", "100%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent blur-2xl"
        />

        <ParticleField />

        {/* Floating career chips */}
        {([
          { top: "18%", left: "8%", delay: 0, text: "97% path match", icon: Zap, color: "text-amber-400", rotate: -6 },
          { top: "72%", left: "6%", delay: 1.2, text: "Cover letter ready", icon: Sparkles, color: "text-emerald-400", rotate: 5 },
          { top: "14%", right: "7%", delay: 0.6, text: "AI interview coach", icon: BrainCircuit, color: "text-purple-400", rotate: 4 },
          { top: "80%", right: "6%", delay: 1.8, text: "200+ live internships", icon: TrendingUp, color: "text-indigo-400", rotate: -4 },
        ] as { top: string; left?: string; right?: string; delay: number; text: string; icon: typeof Zap; color: string; rotate: number }[]).map((chip, i) => (
          <motion.div key={i} animate={{ y: [0, -16, 0], rotate: [chip.rotate, chip.rotate + 4, chip.rotate] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: chip.delay }}
            className="hidden lg:flex absolute px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-slate-300 items-center gap-2 shadow-lg shadow-black/40"
            style={{ top: chip.top, left: chip.left, right: chip.right }}
          >
            <chip.icon className={`w-3.5 h-3.5 ${chip.color}`} />{chip.text}
          </motion.div>
        ))}
      </div>

      {/* ── Card ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200 }}
      >
        <TiltCard>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-px rounded-3xl opacity-70"
            style={{ background: "conic-gradient(from 0deg, rgba(99,102,241,0.6), rgba(168,85,247,0.15), rgba(16,185,129,0.45), rgba(251,191,36,0.2), rgba(99,102,241,0.6))", filter: "blur(2px)" }}
          />
          <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden"
            style={{ background: "rgba(12,12,20,0.9)", backdropFilter: "blur(28px)" }}>
            {/* Inner glow */}
            <motion.div animate={{ opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" }} />

            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Logo with orbit rings */}
              <div className="flex items-center justify-center mb-6" style={{ transform: "translateZ(40px)" }}>
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-2xl"
                    style={{ background: "conic-gradient(from 0deg, rgba(99,102,241,0.8), rgba(168,85,247,0.1), rgba(16,185,129,0.5), rgba(99,102,241,0.8))" }}
                  />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full opacity-50"
                    style={{ background: "repeating-conic-gradient(rgba(255,255,255,0.12) 0deg 8deg, transparent 8deg 20deg)" }} />
                  <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <Compass className="w-7 h-7 text-white" />
                  </motion.div>
                </div>
              </div>

              <h1 className="text-center text-3xl font-extrabold mb-1.5" style={{ transform: "translateZ(30px)" }}>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Welcome back
                </span>
              </h1>

              {/* Typewriter headline */}
              <p className="text-center text-sm text-slate-400 mb-1 min-h-5">
                Compass to{" "}
                <span className="text-indigo-300 font-medium">{typewriter}</span>
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-indigo-400">|</motion.span>
              </p>
              <p className="text-center text-xs text-slate-500 mb-7">Sign in to continue your career journey</p>

              {/* Feature chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-7" style={{ transform: "translateZ(20px)" }}>
                {features.map((f, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                    <f.icon className={`w-3 h-3 ${f.color}`} /> {f.text}
                  </motion.span>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                      value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      type="email" placeholder="you@example.com" required autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-600" />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                      value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      type={show ? "text" : "password"} placeholder="Enter your password" required
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-600" />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={show ? "off" : "on"} initial={{ opacity: 0, rotate: -60, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 60, scale: 0.7 }} transition={{ duration: 0.15 }}
                          className="block">
                          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                    {error}
                  </motion.p>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ transform: "translateZ(24px)" }}>
                  <motion.button type="submit" disabled={loading || !form.email || !form.password}
                    whileHover={!loading && form.email && form.password ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!loading && form.email && form.password ? { scale: 0.98 } : {}}
                    className="group relative w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 text-white overflow-hidden">
                    <motion.span
                      animate={{ x: ["-150%", "150%"] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-slate-600 uppercase tracking-wider flex items-center gap-1"><Fingerprint className="w-3 h-3" /> or</span>
                <div className="flex-1 h-px bg-white/10" />
              </motion.div>

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} onClick={fillDemo}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="mt-5 w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick-fill demo account
              </motion.button>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Create one <ArrowRight className="w-3 h-3 inline -mt-0.5" />
                  </Link>
                </p>
                <Link href="/" className="mt-4 inline-block text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  ← Back to Home
                </Link>
              </motion.div>

              {/* AI security note */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
                <Orbit className="w-3 h-3 text-indigo-500" /> Protected by Compass AI
                <ShieldCheck className="w-3 h-3 text-emerald-500 ml-1" />
              </motion.div>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}
