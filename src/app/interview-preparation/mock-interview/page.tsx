"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Users, MessageSquare, Monitor, Camera, BarChart3, Play, Clock, Award, ChevronRight, Loader2, CheckCircle2, XCircle, Lightbulb, Sparkles, RotateCcw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";
import { useAuth } from "@/hooks/useAuth";

const INTERVIEW_TYPES = [
  { id: "technical", icon: Monitor, title: "Technical Round", desc: "Coding problems, system design, and technical deep-dive questions.", color: "rgba(99,102,241,0.15)", duration: "45 min" },
  { id: "hr", icon: Users, title: "HR Round", desc: "Career goals, salary expectations, company fit, and behavioral questions.", color: "rgba(168,85,247,0.15)", duration: "30 min" },
  { id: "managerial", icon: MessageSquare, title: "Managerial Round", desc: "Leadership scenarios, team management, and strategic thinking.", color: "rgba(6,182,212,0.15)", duration: "45 min" },
  { id: "behavioral", icon: Mic, title: "Behavioral Round", desc: "STAR method questions, past experiences, and situational responses.", color: "rgba(244,63,94,0.15)", duration: "30 min" },
  { id: "panel", icon: Users, title: "Panel Interview", desc: "Multiple interviewers evaluating you simultaneously across dimensions.", color: "rgba(16,185,129,0.15)", duration: "60 min" },
  { id: "coding", icon: Monitor, title: "Coding Round", desc: "Live coding with screen share, real-time problem-solving evaluation.", color: "rgba(245,158,11,0.15)", duration: "60 min" },
];

interface SessionQuestion {
  id: string;
  type: string;
  text: string;
  tips: string;
  followUps: string[];
}

interface Session {
  role: string;
  company: string;
  roundType: string;
  durationMinutes: number;
  overview: string;
  questions: SessionQuestion[];
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  starAnalysis: { situation: string; task: string; action: string; result: string };
  nextQuestion: string;
}

type Stage = "select" | "generating" | "interview" | "results";

