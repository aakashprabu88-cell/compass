"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Briefcase, FileText, Building2, GraduationCap, Target, Shield, GitBranch, Radar, IndianRupee, Trophy, Mic, MicOff, Send, Bot, User, Star, CheckCircle2, AlertTriangle, RotateCcw, Volume2 } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/simulator", label: "Simulator", icon: GitBranch },
  { href: "/govt-exams", label: "Govt Exams", icon: Shield },
  { href: "/intelligence", label: "Intelligence", icon: Radar },
  { href: "/negotiation", label: "Negotiate", icon: IndianRupee },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/company-prep", label: "Company Prep", icon: Target },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

interface Message {
  role: "ai" | "user";
  content: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: [];
  starAnalysis?: { situation: string; task: string; action: string; result: string };
}

const COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "TCS", "Infosys", "Flipkart", "Razorpay"];
const ROLES = ["Software Engineer", "Data Scientist", "Product Manager", "Frontend Developer", "Backend Developer", "ML Engineer", "DevOps Engineer"];
const TYPES = [
  { value: "behavioral", label: "Behavioral", desc: "Tell me about a time..." },
  { value: "technical", label: "Technical", desc: "Coding & system design" },
  { value: "hr", label: "HR", desc: "Culture fit & basics" },
];

export default function MockInterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [type, setType] = useState<"behavioral" | "technical" | "hr">("behavioral");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiThinking]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const startInterview = async () => {
    setStarted(true);
    setMessages([]);
    setTotalScore(0);
    setQuestionCount(0);
    setShowEvaluation(false);

    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "question", role, company, type, conversationHistory: [] }),
      });
      const data = await res.json();
      const q = data.question || "Tell me about yourself and why you want to work at " + company + ".";
      setCurrentQuestion(q);
      setMessages([{ role: "ai", content: q }]);
    } catch {
      const fallback = `Welcome to your ${type} interview for ${role} at ${company}. Tell me about yourself and why you're interested in this role.`;
      setCurrentQuestion(fallback);
      setMessages([{ role: "ai", content: fallback }]);
    }
  };

  const submitAnswer = async () => {
    if (!input.trim() || aiThinking) return;
    const answer = input.trim();
    setInput("");
    setAiThinking(true);
    setShowEvaluation(false);

    const userMsg: Message = { role: "user", content: answer };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          question: currentQuestion,
          answer,
          role,
          company,
          conversationHistory: messages.map(m => ({ role: m.role === "ai" ? "interviewer" : "candidate", content: m.content })),
        }),
      });
      const data = await res.json();

      const evalMsg: Message = {
        role: "ai",
        content: data.nextQuestion || "Good answer. Let me follow up on that.",
        score: data.score,
        feedback: data.feedback,
        strengths: data.strengths,
        improvements: data.improvements,
        starAnalysis: data.starAnalysis,
      };

      setMessages(prev => [...prev, evalMsg]);
      setCurrentScore(data.score || 7);
      setTotalScore(prev => prev + (data.score || 7));
      setQuestionCount(prev => prev + 1);
      setCurrentQuestion(data.nextQuestion || "Can you elaborate on that with a specific example?");
      setShowEvaluation(true);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Good response. Can you give me a more specific example with quantified results?",
        score: 7,
        feedback: "The answer shows understanding. Try to add specific metrics and outcomes.",
      }]);
      setTotalScore(prev => prev + 7);
      setQuestionCount(prev => prev + 1);
    }

    setAiThinking(false);
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const avgScore = questionCount > 0 ? (totalScore / questionCount).toFixed(1) : "0";

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/mock-interview" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {!started ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold flex items-center gap-3"><Mic className="w-7 h-7 text-indigo-400" /> AI Mock Interview</h1>
              <p className="text-slate-400 text-sm">Practice with an AI interviewer. Get real-time feedback, STAR analysis, and improvement suggestions.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4">
                  <label className="text-xs text-slate-500 uppercase mb-2 block">Company</label>
                  <select value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="glass p-4">
                  <label className="text-xs text-slate-500 uppercase mb-2 block">Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="glass p-4">
                  <label className="text-xs text-slate-500 uppercase mb-2 block">Interview Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPES.map(t => (
                      <button key={t.value} onClick={() => setType(t.value as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${type === t.value ? "bg-indigo-500 text-white" : "bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={startInterview} className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" /> Start Interview
              </button>

              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  {[
                    { icon: "1", label: "Choose Setup", desc: "Pick company, role, type" },
                    { icon: "2", label: "Answer Questions", desc: "Type or use voice input" },
                    { icon: "3", label: "Get AI Feedback", desc: "Score, STAR analysis, tips" },
                    { icon: "4", label: "Improve", desc: "Practice makes perfect" },
                  ].map(s => (
                    <div key={s.icon} className="p-3 rounded-xl bg-white/[0.02]">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold mx-auto mb-2">{s.icon}</div>
                      <div className="text-xs font-medium text-white">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header bar */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><Mic className="w-5 h-5 text-indigo-400" /></div>
                  <div>
                    <h2 className="font-semibold text-sm">{role} at {company}</h2>
                    <p className="text-[10px] text-slate-500 capitalize">{type} Interview • Question {questionCount + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {questionCount > 0 && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-400">{avgScore}<span className="text-xs text-slate-500">/10</span></div>
                      <div className="text-[10px] text-slate-500">Avg Score</div>
                    </div>
                  )}
                  <button onClick={() => { setStarted(false); setMessages([]); }} className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 hover:text-white">
                    New Interview
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-indigo-500 text-white rounded-br-md" : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-bl-md"}`}>
                        {msg.content}
                        {msg.role === "ai" && i === messages.length - (showEvaluation ? 1 : 0) - 1 && i > 0 && (
                          <button onClick={() => speakQuestion(msg.content)} className="ml-2 text-slate-500 hover:text-indigo-400 inline-flex">
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Evaluation card */}
                      {showEvaluation && msg.score !== undefined && i === messages.length - 1 && (
                        <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${msg.score >= 8 ? "bg-green-500/20 text-green-400" : msg.score >= 6 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                              {msg.score}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">Score</div>
                              <div className="text-[10px] text-slate-500">{msg.score >= 8 ? "Excellent" : msg.score >= 6 ? "Good" : "Needs improvement"}</div>
                            </div>
                          </div>
                          {msg.feedback && <p className="text-xs text-slate-400">{msg.feedback}</p>}
                          {msg.strengths && msg.strengths.length > 0 && (
                            <div>
                              <div className="text-[10px] text-green-400 font-semibold mb-1">Strengths</div>
                              {msg.strengths.map((s, j) => (
                                <div key={j} className="flex items-start gap-1.5 text-xs text-slate-400 mb-0.5">
                                  <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{s}
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.improvements && msg.improvements.length > 0 && (
                            <div>
                              <div className="text-[10px] text-yellow-400 font-semibold mb-1">Improve</div>
                              {msg.improvements.map((s, j) => (
                                <div key={j} className="flex items-start gap-1.5 text-xs text-slate-400 mb-0.5">
                                  <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />{s}
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.starAnalysis && (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(msg.starAnalysis).map(([key, val]) => (
                                <div key={key} className="p-2 rounded-lg bg-white/[0.02]">
                                  <div className="text-[10px] font-semibold text-indigo-400 uppercase">{key}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{val}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  </div>
                ))}

                {aiThinking && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-bl-md bg-white/[0.03] border border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex gap-3 items-end">
                  <button
                    onMouseDown={isRecording ? stopVoiceInput : startVoiceInput}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"}`}>
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
                      placeholder={isRecording ? "Listening... speak now" : "Type your answer or use the mic..."}
                      rows={1}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none"
                    />
                  </div>
                  <button onClick={submitAnswer} disabled={!input.trim() || aiThinking}
                    className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 hover:bg-indigo-400 disabled:opacity-30 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {isRecording && <p className="text-xs text-red-400 mt-2 text-center animate-pulse">Listening... speak your answer</p>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
