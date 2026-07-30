"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Route, GitBranch, Grid3X3, Hash, Puzzle, Compass, Braces, Brain, Eye, Clock, Calendar, Box, Dice1 as Dice, Image, FileText, Lightbulb, Target, ChevronRight, BookOpen } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const TOPICS = [
  { id: "blood-relations", icon: GitBranch, title: "Blood Relations", desc: "Family trees, relationships, and coded relations.", color: "rgba(99,102,241,0.15)" },
  { id: "seating-arrangement", icon: Grid3X3, title: "Seating Arrangement", desc: "Linear, circular, and complex seating puzzles.", color: "rgba(168,85,247,0.15)" },
  { id: "coding-decoding", icon: Braces, title: "Coding-Decoding", desc: "Letter shifting, symbol coding, and pattern decoding.", color: "rgba(6,182,212,0.15)" },
  { id: "number-series", icon: Hash, title: "Number Series", desc: "Arithmetic, geometric, and special series patterns.", color: "rgba(244,63,94,0.15)" },
  { id: "letter-series", icon: BookOpen, title: "Letter Series", desc: "Alphabet patterns, skipping, and cyclic series.", color: "rgba(16,185,129,0.15)" },
  { id: "puzzles", icon: Puzzle, title: "Puzzle Solving", desc: "Analytical puzzles, grid puzzles, and logic grids.", color: "rgba(245,158,11,0.15)" },
  { id: "directions", icon: Compass, title: "Directions", desc: "Direction sense, distance, and displacement problems.", color: "rgba(99,102,241,0.15)" },
  { id: "syllogism", icon: Brain, title: "Syllogism", desc: "Statement-conclusion, Venn diagrams, and logical deductions.", color: "rgba(168,85,247,0.15)" },
  { id: "analytical", icon: Lightbulb, title: "Analytical Reasoning", desc: "Complex reasoning, conditionals, and multi-step logic.", color: "rgba(6,182,212,0.15)" },
  { id: "critical-thinking", icon: Target, title: "Critical Thinking", desc: "Argument analysis, assumptions, and conclusions.", color: "rgba(244,63,94,0.15)" },
  { id: "pattern-recognition", icon: Eye, title: "Pattern Recognition", desc: "Visual patterns, number patterns, and sequence prediction.", color: "rgba(16,185,129,0.15)" },
  { id: "clock", icon: Clock, title: "Clock Problems", desc: "Angles between hands, mirror images, and gain/loss.", color: "rgba(245,158,11,0.15)" },
  { id: "calendar", icon: Calendar, title: "Calendar Problems", desc: "Day finding, odd days, and leap year calculations.", color: "rgba(99,102,241,0.15)" },
  { id: "cubes", icon: Box, title: "Cubes & Cuboids", desc: "Colored cubes, painting, cutting, and stacking.", color: "rgba(168,85,247,0.15)" },
  { id: "dice", icon: Dice, title: "Dice Problems", desc: "Opposite faces, rotations, and dice configurations.", color: "rgba(6,182,212,0.15)" },
  { id: "mirror-images", icon: Image, title: "Mirror & Water Images", desc: "Reflection symmetry and visual transformation.", color: "rgba(244,63,94,0.15)" },
  { id: "paper-folding", icon: FileText, title: "Paper Folding", desc: "Folding patterns and punched hole visualization.", color: "rgba(16,185,129,0.15)" },
  { id: "statement-conclusion", icon: Route, title: "Statement & Conclusion", desc: "Drawing logical conclusions from given statements.", color: "rgba(245,158,11,0.15)" },
];

export default function ReasoningPage() {
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
        if (!data.onboarded) { router.push("/assessment"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("reasoning load", e); if (!cancelled) router.push("/"); }
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
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Logical Reasoning</h1>
                <p className="text-sm text-slate-400">Master logical thinking, puzzles, and analytical reasoning for competitive exams</p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOPICS.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
                <div className="group block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: topic.color }}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-sm">{topic.title}</h3>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-500">{topic.desc}</p>
                    </div>
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