export default function MockInterviewPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [stage, setStage] = useState<Stage>("select");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [results, setResults] = useState<{ question: string; score: number; feedback: string }[]>([]);
  const [error, setError] = useState("");
  const [autoStarted, setAutoStarted] = useState(false);

  useEffect(() => {
    if (authLoading || autoStarted) return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const company = params.get("company");
    if (type) {
      setCompanyName(company || "");
      setAutoStarted(true);
      startInterview(type, company || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const startInterview = async (typeId: string, companyOverride = "") => {
    setSelectedType(typeId);
    setStage("generating");
    setError("");
    setResults([]);
    setEvaluation(null);
    setQIndex(0);
    try {
      const c = companyOverride || companyName;
      const url = `/api/interview/session?type=${typeId}${c ? `&company=${encodeURIComponent(c)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to generate session");
      const data = await res.json();
      setSession(data);
      setStage("interview");
    } catch (e) {
      setError("AI couldn't start the interview. Please try again.");
      setStage("select");
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !session) return;
    setEvaluating(true);
    setEvaluation(null);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: session.questions[qIndex].text,
          answer,
          role: session.role,
          company: companyName || session.company,
        }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const evalData = await res.json();
      setEvaluation(evalData);
      setResults(prev => [...prev, {
        question: session.questions[qIndex].text,
        score: evalData.score,
        feedback: evalData.feedback,
      }]);
    } catch {
      setError("Evaluation failed. Please try again.");
    }
    setEvaluating(false);
  };

  const nextQuestion = () => {
    setEvaluation(null);
    setAnswer("");
    if (session && qIndex < session.questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      setStage("results");
    }
  };

  const reset = () => {
    setStage("select");
    setSession(null);
    setQIndex(0);
    setAnswer("");
    setEvaluation(null);
    setResults([]);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const current = session?.questions[qIndex];
  const overallScore = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length * 10) / 10 : 0;
  const scorePct = Math.round(overallScore * 10);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6" data-tour="prep-mock-header">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Mock Interview</h1>
                <p className="text-sm text-slate-400">AI generates questions from your profile and evaluates every answer</p>
              </div>
            </div>
          </motion.div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              {error}
              <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
            </div>
          )}

          {stage === "select" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-tour="prep-mock-select">
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
          )}

          {stage === "generating" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm mb-1">Building your personalized {selectedType} round...</p>
              <p className="text-slate-600 text-xs">Analyzing your skills, career paths, and skill gaps to generate real interview questions</p>
            </motion.div>
          )}

          {stage === "interview" && session && current && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }} data-tour="prep-mock-stage">
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
                      <p className="text-xs text-slate-500">{session.role} · Question {qIndex + 1} of {session.questions.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-400" /> {scorePct}%</span>
                    <span>{Math.round((qIndex / session.questions.length) * 100)}% complete</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full bg-white/5 mb-6 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={false} animate={{ width: `${((qIndex + (evaluation ? 1 : 0)) / session.questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>

                {/* Overview pill */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {session.overview}
                </div>

                {/* Question */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
                  <p className="text-sm font-medium">{current.text}</p>
                </div>

                {/* Tips */}
                {!evaluation && current.tips && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
                    <p className="text-xs text-amber-400 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span><span className="font-semibold">Strong answers cover: </span>{current.tips}</span>
                    </p>
                  </div>
                )}

                {evaluation ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Score */}
                    <div className="flex items-center gap-5 p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                        style={{ background: `conic-gradient(${evaluation.score >= 7 ? "#10b981" : evaluation.score >= 5 ? "#f59e0b" : "#ef4444"} ${evaluation.score * 10}%, rgba(255,255,255,0.08) 0)` }}>
                        <div className="w-12 h-12 rounded-full bg-[#111118] flex items-center justify-center">{Math.round(evaluation.score * 10)}%</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${evaluation.score >= 7 ? "text-green-400" : evaluation.score >= 5 ? "text-amber-400" : "text-red-400"}`}>
                          {evaluation.score >= 7 ? "Strong answer" : evaluation.score >= 5 ? "Good, but improvable" : "Needs work"}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{evaluation.feedback}</p>
                      </div>
                    </div>

                    {/* Strengths / Improvements */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</h4>
                        <ul className="space-y-1.5">
                          {evaluation.strengths.map((s, i) => <li key={i} className="text-xs text-slate-400 flex gap-1.5"><span className="text-green-400">•</span>{s}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Improvements</h4>
                        <ul className="space-y-1.5">
                          {evaluation.improvements.map((s, i) => <li key={i} className="text-xs text-slate-400 flex gap-1.5"><span className="text-red-400">•</span>{s}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* STAR analysis */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">STAR Analysis</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Situation", value: evaluation.starAnalysis.situation },
                          { label: "Task", value: evaluation.starAnalysis.task },
                          { label: "Action", value: evaluation.starAnalysis.action },
                          { label: "Result", value: evaluation.starAnalysis.result },
                        ].map((s, i) => (
                          <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">{s.label}</div>
                            <div className="text-xs text-slate-300">{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next question preview */}
                    {session.questions[qIndex + 1] && (
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-xs text-slate-500 mb-1">Up next:</p>
                        <p className="text-sm">{session.questions[qIndex + 1].text}</p>
                      </div>
                    )}

                    <button onClick={nextQuestion}
                      className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      {qIndex < session.questions.length - 1 ? <>Next Question <ChevronRight className="w-4 h-4" /></> : <>See Full Results <BarChart3 className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Answer */}
                    <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..."
                      className="w-full h-32 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-sm outline-none focus:border-indigo-500/50 transition-all resize-none" />

                    {/* Follow-up hints */}
                    {current.followUps.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {current.followUps.map((f, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-slate-500 border border-white/5">Follow-up: {f}</span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {answer.trim() ? `${answer.trim().split(/\s+/).length} words` : "Type your answer"}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={reset}
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm transition-all hover:bg-white/10">
                          End Interview
                        </button>
                        <button onClick={submitAnswer} disabled={!answer.trim() || evaluating}
                          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2">
                          {evaluating ? <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</> : "Submit Answer"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {stage === "results" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="text-center mb-8">
                <div className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ background: `conic-gradient(${scorePct >= 70 ? "#10b981" : scorePct >= 50 ? "#f59e0b" : "#ef4444"} ${scorePct * 3.6}deg, rgba(255,255,255,0.08) 0)` }}>
                  <div className="w-24 h-24 rounded-full bg-[#111118] flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{scorePct}%</span>
                    <span className="text-[10px] text-slate-500 uppercase">Overall</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold">
                  {scorePct >= 70 ? "Great performance!" : scorePct >= 50 ? "Solid effort — keep practicing" : "Practice makes perfect"}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {session?.roundType} round · {results.length} answers evaluated
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {results.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium flex-1 pr-4">Q{i + 1}. {r.question}</p>
                      <span className={`text-sm font-bold shrink-0 ${r.score >= 7 ? "text-green-400" : r.score >= 5 ? "text-amber-400" : "text-red-400"}`}>{Math.round(r.score * 10)}%</span>
                    </div>
                    <p className="text-xs text-slate-500">{r.feedback}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Practice Another Round
                </button>
                <button onClick={() => startInterview(selectedType || "technical")} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Retry {selectedType} Round
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <PageTour
          id="prep-mock"
          steps={[
            { target: "[data-tour='prep-mock-header']", title: "AI Mock Interview", body: "A realistic AI interviewer that adapts to your role and experience." },
            { target: "[data-tour='prep-mock-select']", title: "Choose your format", body: "Behavioral, technical, HR, aptitude and more — pick your arena." },
            { target: "[data-tour='prep-mock-stage']", title: "Answer & improve", body: "The AI questions you, gives tips, and grades every response." },
          ]}
        />
      </main>
    </div>
  );
}
