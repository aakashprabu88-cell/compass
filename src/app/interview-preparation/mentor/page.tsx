"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, MessageSquare, Lightbulb, Target, Bookmark, Zap, ChevronRight, Send, TrendingUp, Clock, Award, Star, BarChart3, GraduationCap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const QUICK_ACTIONS = [
  { label: "Review Weak Areas", desc: "Focus on areas needing improvement", color: "rgba(244,63,94,0.1)", textColor: "text-rose-400" },
  { label: "Daily Challenge", desc: "Solve today's coding problem", color: "rgba(245,158,11,0.1)", textColor: "text-amber-400" },
  { label: "Mock Interview", desc: "Practice interview simulation", color: "rgba(168,85,247,0.1)", textColor: "text-purple-400" },
  { label: "Track Progress", desc: "View your analytics dashboard", color: "rgba(6,182,212,0.1)", textColor: "text-cyan-400" },
];

const CAREER_ROADMAP = [
  { phase: "Foundation", duration: "2 weeks", focus: "Aptitude + Reasoning + Verbal basics", progress: 100 },
  { phase: "Core Skills", duration: "4 weeks", focus: "Data Structures, Algorithms, OOP, DBMS", progress: 65 },
  { phase: "Advanced Topics", duration: "3 weeks", focus: "System Design, OS, Networking, Advanced DSA", progress: 30 },
  { phase: "Company Prep", duration: "3 weeks", focus: "Company-specific questions, mock interviews", progress: 10 },
  { phase: "Final Polish", duration: "1 week", focus: "Full-length mocks, weak area revision, confidence", progress: 0 },
];

const TODAYS_PLAN = [
  { time: "09:00 AM", task: "Aptitude — Time & Work Practice", duration: "45 min", done: true },
  { time: "10:00 AM", task: "Technical — Arrays & Strings", duration: "60 min", done: true },
  { time: "11:30 AM", task: "Daily Coding Challenge", duration: "30 min", done: false },
  { time: "02:00 PM", task: "Mock Interview — Technical Round", duration: "45 min", done: false },
  { time: "04:00 PM", task: "Review Weak Areas — DP", duration: "45 min", done: false },
];

export default function MentorPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("mentor load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6" data-tour="prep-mentor-header">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">AI Mentor</h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">BETA</span>
                </div>
                <p className="text-sm text-slate-400">Your personal career mentor that remembers everything and guides you to success</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6" data-tour="prep-mentor-actions">
            {QUICK_ACTIONS.map((a, i) => (
              <motion.button key={a.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all text-left"
                style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="text-xs font-medium">{a.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{a.desc}</div>
              </motion.button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4" data-tour="prep-mentor-cards">
            {/* Today's Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> Today's Plan</h2>
              <div className="space-y-2">
                {TODAYS_PLAN.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.done ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <div>
                        <div className="text-xs font-medium">{item.task}</div>
                        <div className="text-[10px] text-slate-500">{item.time}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{item.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career Roadmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-400" /> Career Roadmap</h2>
              <div className="space-y-3">
                {CAREER_ROADMAP.map((phase, i) => (
                  <div key={phase.phase}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium">{phase.phase}</span>
                      <span className="text-[10px] text-slate-500">{phase.duration}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mb-1">{phase.focus}</div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${phase.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Chat CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
            className="mt-4 p-4 rounded-xl border border-indigo-500/20 text-center" style={{ background: "rgba(99,102,241,0.05)" }}>
            <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-indigo-400" />
            <p className="text-sm font-medium mb-0.5">Ask your AI Mentor anything</p>
            <p className="text-[11px] text-slate-400 mb-3">Career advice, study plans, interview tips, or just motivation</p>
            <button onClick={() => setChatOpen(!chatOpen)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all text-sm font-semibold">
              <MessageSquare className="w-4 h-4" /> Start Chat
            </button>
            {chatOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="p-3 rounded-lg border border-white/5 mb-2 max-h-32 overflow-y-auto text-left">
                  <p className="text-xs text-slate-400">Hi! I'm your AI Mentor. I've analyzed your preparation data. Your biggest opportunity is in Dynamic Programming. Would you like me to create a focused study plan?</p>
                </div>
                <div className="flex items-center gap-2">
                  <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask anything..."
                    className="flex-1 p-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs outline-none focus:border-indigo-500/50 transition-all" />
                  <button className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-all">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <PageTour
          id="prep-mentor"
          steps={[
            { target: "[data-tour='prep-mentor-header']", title: "AI Mentor", body: "Your personal coach, planning today's work and your long-term roadmap." },
            { target: "[data-tour='prep-mentor-actions']", title: "Quick actions", body: "Ask for a topic, doubt, or a fresh challenge anytime." },
            { target: "[data-tour='prep-mentor-cards']", title: "Daily plan & roadmap", body: "A structured path from where you are to interview-ready." },
          ]}
        />
      </main>
    </div>
  );
}
