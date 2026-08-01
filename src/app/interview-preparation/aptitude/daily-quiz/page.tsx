"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle2, AlertTriangle, Clock, RefreshCw, TrendingUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const QUESTIONS = [
  { q: "What is 15% of 300?", options: ["35", "40", "45", "50"], correct: 2, topic: "Percentage" },
  { q: "If a shirt costs ₹800 after a 20% discount, what was the original price?", options: ["₹960", "₹1000", "₹900", "₹850"], correct: 1, topic: "Profit & Loss" },
  { q: "A train 150m long passes a pole in 15 seconds. Find its speed in km/h.", options: ["36", "40", "45", "54"], correct: 0, topic: "Time Speed Distance" },
  { q: "If 15 workers can build a wall in 12 days, how many days will 20 workers take?", options: ["8", "9", "10", "16"], correct: 1, topic: "Time & Work" },
  { q: "What is the probability of getting an even number when rolling a fair die?", options: ["1/6", "1/3", "1/2", "2/3"], correct: 2, topic: "Probability" },
  { q: "Find the average of first 10 natural numbers.", options: ["5", "5.5", "6", "4.5"], correct: 1, topic: "Average" },
  { q: "If A:B = 2:3 and B:C = 4:5, find A:C.", options: ["8:15", "2:5", "8:12", "6:15"], correct: 0, topic: "Ratio" },
  { q: "Simplify: 25 + 5 × 3 - 4", options: ["76", "36", "86", "26"], correct: 1, topic: "Simplification" },
  { q: "What is the LCM of 12, 15, and 20?", options: ["30", "60", "120", "90"], correct: 1, topic: "Number System" },
  { q: "A sum doubles itself in 5 years at simple interest. Find the rate of interest.", options: ["10%", "15%", "20%", "25%"], correct: 2, topic: "Arithmetic" },
  { q: "What is 20% of 450?", options: ["80", "90", "100", "110"], correct: 1, topic: "Percentage" },
  { q: "A man sells an item for ₹900 at a 10% loss. What was his cost price?", options: ["₹990", "₹950", "₹1000", "₹1050"], correct: 2, topic: "Profit & Loss" },
  { q: "Two pipes fill a tank in 6 hours and 8 hours respectively. Together they take:", options: ["24/7 h", "7/24 h", "14 h", "48 h"], correct: 0, topic: "Pipes" },
  { q: "What is the probability of getting two heads when tossing two coins?", options: ["1/2", "1/4", "1/8", "3/4"], correct: 1, topic: "Probability" },
  { q: "The average of 5 numbers is 20. If one number 30 is removed, the new average is:", options: ["16.5", "17.5", "18", "19"], correct: 1, topic: "Average" },
  { q: "If 3:5 :: 9:x, find x.", options: ["12", "15", "18", "20"], correct: 1, topic: "Ratio" },
  { q: "Simplify: 18 + 6 × 4 - 12 ÷ 3", options: ["38", "30", "42", "46"], correct: 0, topic: "Simplification" },
  { q: "Find the HCF of 24, 36, and 48.", options: ["6", "8", "12", "24"], correct: 2, topic: "Number System" },
  { q: "What is the compound interest on ₹5000 at 10% per annum for 2 years?", options: ["₹1000", "₹1050", "₹1100", "₹1150"], correct: 1, topic: "Arithmetic" },
  { q: "A 120m train moving at 60 km/h crosses a 180m platform. Time taken:", options: ["15 s", "18 s", "20 s", "24 s"], correct: 1, topic: "Time Speed Distance" },
  { q: "A can finish a job in 12 days, B in 18 days. Working together, they finish in:", options: ["7.2 days", "7.5 days", "8 days", "9 days"], correct: 0, topic: "Time & Work" },
  { q: "A letter is picked from 'EDUCATION'. Probability it is a vowel:", options: ["4/9", "5/9", "1/2", "3/9"], correct: 1, topic: "Probability" },
  { q: "The ages of two brothers are in the ratio 2:3 and their sum is 50. The elder brother is:", options: ["20", "25", "30", "35"], correct: 2, topic: "Ages" },
  { q: "A boat goes 12 km/h downstream and 8 km/h upstream. Speed of the stream:", options: ["2 km/h", "3 km/h", "4 km/h", "5 km/h"], correct: 0, topic: "Boats" },
  { q: "What is 25% of 25% of 800?", options: ["40", "50", "60", "100"], correct: 1, topic: "Percentage" },
  { q: "A pen costing ₹500 is sold at a 20% gain. Selling price:", options: ["₹550", "₹580", "₹600", "₹620"], correct: 2, topic: "Profit & Loss" },
  { q: "In how many ways can 5 different books be arranged on a shelf?", options: ["25", "60", "120", "720"], correct: 2, topic: "Permutation" },
  { q: "Sum of interior angles of a hexagon:", options: ["540°", "600°", "720°", "900°"], correct: 2, topic: "Geometry" },
  { q: "Area of a circle with radius 7 cm:", options: ["144 cm²", "154 cm²", "164 cm²", "174 cm²"], correct: 1, topic: "Mensuration" },
  { q: "If 40% of a number is 120, the number is:", options: ["280", "300", "320", "360"], correct: 1, topic: "Percentage" },
];

const QUESTIONS_PER_QUIZ = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DailyQuizPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quiz, setQuiz] = useState(() => shuffle(QUESTIONS).slice(0, QUESTIONS_PER_QUIZ));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("daily quiz load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const newQuiz = () => {
    setQuiz(shuffle(QUESTIONS).slice(0, QUESTIONS_PER_QUIZ));
    setAnswers({});
    setSubmitted(false);
  };

  const score = submitted ? quiz.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0) : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Link href="/interview-preparation/aptitude" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Aptitude
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Daily Quiz</h1>
                <p className="text-xs text-slate-400">10 questions · fresh set every visit</p>
              </div>
            </div>
            {submitted && (
              <div className={`text-xl font-bold ${score >= 7 ? "text-green-400" : "text-amber-400"}`}>
                {score}/{quiz.length}
              </div>
            )}
          </motion.div>

          <div className="space-y-4">
            {quiz.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="p-4 rounded-xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-slate-500">Q{i + 1}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{q.topic}</span>
                </div>
                <p className="text-sm font-medium mb-3">{q.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    let border = "border-white/5 hover:border-white/10";
                    if (submitted) {
                      if (oi === q.correct) border = "border-green-500 bg-green-500/10";
                      else if (oi === answers[i] && oi !== q.correct) border = "border-red-500 bg-red-500/10";
                    } else if (answers[i] === oi) {
                      border = "border-indigo-500 bg-indigo-500/10";
                    }
                    return (
                      <button key={oi} onClick={() => !submitted && setAnswers(prev => ({ ...prev, [i]: oi }))}
                        disabled={submitted}
                        className={`p-2.5 rounded-lg text-xs text-left transition-all border ${border} ${submitted ? "cursor-default" : ""}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {!submitted ? (
            <motion.button onClick={() => setSubmitted(true)}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-sm transition-all">
              Submit Quiz
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mt-6 p-5 rounded-2xl border border-white/5 text-center" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className={`text-3xl font-bold mb-2 ${score >= 7 ? "text-green-400" : "text-amber-400"}`}>
                  {score >= 7 ? "Great Job! 🎯" : "Keep Practicing! 💪"}
                </div>
                <p className="text-sm text-slate-400 mb-4">You scored {score} out of {quiz.length}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={newQuiz}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> New Quiz
                  </button>
                  <Link href="/interview-preparation/aptitude/performance"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all">
                    <TrendingUp className="w-3.5 h-3.5" /> View Analytics
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
