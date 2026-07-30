"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Search, ChevronRight, Star, BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

const SKILLS = [
  { name: "React", category: "Frontend", level: "Advanced", questions: "500+", projects: "50+" },
  { name: "Next.js", category: "Frontend", level: "Advanced", questions: "300+", projects: "30+" },
  { name: "TypeScript", category: "Language", level: "Intermediate", questions: "400+", projects: "40+" },
  { name: "JavaScript", category: "Language", level: "Advanced", questions: "600+", projects: "60+" },
  { name: "Python", category: "Language", level: "Advanced", questions: "500+", projects: "50+" },
  { name: "Java", category: "Language", level: "Intermediate", questions: "400+", projects: "35+" },
  { name: "C++", category: "Language", level: "Intermediate", questions: "350+", projects: "30+" },
  { name: "C", category: "Language", level: "Intermediate", questions: "300+", projects: "25+" },
  { name: "Node.js", category: "Backend", level: "Advanced", questions: "350+", projects: "35+" },
  { name: "Express", category: "Backend", level: "Intermediate", questions: "250+", projects: "25+" },
  { name: "MongoDB", category: "Database", level: "Intermediate", questions: "200+", projects: "20+" },
  { name: "SQL", category: "Database", level: "Advanced", questions: "400+", projects: "40+" },
  { name: "PostgreSQL", category: "Database", level: "Intermediate", questions: "250+", projects: "20+" },
  { name: "AWS", category: "Cloud", level: "Intermediate", questions: "300+", projects: "25+" },
  { name: "Docker", category: "DevOps", level: "Intermediate", questions: "200+", projects: "20+" },
  { name: "Kubernetes", category: "DevOps", level: "Beginner", questions: "150+", projects: "15+" },
  { name: "Spring Boot", category: "Backend", level: "Intermediate", questions: "300+", projects: "25+" },
  { name: "Flutter", category: "Mobile", level: "Intermediate", questions: "250+", projects: "20+" },
  { name: "Android", category: "Mobile", level: "Intermediate", questions: "300+", projects: "25+" },
  { name: "Swift", category: "Mobile", level: "Beginner", questions: "200+", projects: "15+" },
  { name: "Vue.js", category: "Frontend", level: "Intermediate", questions: "250+", projects: "20+" },
  { name: "Angular", category: "Frontend", level: "Intermediate", questions: "300+", projects: "25+" },
  { name: "Django", category: "Backend", level: "Intermediate", questions: "200+", projects: "20+" },
  { name: "Figma", category: "Design", level: "Intermediate", questions: "150+", projects: "15+" },
  { name: "Git", category: "DevOps", level: "Advanced", questions: "200+", projects: "50+" },
  { name: "Data Structures", category: "Core CS", level: "Advanced", questions: "500+", projects: "30+" },
  { name: "Algorithms", category: "Core CS", level: "Advanced", questions: "400+", projects: "25+" },
  { name: "System Design", category: "Core CS", level: "Intermediate", questions: "200+", projects: "20+" },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Language", "Database", "Cloud", "DevOps", "Mobile", "Design", "Core CS"];

export default function SkillsPracticePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ requireOnboarded: true });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const filtered = SKILLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <h1 className="text-2xl font-bold mb-1">Skill-Based Practice</h1>
          <p className="text-slate-400 text-sm mb-6">Practice by skill — React, Python, Java, SQL, AWS, and 100+ more</p>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill, i) => {
              const skillLink
                = skill.category === "Database" ? "/interview-preparation/company/oracle"
                : skill.category === "Frontend" ? "/interview-preparation/company/google"
                : skill.category === "Backend" ? "/interview-preparation/company/amazon"
                : skill.category === "Language" ? "/interview-preparation/company/microsoft"
                : skill.category === "Cloud" || skill.category === "DevOps" ? "/interview-preparation/company/amazon"
                : skill.category === "Mobile" ? "/interview-preparation/company/google"
                : skill.category === "Design" ? "/interview-preparation/company/apple"
                : skill.category === "Core CS" ? "/interview-preparation/company/microsoft"
                : "/interview-preparation/aptitude";
              return (
                <motion.div key={skill.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                  <Link href={skillLink}
                    className="block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">{skill.name}</h3>
                        <span className="text-[10px] text-slate-500">{skill.category}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        skill.level === "Advanced" ? "bg-green-500/10 text-green-400" :
                        skill.level === "Intermediate" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>{skill.level}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{skill.questions}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{skill.projects} projects</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
