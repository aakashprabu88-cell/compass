"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Clock, BarChart3, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const MOCK_TESTS = [
  { id: 1, week: "Week 1", topic: "Percentage, Profit & Loss, Ratio", questions: 15, completed: true, score: "80%", date: "24 Jul" },
  { id: 2, week: "Week 2", topic: "Time & Work, Time Speed Distance, Probability", questions: 15, completed: false, score: null, date: "31 Jul" },
  { id: 3, week: "Week 3", topic: "Number System, Average, Algebra", questions: 20, completed: false, score: null, date: "7 Aug" },
  { id: 4, week: "Week 4", topic: "Geometry, Trigonometry, Mensuration", questions: 20, completed: false, score: null, date: "14 Aug" },
  { id: 5, week: "Week 5", topic: "Data Interpretation, Data Sufficiency, Simplification", questions: 25, completed: false, score: null, date: "21 Aug" },
];

export default function WeeklyTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("weekly test load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Link href="/interview-preparation/aptitude" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Aptitude
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Weekly Tests</h1>
                <p className="text-xs text-slate-400">Track your progress with timed weekly assessments</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            {MOCK_TESTS.map((test, i) => (
              <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className={`p-5 rounded-2xl border transition-all ${test.completed ? "border-green-500/20" : "border-white/5 hover:border-white/10"}`}
                  style={{ background: test.completed ? "rgba(16,185,129,0.03)" : "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {test.completed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                      <span className="font-semibold text-sm">{test.week}</span>
                    </div>
                    <span className="text-xs text-slate-500">{test.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{test.topic}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{test.questions} questions</span>
                    {test.completed ? (
                      <span className="text-sm font-bold text-green-400">{test.score}</span>
                    ) : (
                      <Link href={`/interview-preparation/aptitude/weekly-test/${test.id}`}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:underline">
                        Start Test <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
