"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Star, Lightbulb, Target, Award, ChevronRight, BookOpen, CheckCircle2, XCircle, Loader2, Shuffle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const QUESTIONS = [
  { id: "star", q: "Describe a situation using the STAR method where you solved a difficult problem.", category: "STAR Method", tip: "Structure: Situation, Task, Action, Result" },
  { id: "conflict", q: "Tell me about a time you had a conflict with a teammate. How did you handle it?", category: "Conflict", tip: "Focus on resolution and what you learned" },
  { id: "failure", q: "Describe a significant failure you experienced and what you learned from it.", category: "Failure", tip: "Be honest — show growth mindset" },
  { id: "success", q: "Tell me about your greatest professional achievement.", category: "Success", tip: "Quantify results with metrics" },
  { id: "leadership", q: "Describe a time you demonstrated leadership without having authority.", category: "Leadership", tip: "Initiative and influence matter" },
  { id: "teamwork", q: "Tell me about a time you worked effectively in a diverse team.", category: "Teamwork", tip: "Highlight collaboration and respect" },
  { id: "pressure", q: "How do you handle pressure or stressful situations? Give a real example.", category: "Pressure", tip: "Show composure and systematic approach" },
  { id: "adaptability", q: "Describe a time when you had to quickly adapt to a significant change.", category: "Adaptability", tip: "Show flexibility and learning speed" },
  { id: "ownership", q: "Tell me about a time you took ownership of a project beyond your responsibilities.", category: "Ownership", tip: "Show initiative and accountability" },
  { id: "innovation", q: "Describe a time you introduced an innovative idea or improved an existing process.", category: "Innovation", tip: "Highlight impact and implementation" },
  { id: "decision", q: "Tell me about a difficult decision you made with limited information.", category: "Decision Making", tip: "Explain your reasoning and how you validated it" },
  { id: "communication", q: "Describe a time you explained a complex idea to a non-technical person.", category: "Communication", tip: "Show clarity, simplicity, and patience" },
  { id: "criticism", q: "Tell me about a time you received tough criticism. How did you respond?", category: "Criticism", tip: "Separate the message from the emotion" },
  { id: "mistake", q: "Describe a time you made a mistake that affected others.", category: "Mistakes", tip: "Own it early, fix it fast, and change the process" },
  { id: "deadline", q: "Tell me about a time you had to deliver under a very tight deadline.", category: "Deadlines", tip: "Show prioritization and calm execution" },
  { id: "ethics", q: "Describe a time you had to stand up for what was right.", category: "Integrity", tip: "Show courage, honesty, and respect" },
  { id: "resilience", q: "Tell me about a time you bounced back from a setback.", category: "Resilience", tip: "Focus on your recovery plan and mindset" },
  { id: "delegation", q: "Describe a time you delegated work. How did you ensure it went well?", category: "Delegation", tip: "Show trust, clear instructions, and follow-up" },
  { id: "customer", q: "Tell me about a time you handled a difficult customer or client.", category: "Customer Handling", tip: "Empathy first, then a concrete solution" },
  { id: "ambiguity", q: "Describe a time you worked on something with no clear instructions.", category: "Ambiguity", tip: "Show how you created structure and asked the right questions" },
  { id: "initiative", q: "Tell me about something you started from scratch on your own.", category: "Initiative", tip: "Why you started it and the outcome" },
  { id: "learning", q: "Describe a time you had to learn a new skill quickly.", category: "Learning", tip: "Name the skill, your method, and the result" },
  { id: "cross-functional", q: "Tell me about a time you worked with people from a very different background or function.", category: "Collaboration", tip: "Show respect for differences and shared goals" },
  { id: "goal", q: "Describe a long-term goal you set and how you achieved it.", category: "Goal Setting", tip: "Break it into milestones with evidence of progress" },
  { id: "negative", q: "Tell me about a project or task you disliked. How did you handle it?", category: "Professionalism", tip: "Never badmouth — show discipline and focus" },
  { id: "team-save", q: "Describe a time you helped a struggling teammate succeed.", category: "Support", tip: "Show generosity and impact on the team" },
  { id: "priority", q: "Tell me about a time you had competing priorities. How did you choose?", category: "Prioritization", tip: "Show your criteria: impact, urgency, stakeholders" },
  { id: "change", q: "Describe a time you drove a change others resisted.", category: "Change Management", tip: "Show persuasion, evidence, and empathy" },
];

