"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Loader2, Eye, EyeOff, UserPlus, ArrowRight, Sparkles, Target, TrendingUp, Shield } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0a0a12]">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm" style={{ animation: "fadeScale 0.5s ease-out both" }}>
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-bold text-white">Compass</span>
          </div>

          <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
            <h2 className="text-2xl font-bold mb-1 text-white">Create your account</h2>
            <p className="text-sm text-slate-400 mb-8">Start your career journey in under 2 minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name" required autoFocus
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600" />
            </div>

            <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                type="email" placeholder="you@example.com" required
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600" />
            </div>

            <div style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  type={show ? "text" : "password"} placeholder="At least 6 characters" required minLength={6}
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

            <div style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}>
              <button type="submit" disabled={loading || !form.name || !form.email || !form.password}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center" style={{ animation: "fadeIn 0.5s ease-out 0.35s both" }}>
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign In <ArrowRight className="w-3 h-3 inline -mt-0.5" />
              </Link>
            </p>
            <p className="mt-4">
              <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-white">Your journey starts here</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Join thousands of students and professionals who use Compass to discover careers, build skills, and land opportunities.
          </p>
          <div className="space-y-4 text-left">
            {[
              { icon: Target, label: "Skill Discovery", desc: "AI identifies what you're good at" },
              { icon: TrendingUp, label: "Career Matching", desc: "Find paths aligned with your strengths" },
              { icon: Shield, label: "AI-Powered Prep", desc: "Personalized interview training" },
            ].map((item, i) => (
              <div key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                style={{ animation: `slideUp 0.5s ease-out ${0.3 + i * 0.1}s both` }}>
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-purple-400" />
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
