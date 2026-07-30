"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, TrendingUp, Percent, DollarSign, Clock, GitBranch, Dice1 as Dice, BookOpen, Target, Award, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

const TOPICS = [
  { id: "arithmetic", icon: Calculator, title: "Arithmetic", desc: "Basic arithmetic operations, fractions, decimals, and simplification techniques.", color: "rgba(99,102,241,0.15)" },
  { id: "percentage", icon: Percent, title: "Percentage", desc: "Percentage calculations, increase/decrease, successive percentages, and applications.", color: "rgba(168,85,247,0.15)" },
  { id: "profit-loss", icon: DollarSign, title: "Profit & Loss", desc: "Cost price, selling price, profit percentage, discounts, and marked price.", color: "rgba(6,182,212,0.15)" },
  { id: "time-work", icon: Clock, title: "Time & Work", desc: "Work efficiency, combined work, pipes & cisterns, and work-time problems.", color: "rgba(244,63,94,0.15)" },
  { id: "time-speed", icon: TrendingUp, title: "Time Speed Distance", desc: "Speed, distance, time, relative speed, trains, boats, and races.", color: "rgba(16,185,129,0.15)" },
  { id: "probability", icon: Dice, title: "Probability", desc: "Events, conditional probability, permutations, combinations, and expected value.", color: "rgba(245,158,11,0.15)" },
  { id: "permutation", icon: GitBranch, title: "Permutation & Combination", desc: "Arrangements, selections, factorial, and combinatorial problem solving.", color: "rgba(99,102,241,0.15)" },
  { id: "number-system", icon: Calculator, title: "Number System", desc: "Number types, divisibility, LCM, HCF, remainders, and number properties.", color: "rgba(168,85,247,0.15)" },
  { id: "ratio", icon: Calculator, title: "Ratio & Proportion", desc: "Ratios, proportions, direct/inverse variation, partnership, and mixtures.", color: "rgba(6,182,212,0.15)" },
  { id: "average", icon: Calculator, title: "Average", desc: "Mean, weighted average, combined groups, and average speed calculations.", color: "rgba(244,63,94,0.15)" },
  { id: "algebra", icon: Calculator, title: "Algebra", desc: "Equations, inequalities, polynomials, quadratic equations, and algebraic identities.", color: "rgba(16,185,129,0.15)" },
  { id: "geometry", icon: Calculator, title: "Geometry", desc: "Lines, angles, triangles, circles, polygons, coordinate geometry, and theorems.", color: "rgba(245,158,11,0.15)" },
  { id: "trigonometry", icon: Calculator, title: "Trigonometry", desc: "Trigonometric ratios, identities, heights & distances, and angle measurements.", color: "rgba(99,102,241,0.15)" },
  { id: "mensuration", icon: Calculator, title: "Mensuration", desc: "Area, volume, surface area of 2D and 3D shapes, and geometric measurements.", color: "rgba(168,85,247,0.15)" },
  { id: "data-interpretation", icon: Calculator, title: "Data Interpretation", desc: "Tables, bar graphs, pie charts, line graphs, and data analysis techniques.", color: "rgba(6,182,212,0.15)" },
  { id: "data-sufficiency", icon: Calculator, title: "Data Sufficiency", desc: "Determine if given data is sufficient to answer questions with logical reasoning.", color: "rgba(244,63,94,0.15)" },
  { id: "simplification", icon: BookOpen, title: "Simplification", desc: "BODMAS, approximation, surds, indices, and quick calculation techniques.", color: "rgba(16,185,129,0.15)" },
  { id: "pipes", icon: GitBranch, title: "Pipes & Cisterns", desc: "Fill and empty rates, combined pipes, leak problems, and capacity calculations.", color: "rgba(245,158,11,0.15)" },
];

const QUICK_STATS = [
  { label: "Topics", value: "18", icon: BookOpen, color: "text-indigo-400" },
  { label: "Practice Questions", value: "500+", icon: Target, color: "text-green-400" },
  { label: "Formulas", value: "200+", icon: Sparkles, color: "text-purple-400" },
  { label: "Company Questions", value: "50+", icon: Award, color: "text-amber-400" },
];

export default function AptitudePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ requireOnboarded: true });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Aptitude Preparation</h1>
              <p className="text-slate-400 text-sm">Master quantitative aptitude with theory, formulas, and practice questions</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {QUICK_STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={`/interview-preparation/aptitude/${topic.id}`}
                  className="block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all h-full"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: topic.color }}>
                      <topic.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{topic.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
