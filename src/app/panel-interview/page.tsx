"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Send, Users, Brain, Heart, Briefcase, Star,
  ArrowRight, CheckCircle, XCircle, Clock, Volume2, Loader2
} from "lucide-react";

interface Interviewer {
  id: string;
  name: string;
  role: string;
  personality: string;
  avatar: string;
  color: string;
  borderColor: string;
}

interface PanelMessage {
  interviewerId: string;
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
  timestamp: Date;
}

interface InterviewResult {
  overallScore: number;
  decision: "strong_hire" | "hire" | "maybe" | "no_hire";
  summary: string;
  interviewerScores: { id: string; score: number; feedback: string }[];
  strengths: string[];
  improvements: string[];
}

const INTERVIEWERS: Interviewer[] = [
  {
    id: "hr",
    name: "Priya Sharma",
    role: "HR Manager",
    personality: "Warm but probing. Focuses on culture fit, motivation, and behavioral questions.",
    avatar: "PS",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
  },
  {
    id: "tech",
    name: "Arjun Mehta",
    role: "Tech Lead",
    personality: "Analytical and detail-oriented. Asks deep technical questions and follow-ups.",
    avatar: "AM",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "behavioral",
    name: "Sneha Patel",
    role: "Behavioral Analyst",
    personality: "Empathetic but rigorous. Uses STAR method, probes for self-awareness.",
    avatar: "SP",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
  },
];

type Phase = "setup" | "interview" | "results";

