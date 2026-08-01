"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, HelpCircle, CheckCircle2, AlertCircle, Lightbulb, ChevronRight, Send, Sparkles, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const HR_QUESTIONS = [
  { q: "Tell me about yourself.", tip: "Keep it professional — education, experience, skills, career goals. 60 seconds max." },
  { q: "Why do you want to work here?", tip: "Research the company. Mention specific projects, values, or culture that attract you." },
  { q: "What are your strengths and weaknesses?", tip: "Strengths backed by examples. Weakness with a clear improvement plan." },
  { q: "Where do you see yourself in 5 years?", tip: "Show ambition aligned with the company's growth trajectory." },
  { q: "Why should we hire you?", tip: "Summarize your unique value proposition — skills + experience + fit." },
  { q: "Tell me about a gap in your resume.", tip: "Be honest. Frame it positively — upskilling, travel, personal projects." },
  { q: "What are your salary expectations?", tip: "Provide a range based on market research. Deflect with interest in the role." },
  { q: "Do you have any questions for us?", tip: "Always say yes. Ask about growth, culture, team, or challenges." },
  { q: "How do you handle feedback?", tip: "Show openness and growth mindset. Give a real example of acting on feedback." },
  { q: "Why did you leave your last job?", tip: "Stay positive. Focus on growth, learning, or career progression." },
  { q: "Describe your ideal manager or work environment.", tip: "Be honest but flexible — mention what helps you do your best work without sounding demanding." },
  { q: "What motivates you to come to work every day?", tip: "Connect motivation to real moments — solving problems, learning, helping users, team wins." },
  { q: "Tell me about a time you disagreed with a manager.", tip: "Show respectful disagreement with data, then alignment once the decision was made." },
  { q: "How do you handle criticism?", tip: "Give a real example: how you separated the message from the emotion and improved." },
  { q: "What kind of work do you enjoy most?", tip: "Map it to the role — the tasks you love should be a large part of this job." },
  { q: "Describe a project you are proud of.", tip: "Structure it: problem, your role, actions, and a quantified result." },
  { q: "How do you prioritize when everything is urgent?", tip: "Explain a system — impact vs. effort, deadlines, and communication with stakeholders." },
  { q: "Do you prefer working alone or in a team?", tip: "Say both, with examples — then link it to what this role needs." },
  { q: "How do you stay updated in your field?", tip: "Name specific sources you actually use: courses, blogs, GitHub, communities, certifications." },
  { q: "Tell me about a time you went beyond your job description.", tip: "Show ownership and initiative with a real story and a measurable outcome." },
  { q: "How do you deal with a difficult coworker?", tip: "Focus on empathy, direct communication, and escalation only when needed." },
  { q: "What are you looking for in your next role?", tip: "Link your wants to what this company offers — growth, learning, impact, stability." },
  { q: "When can you join?", tip: "Give a realistic timeline and show flexibility; explain notice period if applicable." },
  { q: "Tell me about a time you missed a deadline.", tip: "Own the mistake, explain what you did to recover, and what changed afterward." },
  { q: "Why should we choose you over other candidates?", tip: "Don't trash others — differentiate with 2 specific strengths they need, with proof." },
  { q: "Tell me something not on your resume.", tip: "Share a passion, a side project, or a skill that reveals character — keep it relevant." },
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

const RED_FLAGS = [
  "Speaking negatively about past employers", "Being unprepared — no company research",
  "Arrogance or lack of humility", "Giving vague or rehearsed answers",
  "Not asking questions", "Interrupting the interviewer",
  "Poor body language (slouching, no eye contact)", "Being dishonest or exaggerating",
];

export default function HRInterviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [sessionQuestions, setSessionQuestions] = useState(() => shuffle(HR_QUESTIONS).slice(0, QUESTIONS_PER_SET));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("hr load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const newSet = () => {
    setSessionQuestions(shuffle(HR_QUESTIONS).slice(0, QUESTIONS_PER_SET));
    setSelectedQ(null);
    setAnswer("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div data-tour="prep-hr-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HR Interview</h1>
                <p className="text-sm text-slate-400">A fresh set of questions every visit — no repeats</p>
              </div>
            </div>
          </motion.div>

          {/* Red Flags Alert */}
          <motion.div data-tour="prep-hr-flags" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="p-4 rounded-xl border border-rose-500/20 mb-6" style={{ background: "rgba(244,63,94,0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-rose-400">Interview Red Flags</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
              {RED_FLAGS.map((flag, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-rose-400" />
                  {flag}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">{QUESTIONS_PER_SET} of {HR_QUESTIONS.length} questions in this set</span>
            <button onClick={newSet} className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              <RefreshCw className="w-3 h-3" /> New Set
            </button>
          </div>

          <div data-tour="prep-hr-list" className="space-y-2">
            {sessionQuestions.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <button onClick={() => setSelectedQ(selectedQ === i ? null : i)}
                  className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{q.q}</span>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform shrink-0 ${selectedQ === i ? "rotate-90" : ""}`} />
                      </div>
                      {selectedQ === i && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 pt-3 border-t border-white/5 space-y-3">
                          <div className="flex items-start gap-1.5">
                            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400">{q.tip}</p>
                          </div>
                          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Practice your answer..."
                            className="w-full h-20 p-3 rounded-lg bg-white/[0.02] border border-white/10 text-xs outline-none focus:border-rose-500/50 transition-all resize-none" />
                          <div className="flex justify-end">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-all">
                              <Sparkles className="w-3 h-3" /> Get Feedback
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <PageTour
          id="prep-hr"
          steps={[
            { target: "[data-tour='prep-hr-header']", title: "HR Interview", body: "Common HR rounds, from 'Tell me about yourself' to salary negotiation." },
            { target: "[data-tour='prep-hr-flags']", title: "Avoid the red flags", body: "Things candidates say that cost them the offer — learn to sidestep them." },
            { target: "[data-tour='prep-hr-list']", title: "Practice each answer", body: "Expand a question, draft your answer, and get AI feedback." },
          ]}
        />
      </main>
    </div>
  );
}
