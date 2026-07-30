"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Users, MessageSquare, Monitor, Camera, BarChart3, ChevronRight, Play, Clock, Award, Settings, Volume2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const INTERVIEW_TYPES = [
  { id: "technical", icon: Monitor, title: "Technical Round", desc: "Coding problems, system design, and technical deep-dive questions.", color: "rgba(99,102,241,0.15)", duration: "45 min" },
  { id: "hr", icon: Users, title: "HR Round", desc: "Career goals, salary expectations, company fit, and behavioral questions.", color: "rgba(168,85,247,0.15)", duration: "30 min" },
  { id: "managerial", icon: MessageSquare, title: "Managerial Round", desc: "Leadership scenarios, team management, and strategic thinking.", color: "rgba(6,182,212,0.15)", duration: "45 min" },
  { id: "behavioral", icon: Mic, title: "Behavioral Round", desc: "STAR method questions, past experiences, and situational responses.", color: "rgba(244,63,94,0.15)", duration: "30 min" },
  { id: "panel", icon: Users, title: "Panel Interview", desc: "Multiple interviewers evaluating you simultaneously across dimensions.", color: "rgba(16,185,129,0.15)", duration: "60 min" },
  { id: "coding", icon: Monitor, title: "Coding Round", desc: "Live coding with screen share, real-time problem-solving evaluation.", color: "rgba(245,158,11,0.15)", duration: "60 min" },
];

const EVAL_METRICS = [
  { label: "Technical Accuracy", value: 0, color: "bg-indigo-500" },
  { label: "Communication", value: 0, color: "bg-green-500" },
  { label: "Problem Solving", value: 0, color: "bg-amber-500" },
  { label: "Confidence", value: 0, color: "bg-purple-500" },
  { label: "Clarity", value: 0, color: "bg-cyan-500" },
  { label: "Overall", value: 0, color: "bg-indigo-400" },
];

export default function MockInterviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [interviewActive, setInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionNum, setQuestionNum] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("mock interview load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const startInterview = (typeId: string) => {
    setSelectedType(typeId);
    setInterviewActive(true);
    setQuestionNum(1);
    setCurrentQuestion("Tell me about a challenging project you've worked on and how you overcame obstacles.");
    setAnswer("");
  };

  const submitAnswer = () => {
    if (questionNum < 3) {
      setQuestionNum(prev => prev + 1);
      setCurrentQuestion(questionNum === 1 ? "How would you design a scalable web application that handles millions of users?" : "Describe a time you had a conflict with a teammate and how you resolved it.");
      setAnswer("");
    } else {
      setInterviewActive(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Mock Interview</h1>
                <p className="text-sm text-slate-400">Realistic interview simulation with AI evaluation across all round types</p>
              </div>
            </div>
          </motion.div>

          {!interviewActive ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INTERVIEW_TYPES.map((type, i) => (
                <motion.div key={type.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <button onClick={() => startInterview(type.id)}
                    className="w-full text-left p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                    style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: type.color }}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-indigo-400 transition-colors">{type.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span><Clock className="w-3 h-3 inline mr-1" />{type.duration}</span>
                      <Play className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                {/* Interview Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-semibold">AI Interviewer</span>
                      </div>
                      <p className="text-xs text-slate-500">Question {questionNum} of 3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Volume2 className="w-4 h-4" />
                    <Camera className="w-4 h-4" />
                    <Settings className="w-4 h-4" />
                  </div>
                </div>

                {/* Question */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
                  <p className="text-sm font-medium">{currentQuestion}</p>
                </div>

                {/* Answer */}
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..."
                  className="w-full h-32 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-sm outline-none focus:border-indigo-500/50 transition-all resize-none" />

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    Typing...
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setInterviewActive(false)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm transition-all hover:bg-white/10">
                      End Interview
                    </button>
                    <button onClick={submitAnswer} disabled={!answer.trim()}
                      className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all disabled:opacity-50">
                      {questionNum >= 3 ? "Finish" : "Submit Answer"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