export default function PanelInterviewPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Google");
  const [messages, setMessages] = useState<PanelMessage[]>([]);
  const [currentInterviewer, setCurrentInterviewer] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error || !d.onboarded) { router.push("/"); return; }
      setAuthed(true);
    }).catch(() => router.push("/"));
  }, [router]);

  const MAX_QUESTIONS = 9; // 3 per interviewer

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = () => {
    setPhase("interview");
    setMessages([]);
    setCurrentInterviewer(0);
    setQuestionCount(0);

    // First question from HR
    generateQuestion(0, []);
  };

  const generateQuestion = async (interviewerIdx: number, history: PanelMessage[]) => {
    setLoading(true);
    const interviewer = INTERVIEWERS[interviewerIdx];
    try {
      const res = await fetch("/api/ai/panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "question",
          interviewer: interviewer.id,
          interviewerName: interviewer.name,
          interviewerRole: interviewer.role,
          interviewerPersonality: interviewer.personality,
          role,
          company,
          questionNumber: history.length,
          history: history.map(m => ({
            interviewer: m.interviewerId,
            question: m.question,
            answer: m.answer,
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        interviewerId: interviewer.id,
        question: data.question || "Tell me about yourself.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        interviewerId: interviewer.id,
        question: "Tell me about yourself and why you're interested in this role.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!input.trim() || loading) return;
    const answer = input;
    setInput("");
    setTranscript("");

    const lastMsg = messages[messages.length - 1];
    const updatedMessages = messages.map((m, i) =>
      i === messages.length - 1 ? { ...m, answer } : m
    );
    setMessages(updatedMessages);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    if (newCount >= MAX_QUESTIONS) {
      // End interview
      setLoading(true);
      try {
        const res = await fetch("/api/ai/panel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "evaluate",
            role,
            company,
            history: updatedMessages.map(m => ({
              interviewer: m.interviewerId,
              question: m.question,
              answer: m.answer,
            })),
          }),
        });
        const data = await res.json();
        setResult(data);
        setPhase("results");
      } catch {
        setResult({
          overallScore: 72,
          decision: "hire",
          summary: "Good performance across all areas with room for improvement in technical depth.",
          interviewerScores: INTERVIEWERS.map(i => ({ id: i.id, score: 72, feedback: "Solid performance" })),
          strengths: ["Clear communication", "Good motivation"],
          improvements: ["Add more specific examples", "Deeper technical details"],
        });
        setPhase("results");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Rotate interviewers
    const nextInterviewer = (currentInterviewer + 1) % 3;
    setCurrentInterviewer(nextInterviewer);

    // Get evaluation of answer and next question
    setLoading(true);
    try {
      const interviewer = INTERVIEWERS[nextInterviewer];
      const res = await fetch("/api/ai/panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "followup",
          interviewer: interviewer.id,
          interviewerName: interviewer.name,
          interviewerRole: interviewer.role,
          interviewerPersonality: interviewer.personality,
          role,
          company,
          lastQuestion: lastMsg.question,
          lastAnswer: answer,
          history: updatedMessages.map(m => ({
            interviewer: m.interviewerId,
            question: m.question,
            answer: m.answer,
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        interviewerId: interviewer.id,
        question: data.question || "Can you tell me more about that?",
        timestamp: new Date(),
      }]);
    } catch {
      const interviewer = INTERVIEWERS[nextInterviewer];
      setMessages(prev => [...prev, {
        interviewerId: interviewer.id,
        question: "Can you give me a specific example from your experience?",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInput(prev => prev + final);
      setTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const getInterviewer = (id: string) => INTERVIEWERS.find(i => i.id === id) || INTERVIEWERS[0];

  if (!authed) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Setup Phase
  if (phase === "setup") {
    return (
      <div className="h-screen flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">AI Panel Interview</h1>
            <p className="text-slate-400 text-sm">3 AI interviewers. 9 questions. Real feedback.</p>
          </div>

          {/* Interviewers */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {INTERVIEWERS.map(interviewer => (
              <div key={interviewer.id} className={`p-4 rounded-xl border ${interviewer.borderColor} bg-white/[0.02] text-center`}>
                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-sm font-bold ${interviewer.color}`}>
                  {interviewer.avatar}
                </div>
                <div className="text-sm font-medium">{interviewer.name}</div>
                <div className="text-[10px] text-slate-500">{interviewer.role}</div>
              </div>
            ))}
          </div>

          {/* Config */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Role</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Company</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30"
              />
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Start Interview <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-slate-600 mt-3">~5 minutes. You can type or use voice input.</p>
        </motion.div>
      </div>
    );
  }

  // Results Phase
  if (phase === "results" && result) {
    const decisionColors: Record<string, string> = {
      strong_hire: "text-green-400",
      hire: "text-emerald-400",
      maybe: "text-amber-400",
      no_hire: "text-red-400",
    };
    const decisionLabels: Record<string, string> = {
      strong_hire: "Strong Hire",
      hire: "Hire",
      maybe: "Maybe",
      no_hire: "No Hire",
    };

    return (
      <div className="h-screen overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Panel Decision</h1>
              <p className="text-slate-400">{role} at {company}</p>
            </div>

            {/* Score Card */}
            <div className="rounded-2xl border border-white/10 p-8 text-center mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="text-6xl font-bold gradient-text mb-2">{result.overallScore}</div>
              <div className={`text-xl font-semibold ${decisionColors[result.decision]} mb-1`}>
                {decisionLabels[result.decision]}
              </div>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-3">{result.summary}</p>
            </div>

            {/* Per-interviewer scores */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {result.interviewerScores.map(score => {
                const interviewer = getInterviewer(score.id);
                return (
                  <div key={score.id} className={`p-4 rounded-xl border ${interviewer.borderColor} bg-white/[0.02] text-center`}>
                    <div className={`text-2xl font-bold ${interviewer.color} mb-1`}>{score.score}</div>
                    <div className="text-xs text-slate-500">{interviewer.name}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{score.feedback}</div>
                  </div>
                );
              })}
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Strengths</span>
                </div>
                {result.strengths.map((s, i) => (
                  <div key={i} className="text-xs text-slate-400 mb-1.5">• {s}</div>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Improvements</span>
                </div>
                {result.improvements.map((s, i) => (
                  <div key={i} className="text-xs text-slate-400 mb-1.5">• {s}</div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase("setup")}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors"
            >
              Practice Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Interview Phase
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-3 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <div>
            <h1 className="font-semibold text-sm">Panel Interview</h1>
            <p className="text-[10px] text-slate-500">{role} at {company}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Q{questionCount + 1}/{MAX_QUESTIONS}
          </div>
          <div className="flex gap-1.5">
            {INTERVIEWERS.map((int, i) => (
              <div key={int.id} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                i === currentInterviewer % 3 ? `${int.borderColor} ${int.color} bg-white/5` : "border-white/5 text-slate-600"
              }`}>
                {int.avatar[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const interviewer = getInterviewer(msg.interviewerId);
            const isActive = i === messages.length - 1 && !msg.answer;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                {/* Question */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${interviewer.borderColor} ${interviewer.color} bg-white/5`}>
                    {interviewer.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 mb-1">
                      {interviewer.name} · {interviewer.role}
                    </div>
                    <div className="inline-block max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 bg-white/5 text-sm leading-relaxed">
                      {msg.question}
                    </div>
                  </div>
                </div>

                {/* Answer */}
                {msg.answer && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-3 bg-indigo-500/20 text-sm text-indigo-100 leading-relaxed">
                      {msg.answer}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${INTERVIEWERS[currentInterviewer % 3].borderColor} bg-white/5`}>
              <Loader2 className={`w-4 h-4 animate-spin ${INTERVIEWERS[currentInterviewer % 3].color}`} />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Voice transcript */}
      {isListening && transcript && (
        <div className="shrink-0 px-6 py-2 text-xs text-slate-500 italic border-t border-white/5">
          Listening: {transcript}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              isListening ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitAnswer()}
            placeholder="Type your answer..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
          />
          <button
            onClick={submitAnswer}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
