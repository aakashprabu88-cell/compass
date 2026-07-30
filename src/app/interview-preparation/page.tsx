"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Route, BookOpen, Code2, Building2, Target, Laptop,
  Mic, Users, MessageSquare, Trophy, BarChart3, Sparkles,
  GraduationCap, ChevronRight, ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

const MODULES = [
  { id: "aptitude", href: "/interview-preparation/aptitude", icon: Brain, title: "Aptitude Preparation", desc: "Quantitative aptitude, arithmetic, algebra, geometry, and more with theory, formulas, and practice.", color: "rgba(99,102,241,0.15)" },
  { id: "reasoning", href: "/interview-preparation/reasoning", icon: Route, title: "Logical Reasoning", desc: "Blood relations, seating arrangement, puzzles, syllogism, pattern recognition, and critical thinking.", color: "rgba(168,85,247,0.15)" },
  { id: "verbal", href: "/interview-preparation/verbal", icon: BookOpen, title: "Verbal Ability", desc: "Grammar, vocabulary, reading comprehension, sentence correction, and communication skills.", color: "rgba(6,182,212,0.15)" },
  { id: "technical", href: "/interview-preparation/technical", icon: Code2, title: "Technical Interview", desc: "Role-specific questions, coding problems, system design, and scenario-based questions.", color: "rgba(244,63,94,0.15)" },
  { id: "company", href: "/interview-preparation/company", icon: Building2, title: "Company Prep", desc: "Company-specific preparation for Google, Amazon, Microsoft, TCS, Zoho, and more.", color: "rgba(16,185,129,0.15)" },
  { id: "skills", href: "/interview-preparation/skills", icon: Target, title: "Skill-Based Practice", desc: "Practice by skill — React, Python, Java, SQL, AWS, System Design, and 100+ more.", color: "rgba(245,158,11,0.15)" },
  { id: "coding", href: "/interview-preparation/coding", icon: Laptop, title: "AI Coding Playground", desc: "Live code editor with AI feedback, time complexity analysis, and execution animation.", color: "rgba(99,102,241,0.15)" },
  { id: "mock-interview", href: "/interview-preparation/mock-interview", icon: Mic, title: "AI Mock Interview", desc: "Real interview simulation with voice, camera, and AI evaluation across all round types.", color: "rgba(168,85,247,0.15)" },
  { id: "behavioral", href: "/interview-preparation/behavioral", icon: Users, title: "Behavioral Interview", desc: "STAR method, leadership, conflict resolution, and AI-generated personalized answers.", color: "rgba(6,182,212,0.15)" },
  { id: "hr", href: "/interview-preparation/hr", icon: MessageSquare, title: "HR Interview", desc: "Common HR questions, confidence evaluation, professionalism, and improvement tips.", color: "rgba(244,63,94,0.15)" },
  { id: "challenges", href: "/interview-preparation/challenges", icon: Trophy, title: "Coding Challenges", desc: "Daily, weekly, and company challenges with leaderboards, streaks, and rewards.", color: "rgba(16,185,129,0.15)" },
  { id: "analytics", href: "/interview-preparation/analytics", icon: BarChart3, title: "Smart Analytics", desc: "Track accuracy, speed, weak areas, interview readiness, and placement probability.", color: "rgba(245,158,11,0.15)" },
  { id: "mentor", href: "/interview-preparation/mentor", icon: Sparkles, title: "AI Mentor", desc: "Your personal career mentor that remembers your goals, weaknesses, and learning patterns.", color: "rgba(99,102,241,0.15)" },
];

const QUICK_STATS = [
  { label: "Aptitude Topics", value: "18+", color: "text-indigo-400" },
  { label: "Practice Questions", value: "1000+", color: "text-purple-400" },
  { label: "Supported Companies", value: "100+", color: "text-emerald-400" },
  { label: "Mock Interviews", value: "Unlimited", color: "text-amber-400" },
];

export default function InterviewPreparationPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ requireOnboarded: true });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">Interview Preparation</h1>
            <p className="text-slate-400 text-sm mb-8">Everything you need to crack your next interview</p>
          </motion.div>

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

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((mod, i) => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={mod.href}
                  className="block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all h-full group"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: mod.color }}>
                      <mod.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{mod.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
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
