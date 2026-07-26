"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, FileText, Users, MessageCircle, Lightbulb, ChevronDown, ChevronUp, Brain, Briefcase, Building2, GraduationCap, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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

interface Question {
  id: string; career: string; category: string; question: string;
  answer: string; tips: string[]; difficulty: string;
}

const DIFF_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

const CAT_COLORS: Record<string, string> = {
  Technical: "text-blue-400 bg-blue-500/10",
  Behavioral: "text-purple-400 bg-purple-500/10",
  "System Design": "text-amber-400 bg-amber-500/10",
  "Case Study": "text-cyan-400 bg-cyan-500/10",
  Portfolio: "text-pink-400 bg-pink-500/10",
  Design: "text-indigo-400 bg-indigo-500/10",
  Strategy: "text-orange-400 bg-orange-500/10",
  Scenario: "text-teal-400 bg-teal-500/10",
};

export default function InterviewPrepPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      fetch("/api/interview-prep").then(r => r.json()).then(data => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setQuestions(data.questions || []);
          setCategories(data.categories || []);
        }
        setLoading(false);
      });
    });
  }, [router]);

  const filtered = filter === "all" ? questions : questions.filter(q => q.category === filter);
  const allCategories = [...new Set(questions.map(q => q.category))];

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/interview-prep" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Interview Preparation</h1>
          <p className="text-slate-400 text-sm mb-6">Practice with curated questions for your target careers</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === "all" ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>All ({questions.length})</button>
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === cat ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
                {cat} ({questions.filter(q => q.category === cat).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="glass p-12 text-center">
              <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No questions available</h3>
              <p className="text-sm text-slate-500">Complete your career assessment to get personalized interview questions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(q => {
                const isOpen = expanded === q.id;
                return (
                  <div key={q.id} className="glass overflow-hidden glass-hover transition-all">
                    <button onClick={() => setExpanded(isOpen ? null : q.id)} className="w-full p-5 text-left flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{q.question}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${CAT_COLORS[q.category] || "text-slate-400 bg-slate-500/10"}`}>{q.category}</span>
                          <span className="text-xs text-slate-500">{q.career}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${DIFF_COLORS[q.difficulty] || ""}`}>{q.difficulty}</span>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-up">
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Sample Answer</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{q.answer}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3 text-amber-400" /> Pro Tips</h4>
                          <ul className="space-y-1.5">
                            {q.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                <span className="text-indigo-400 mt-0.5">•</span>{tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
