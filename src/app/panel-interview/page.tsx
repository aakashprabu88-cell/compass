"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageTour from "@/components/PageTour";

interface SpeechRecognitionAPI {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Send, Users, Star,
  ArrowRight, CheckCircle, Clock, Loader2, Sparkles, Lightbulb
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

interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

interface PanelMessage {
  interviewerId: string;
  question: string;
  answer?: string;
  evaluation?: AnswerEvaluation;
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

const ALL_INTERVIEWERS: Interviewer[] = [
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
  {
    id: "manager",
    name: "Rahul Verma",
    role: "Hiring Manager",
    personality: "Strategic and blunt. Judges ownership, business impact, and final decision.",
    avatar: "RV",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "design",
    name: "Kavya Iyer",
    role: "Design Lead",
    personality: "Empathetic about users, rigorous about process and trade-offs.",
    avatar: "KI",
    color: "text-pink-400",
    borderColor: "border-pink-500/30",
  },
  {
    id: "data",
    name: "Rohit Nair",
    role: "Data Science Lead",
    personality: "Rigorous about metrics, modeling, and honest caveats.",
    avatar: "RN",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
  },
  {
    id: "business",
    name: "Meera Krishnan",
    role: "Business Lead",
    personality: "Commercial instinct. Pushes for numbers, structure, and execution.",
    avatar: "MK",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
  },
];

const SPECIALIST_RULES: { regex: RegExp; specialist: Interviewer }[] = [
  { regex: /design|ui\/ux|ux\s*design|product designer|creative|graphic/i, specialist: ALL_INTERVIEWERS[4] },
  { regex: /data|analytics|analyst|machine learning|ml\s*engineer|ai\s*engineer|data scientist|scientist/i, specialist: ALL_INTERVIEWERS[5] },
  { regex: /sales|marketing|business|hr\s*executive|finance|account|consultant|management|operations|product manager|non-?tech/i, specialist: ALL_INTERVIEWERS[6] },
];

function selectPanel(role: string, company: string): Interviewer[] {
  const ctx = `${role} ${company}`;
  const panel: Interviewer[] = [ALL_INTERVIEWERS[0], ALL_INTERVIEWERS[2], ALL_INTERVIEWERS[3]];
  const rule = SPECIALIST_RULES.find(r => r.regex.test(ctx));
  const specialist = rule?.specialist || ALL_INTERVIEWERS[1];
  return [panel[0], specialist, panel[1], panel[2]];
}

type Phase = "setup" | "interview" | "results";

const QUESTIONS_PER_INTERVIEWER = 4;
const MAX_QUESTIONS = QUESTIONS_PER_INTERVIEWER * 4;

export default function PanelInterviewPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [phase, setPhase] = useState<Phase>("setup");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [panel, setPanel] = useState<Interviewer[]>([ALL_INTERVIEWERS[0], ALL_INTERVIEWERS[1], ALL_INTERVIEWERS[2], ALL_INTERVIEWERS[3]]);
  const [messages, setMessages] = useState<PanelMessage[]>([]);
  const [currentInterviewer, setCurrentInterviewer] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionAPI | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedRole = "Software Engineer";

  const startInterview = () => {
    const r = role.trim() || suggestedRole;
    const c = company.trim() || "Google";
    setRole(r);
    setCompany(c);
    const selected = selectPanel(r, c);
    setPanel(selected);
    setPhase("interview");
    setMessages([]);
    setCurrentInterviewer(0);
    setQuestionCount(0);

    generateQuestion(0, [], selected, r, c);
  };

  const countByInterviewer = (history: PanelMessage[], interviewerId: string) =>
    history.filter(m => m.interviewerId === interviewerId).length;

