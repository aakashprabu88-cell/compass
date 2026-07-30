"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Star, Lightbulb, Target, Award, ChevronRight, BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

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
];

export default function BehavioralPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ requireOnboarded: true });
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <h1 className="text-2xl font-bold mb-1">Behavioral Interview Practice</h1>
          <p className="text-slate-400 text-sm mb-8">Master the STAR method with AI-powered feedback</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Questions */}
            <div className="space-y-3">
              {QUESTIONS.map((q, i) => (
                <motion.button
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedQ(i)}
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
            <div>
              {selectedQ !== null ? (
                <motion.div key={selectedQ} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/5 p-6" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">Tip: {QUESTIONS[selectedQ].tip}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{QUESTIONS[selectedQ].q}</h3>
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
                      <button onClick={() => setAnswer("")}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        Clear
                      </button>
                      <button
                        className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors font-medium">
                        Get AI Feedback
                      </button>
                    </div>
                  </div>
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
      </main>
    </div>
  );
}
