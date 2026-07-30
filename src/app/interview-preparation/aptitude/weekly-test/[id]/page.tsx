"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Award, CheckCircle2, XCircle, AlertTriangle, Loader2, ChevronRight, BarChart3 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const TESTS = [
  { id: 1, week: "Week 1", topic: "Percentage, Profit & Loss, Ratio", questionCount: 15, topicIds: ["percentage", "profit-loss", "ratio"] },
  { id: 2, week: "Week 2", topic: "Time & Work, Time Speed Distance, Probability", questionCount: 15, topicIds: ["time-work", "time-speed", "probability"] },
  { id: 3, week: "Week 3", topic: "Number System, Average, Algebra", questionCount: 20, topicIds: ["number-system", "average", "algebra"] },
  { id: 4, week: "Week 4", topic: "Geometry, Trigonometry, Mensuration", questionCount: 20, topicIds: ["geometry", "trigonometry", "mensuration"] },
  { id: 5, week: "Week 5", topic: "Data Interpretation, Data Sufficiency, Simplification", questionCount: 25, topicIds: ["data-interpretation", "data-sufficiency", "simplification"] },
];

const ALL_QUESTIONS: Record<string, { difficulty: string; question: string; options: string[]; correct: number; explanation: string }[]> = {
  percentage: [
    { difficulty: "Easy", question: "What is 20% of 450?", options: ["80", "90", "100", "110"], correct: 1, explanation: "20% of 450 = (20/100) × 450 = 90" },
    { difficulty: "Medium", question: "If A's salary is 20% less than B's, B's salary is what percent more than A's?", options: ["20%", "25%", "15%", "30%"], correct: 1, explanation: "Let B = 100, A = 80. (20/80) × 100 = 25%" },
    { difficulty: "Hard", question: "A number is first increased by 10% and then decreased by 10%. Net change?", options: ["0%", "1% increase", "1% decrease", "No change"], correct: 2, explanation: "10 + (-10) + (10 × -10)/100 = -1% = 1% decrease" },
  ],
  "profit-loss": [
    { difficulty: "Easy", question: "A shirt costing ₹500 is sold at ₹600. Profit percent?", options: ["16.67%", "20%", "25%", "10%"], correct: 1, explanation: "Profit = 100, CP = 500, Profit% = (100/500)×100 = 20%" },
    { difficulty: "Medium", question: "An item marked at ₹800 is sold at 15% discount. Selling price?", options: ["₹680", "₹720", "₹700", "₹760"], correct: 0, explanation: "Discount = 15% of 800 = 120, SP = 800 - 120 = 680" },
  ],
  ratio: [
    { difficulty: "Easy", question: "Divide 100 in ratio 2:3.", options: ["40:60", "30:70", "45:55", "50:50"], correct: 0, explanation: "Total parts = 5. First = (2/5)×100 = 40, Second = (3/5)×100 = 60" },
    { difficulty: "Medium", question: "If A:B = 2:3 and B:C = 4:5, find A:B:C.", options: ["2:3:4", "8:12:15", "6:9:10", "4:6:5"], correct: 1, explanation: "A:B = 2:3 = 8:12, B:C = 4:5 = 12:15. So A:B:C = 8:12:15" },
  ],
  "time-work": [
    { difficulty: "Easy", question: "A can do a work in 10 days, B in 15 days. Together in how many days?", options: ["5", "6", "8", "12"], correct: 1, explanation: "1/10 + 1/15 = 5/30 = 1/6. So 6 days." },
    { difficulty: "Medium", question: "A pipe fills a tank in 6 hours, another empties it in 9 hours. Both open together, time to fill?", options: ["12h", "15h", "18h", "21h"], correct: 2, explanation: "1/6 - 1/9 = 1/18. So 18 hours." },
  ],
  "time-speed": [
    { difficulty: "Easy", question: "A train travels 240 km in 4 hours. Speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, explanation: "Speed = 240/4 = 60 km/h" },
    { difficulty: "Medium", question: "A car covers 150 km at 50 km/h and next 100 km at 40 km/h. Average speed?", options: ["45.5", "46.15", "44", "48"], correct: 1, explanation: "Total time = 3 + 2.5 = 5.5h. Avg = 250/5.5 = 46.15 km/h" },
  ],
  probability: [
    { difficulty: "Easy", question: "A coin is tossed. Probability of heads?", options: ["0.25", "0.5", "0.75", "1"], correct: 1, explanation: "2 outcomes, heads is 1. P = 1/2 = 0.5" },
    { difficulty: "Medium", question: "A die is rolled. Probability of getting a number > 4?", options: ["1/6", "1/3", "1/2", "2/3"], correct: 1, explanation: "Numbers > 4: 5,6. So 2/6 = 1/3" },
  ],
  "number-system": [
    { difficulty: "Easy", question: "What is the LCM of 12 and 18?", options: ["24", "36", "48", "72"], correct: 1, explanation: "LCM(12,18) = 36" },
    { difficulty: "Medium", question: "What is the HCF of 48 and 72?", options: ["12", "18", "24", "36"], correct: 2, explanation: "HCF(48,72) = 24" },
  ],
  average: [
    { difficulty: "Easy", question: "Average of 5, 10, 15, 20, 25?", options: ["12", "14", "15", "18"], correct: 2, explanation: "Sum = 75, Count = 5, Average = 15" },
    { difficulty: "Medium", question: "Average of 8 numbers is 15. One number 20 is removed. New average?", options: ["14.29", "14.5", "15", "13.5"], correct: 0, explanation: "Sum = 120. New sum = 100, New count = 7. Average = 100/7 ≈ 14.29" },
  ],
  algebra: [
    { difficulty: "Easy", question: "Solve: 2x + 5 = 13", options: ["x=3", "x=4", "x=5", "x=6"], correct: 1, explanation: "2x = 8, x = 4" },
    { difficulty: "Medium", question: "If x² - 5x + 6 = 0, what are the roots?", options: ["1,6", "2,3", "-2,-3", "2,-3"], correct: 1, explanation: "(x-2)(x-3)=0, so x = 2 or 3" },
  ],
  geometry: [
    { difficulty: "Easy", question: "Sum of interior angles of a triangle?", options: ["180°", "270°", "360°", "90°"], correct: 0, explanation: "Sum of interior angles of any triangle = 180°" },
    { difficulty: "Medium", question: "Area of a circle with radius 7 cm?", options: ["144", "154", "164", "174"], correct: 1, explanation: "Area = πr² = (22/7) × 49 = 154 cm²" },
  ],
  trigonometry: [
    { difficulty: "Easy", question: "Value of sin 30°?", options: ["0", "1/2", "1/√2", "√3/2"], correct: 1, explanation: "sin 30° = 1/2" },
    { difficulty: "Medium", question: "Value of tan 45°?", options: ["0", "1", "√3", "1/√3"], correct: 1, explanation: "tan 45° = 1" },
  ],
  mensuration: [
    { difficulty: "Easy", question: "Volume of a cube with side 5 cm?", options: ["25", "125", "100", "150"], correct: 1, explanation: "Volume = side³ = 125 cm³" },
    { difficulty: "Medium", question: "Surface area of a sphere with radius 7 cm?", options: ["616", "516", "716", "416"], correct: 0, explanation: "SA = 4πr² = 4 × (22/7) × 49 = 616 cm²" },
  ],
  "data-interpretation": [
    { difficulty: "Easy", question: "A bar graph shows sales: Jan=50, Feb=60, Mar=70. Total sales?", options: ["160", "170", "180", "190"], correct: 2, explanation: "50 + 60 + 70 = 180" },
    { difficulty: "Medium", question: "In a pie chart, a sector is 90°. What percentage?", options: ["15%", "20%", "25%", "30%"], correct: 2, explanation: "90/360 × 100 = 25%" },
  ],
  "data-sufficiency": [
    { difficulty: "Easy", question: "Is x > 5? (1) x > 7 (2) x < 9", options: ["(1) alone", "(2) alone", "Both", "Neither"], correct: 0, explanation: "(1) alone tells us x > 7, so x > 5." },
    { difficulty: "Medium", question: "What is x? (1) x² = 25 (2) x > 0", options: ["(1) alone", "(2) alone", "Both", "Neither"], correct: 2, explanation: "From (1), x = ±5. Using (2), x = 5. Both needed." },
  ],
  simplification: [
    { difficulty: "Easy", question: "Simplify: √144 + √169", options: ["23", "25", "27", "29"], correct: 1, explanation: "12 + 13 = 25" },
    { difficulty: "Medium", question: "Simplify: (27)^(2/3)", options: ["3", "6", "9", "18"], correct: 2, explanation: "(3³)^(2/3) = 3² = 9" },
  ],
  pipes: [
    { difficulty: "Easy", question: "Pipe A fills a tank in 12 hours. Part filled in 3 hours?", options: ["1/4", "1/3", "1/2", "2/3"], correct: 0, explanation: "In 3 hours: 3/12 = 1/4" },
    { difficulty: "Medium", question: "Pipe A fills in 8h, Pipe B fills in 12h. Together?", options: ["4.8h", "5h", "6h", "7.2h"], correct: 0, explanation: "1/8 + 1/12 = 5/24. Time = 24/5 = 4.8h" },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WeeklyTestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const testId = Number(params.id);
  const test = TESTS.find(t => t.id === testId);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<{ id: number; difficulty: string; question: string; options: string[]; correct: number; explanation: string }[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("weekly test detail load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  useEffect(() => {
    if (!test) return;
    const pool: typeof questions = [];
    let qid = 0;
    for (const tid of test.topicIds) {
      const qs = ALL_QUESTIONS[tid] || [];
      for (const q of qs) {
        pool.push({ ...q, id: qid++ });
      }
    }
    setQuestions(shuffle(pool));
  }, [test]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!test) {
    return (
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Test not found</h2>
            <Link href="/interview-preparation/aptitude/weekly-test" className="text-indigo-400 hover:underline">Back to Weekly Tests</Link>
          </div>
        </main>
      </div>
    );
  }

  const correctCount = questions.filter(q => answers[q.id] === q.correct).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Link href="/interview-preparation/aptitude/weekly-test" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Weekly Tests
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{test.week} Test</h1>
                <p className="text-xs text-slate-400">{test.topic} — {questions.length} questions</p>
              </div>
              {!submitted && (
                <div className="text-right">
                  <div className="text-xs text-slate-500">Answered</div>
                  <div className="text-sm font-semibold">{answeredCount}/{questions.length}</div>
                </div>
              )}
              {submitted && (
                <div className="text-right">
                  <div className="text-xs text-slate-500">Score</div>
                  <div className="text-lg font-bold" style={{ color: score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444" }}>{score}%</div>
                </div>
              )}
            </div>
          </motion.div>

          {submitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border mb-6 flex items-center gap-3"
              style={{ background: score >= 70 ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)", borderColor: score >= 70 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)" }}>
              {score >= 70 ? <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" /> : <BarChart3 className="w-6 h-6 text-amber-400 shrink-0" />}
              <div className="text-sm">
                <span className="font-semibold">{correctCount}/{questions.length} correct</span>
                <span className="text-slate-400"> — {score >= 70 ? "Great job! Keep practicing." : score >= 40 ? "Good effort. Review the topics you missed." : "Keep studying and try again."}</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {questions.map((q, i) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.correct;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}
                  className={`p-5 rounded-2xl border transition-all ${
                    submitted
                      ? isCorrect ? "border-green-500/20" : selected !== undefined ? "border-red-500/20" : "border-white/5"
                      : "border-white/5 hover:border-white/10"
                  }`}
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xs font-bold text-indigo-400 mt-0.5 shrink-0">Q{i + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm">{q.question}</p>
                      <span className="text-[10px] text-slate-500">{q.difficulty}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => {
                      let optStyle = "border-white/10 hover:border-white/20";
                      if (submitted) {
                        if (oi === q.correct) optStyle = "border-green-500/30 bg-green-500/10 text-green-300";
                        else if (oi === selected && !isCorrect) optStyle = "border-red-500/30 bg-red-500/10 text-red-300";
                        else optStyle = "border-white/5 opacity-60";
                      } else if (selected === oi) {
                        optStyle = "border-indigo-500/30 bg-indigo-500/10";
                      }
                      return (
                        <button key={oi} onClick={() => { if (!submitted) setAnswers(p => ({ ...p, [q.id]: oi })); }}
                          disabled={submitted}
                          className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all ${optStyle}`}>
                          <span className="text-xs text-slate-500 mr-2">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-slate-400">{q.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 mb-12">
            <Link href="/interview-preparation/aptitude/weekly-test"
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Tests
            </Link>
            {!submitted ? (
              <button onClick={() => setSubmitted(true)} disabled={answeredCount === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold transition-all disabled:opacity-50">
                Submit Test <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all">
                Retry Test
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