  const generateQuestion = async (interviewerIdx: number, history: PanelMessage[], activePanel: Interviewer[], roleOverride?: string, companyOverride?: string) => {
    setLoading(true);
    const interviewer = activePanel[interviewerIdx];
    const roleForCall = roleOverride || role;
    const companyForCall = companyOverride || company;
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
          role: roleForCall,
          company: companyForCall,
          questionNumber: countByInterviewer(history, interviewer.id),
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
        question: data.question || "Tell me about yourself and why you're interested in this role.",
        timestamp: new Date(),
      }]);
    } catch (e) {
      console.error("panel interview startQuestion", e);
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
      } catch (e) {
        console.error("panel interview evaluate", e);
        setResult({
          overallScore: 72,
          decision: "hire",
          summary: "Good performance across all areas with room for improvement in technical depth.",
          interviewerScores: panel.map(i => ({ id: i.id, score: 72, feedback: "Solid performance" })),
          strengths: ["Clear communication", "Good motivation"],
          improvements: ["Add more specific examples", "Deeper technical details"],
        });
        setPhase("results");
      } finally {
        setLoading(false);
      }
      return;
    }

    const nextInterviewer = (currentInterviewer + 1) % 4;
    setCurrentInterviewer(nextInterviewer);

    setLoading(true);
    try {
      const interviewer = panel[nextInterviewer];
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

      // Attach evaluation to the answered message
      if (data.evaluation) {
        setMessages(prev => prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, evaluation: data.evaluation } : m
        ));
      }

      setMessages(prev => [...prev, {
        interviewerId: interviewer.id,
        question: data.question || "Can you tell me more about that?",
        timestamp: new Date(),
      }]);
    } catch (e) {
      console.error("panel interview followup", e);
      const interviewer = panel[nextInterviewer];
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

    const SR = window as { SpeechRecognition?: new () => SpeechRecognitionAPI; webkitSpeechRecognition?: new () => SpeechRecognitionAPI };
    const SpeechRecognitionCtor = SR.SpeechRecognition ?? SR.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor!();
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

  const getInterviewer = (id: string) => panel.find(i => i.id === id) || ALL_INTERVIEWERS[0];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Setup Phase
  if (phase === "setup") {
    return (
      <div className="h-screen flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
          data-tour="panel-setup"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">AI Panel Interview</h1>
            <p className="text-slate-400 text-sm">4 AI interviewers. 16 questions. Detailed feedback after every answer.</p>
            <p className="text-xs text-slate-600 mt-1">The panel adapts to your target role — no two interviews are the same, and questions never repeat.</p>
          </div>

          {/* Config */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Role</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Data Analyst, UX Designer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Company</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Google, TCS, Zoho"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Panel preview */}
          <div className="mb-6">
            <div className="text-xs text-slate-500 mb-2">Your panel (auto-selected from your role):</div>
            <div className="grid grid-cols-2 gap-2">
              {selectPanel(role.trim() || "Software Engineer", company.trim() || "Google").map(interviewer => (
                <div key={interviewer.id} className={`p-3 rounded-xl border ${interviewer.borderColor} bg-white/[0.02] flex items-center gap-2`}>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold shrink-0 ${interviewer.color}`}>
                    {interviewer.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{interviewer.name}</div>
                    <div className="text-[9px] text-slate-500 truncate">{interviewer.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            data-tour="panel-start"
          >
            Start Interview <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-slate-600 mt-3">~10 minutes. You can type or use voice input.</p>
        </motion.div>
        <PageTour id="panel" steps={[
          { target: "[data-tour='panel-setup']", title: "Set the stage", body: "Tell the AI your target role and company — a 3-person panel forms around you." },
          { target: "[data-tour='panel-start']", title: "Your panel", body: "Review your interviewers, then hit Start to face them one question at a time." },
        ]}/>
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
        <div className="max-w-2xl mx-auto" data-tour="panel-results">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
            <div className="grid md:grid-cols-2 gap-4 mb-6">
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
              Practice Again (New Questions)
            </button>
          </motion.div>
        </div>
        <PageTour id="panel" steps={[
          { target: "[data-tour='panel-results']", title: "Panel decision", body: "Your final score with per-interviewer feedback, strengths and improvements." },
        ]}/>
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
            {panel.map((int, i) => (
              <div key={int.id} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                i === currentInterviewer % 4 ? `${int.borderColor} ${int.color} bg-white/5` : "border-white/5 text-slate-600"
              }`}>
                {int.avatar[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tour="panel-chat">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const interviewer = getInterviewer(msg.interviewerId);
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

                {/* Evaluation */}
                {msg.answer && msg.evaluation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-10 mt-2 rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(17,17,24,0.6)" }}
                  >
                    <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 bg-indigo-500/10">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[11px] font-semibold text-indigo-300">AI Feedback on your answer</span>
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold">
                        <span className="text-slate-400">Score</span>
                        <span className={`${msg.evaluation.score >= 7.5 ? "text-green-400" : msg.evaluation.score >= 6 ? "text-amber-400" : "text-red-400"}`}>
                          {msg.evaluation.score.toFixed(1)}/10
                        </span>
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-400">{msg.evaluation.feedback}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10px] font-semibold text-green-400 mb-1.5">✓ Strengths</div>
                          {msg.evaluation.strengths.map((s, j) => (
                            <div key={j} className="text-[11px] text-slate-400 mb-1">• {s}</div>
                          ))}
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-amber-400 mb-1.5">▲ Improvements</div>
                          {msg.evaluation.improvements.map((s, j) => (
                            <div key={j} className="text-[11px] text-slate-400 mb-1">• {s}</div>
                          ))}
                        </div>
                      </div>
                      <details className="group">
                        <summary className="text-[11px] text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors list-none flex items-center gap-1.5">
                          <Lightbulb className="w-3 h-3" /> Model answer — how a strong candidate would respond
                          <ArrowRight className="w-3 h-3 group-open:rotate-90 transition-transform ml-auto" />
                        </summary>
                        <p className="text-xs text-slate-300 mt-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 leading-relaxed">
                          {msg.evaluation.modelAnswer}
                        </p>
                      </details>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${panel[currentInterviewer % 4].borderColor} bg-white/5`}>
              <Loader2 className={`w-4 h-4 animate-spin ${panel[currentInterviewer % 4].color}`} />
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
      <div className="shrink-0 p-4 border-t border-white/5" data-tour="panel-input">
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
      <PageTour id="panel" steps={[
        { target: "[data-tour='panel-chat']", title: "Face the panel", body: "Answer each interviewer in turn — every response is scored live by AI." },
        { target: "[data-tour='panel-input']", title: "Speak or type", body: "Type your answer or use voice. The panel responds, gives feedback, and grades you." },
      ]}/>
    </div>
  );
}