const QUESTIONS_PER_SET = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BehavioralPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ requireOnboarded: true });
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [sessionQuestions, setSessionQuestions] = useState(() => shuffle(QUESTIONS).slice(0, QUESTIONS_PER_SET));
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; strengths: string[]; improvements: string[]; starAnalysis: { situation: string; task: string; action: string; result: string }; nextQuestion: string } | null>(null);

  const newSet = () => {
    setSessionQuestions(shuffle(QUESTIONS).slice(0, QUESTIONS_PER_SET));
    setSelectedQ(null);
    setAnswer("");
    setFeedback(null);
  };

  const getFeedback = async () => {
    if (selectedQ === null || !answer.trim() || evaluating) return;
    setEvaluating(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: sessionQuestions[selectedQ].q, answer }),
      });
      if (res.ok) setFeedback(await res.json());
    } catch (e) { console.error("behavioral feedback failed", e); }
    setEvaluating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <div data-tour="prep-behavioral-header" className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Behavioral Interview Practice</h1>
            <button onClick={newSet} className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              <Shuffle className="w-3 h-3" /> Shuffle Questions
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-8">Master the STAR method with AI-powered feedback · fresh questions every visit</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Questions */}
            <div data-tour="prep-behavioral-questions" className="space-y-3">
              {sessionQuestions.map((q, i) => (
                <motion.button
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setSelectedQ(i); setFeedback(null); setAnswer(""); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedQ === i ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{q.category}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </div>
                  <p className="text-sm">{q.q}</p>
                </motion.button>
              ))}
            </div>

            {/* Practice Area */}
            <div data-tour="prep-behavioral-practice">
              {selectedQ !== null ? (
                <motion.div key={selectedQ} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/5 p-6" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">Tip: {sessionQuestions[selectedQ].tip}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{sessionQuestions[selectedQ].q}</h3>
                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Write your answer using the STAR method..."
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-indigo-500/30 resize-none mb-4 placeholder:text-slate-600"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{answer.length} characters</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setAnswer(""); setFeedback(null); }}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        Clear
                      </button>
                      <button
                        onClick={getFeedback}
                        disabled={!answer.trim() || evaluating}
                        className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-1.5">
                        {evaluating ? <><Loader2 className="w-3 h-3 animate-spin" /> Analyzing...</> : "Get AI Feedback"}
                      </button>
                    </div>
                  </div>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
                      <div className="flex items-center gap-5 p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                          style={{ background: `conic-gradient(${feedback.score >= 7 ? "#10b981" : feedback.score >= 5 ? "#f59e0b" : "#ef4444"} ${feedback.score * 10}%, rgba(255,255,255,0.08) 0)` }}>
                          <div className="w-12 h-12 rounded-full bg-[#111118] flex items-center justify-center">{Math.round(feedback.score * 10)}%</div>
                        </div>
                        <div>
                          <div className={`font-semibold ${feedback.score >= 7 ? "text-green-400" : feedback.score >= 5 ? "text-amber-400" : "text-red-400"}`}>
                            {feedback.score >= 7 ? "Strong answer" : feedback.score >= 5 ? "Good, but improvable" : "Needs work"}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{feedback.feedback}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                          <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</h4>
                          <ul className="space-y-1.5">
                            {feedback.strengths.map((s, i) => <li key={i} className="text-xs text-slate-400 flex gap-1.5"><span className="text-green-400">•</span>{s}</li>)}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Improvements</h4>
                          <ul className="space-y-1.5">
                            {feedback.improvements.map((s, i) => <li key={i} className="text-xs text-slate-400 flex gap-1.5"><span className="text-red-400">•</span>{s}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">STAR Analysis</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Situation", value: feedback.starAnalysis.situation },
                            { label: "Task", value: feedback.starAnalysis.task },
                            { label: "Action", value: feedback.starAnalysis.action },
                            { label: "Result", value: feedback.starAnalysis.result },
                          ].map((s, i) => (
                            <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                              <div className="text-[10px] text-slate-500 uppercase mb-1">{s.label}</div>
                              <div className="text-xs text-slate-300">{s.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {feedback.nextQuestion && (
                        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                          <p className="text-xs text-slate-500 mb-1">Follow-up to practice:</p>
                          <p className="text-sm">{feedback.nextQuestion}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-xl border border-white/5 p-12 text-center" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">Select a Question</h3>
                  <p className="text-sm text-slate-500">Choose a behavioral question from the left to practice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <PageTour
          id="prep-behavioral"
          steps={[
            { target: "[data-tour='prep-behavioral-header']", title: "Behavioral Practice", body: "STAR-method questions real interviewers ask — shuffle for a fresh set." },
            { target: "[data-tour='prep-behavioral-questions']", title: "Pick a question", body: "Choose any question to practice your answer." },
            { target: "[data-tour='prep-behavioral-practice']", title: "Write & get feedback", body: "Draft your response and get instant AI feedback on structure and impact." },
          ]}
        />
      </main>
    </div>
  );
}
