"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Loader2, Eye, EyeOff, LogIn, Sparkles, ArrowRight, GraduationCap, Briefcase, Code2 } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0a0a12]">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-white">Welcome to Compass</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Your AI-powered career companion. Discover paths, prepare for interviews, and land your dream job.
          </p>
          <div className="space-y-4 text-left">
            {[
              { icon: Code2, label: "Skill Assessment", desc: "Identify your strengths and gaps" },
              { icon: Briefcase, label: "Career Paths", desc: "AI-matched career recommendations" },
              { icon: GraduationCap, label: "Interview Prep", desc: "500+ questions with AI feedback" },
            ].map((item, i) => (
              <div key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                style={{ animation: `slideUp 0.5s ease-out ${0.3 + i * 0.1}s both` }}>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm" style={{ animation: "fadeScale 0.5s ease-out both" }}>
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-bold text-white">Compass</span>
          </div>

          <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
            <h2 className="text-2xl font-bold mb-1 text-white">Welcome back</h2>
            <p className="text-sm text-slate-400 mb-8">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                type="email" placeholder="you@example.com" required autoFocus
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600" />
            </div>

            <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  type={show ? "text" : "password"} placeholder="Enter your password" required
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all pr-11 placeholder:text-slate-600" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5" style={{ animation: "slideUp 0.3s ease-out both" }}>
                {error}
              </p>
            )}

            <div style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}>
              <button type="submit" disabled={loading || !form.email || !form.password}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-8 text-center" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Create one <ArrowRight className="w-3 h-3 inline -mt-0.5" />
              </Link>
            </p>
            <p className="mt-4">
              <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
