"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, GraduationCap, ExternalLink, Star, Clock, Users, CheckCircle, BookOpen, Briefcase, FileText, Building2, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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

interface Course {
  id: string; title: string; provider: string; url: string; category: string;
  skills: string[]; duration: string; level: string; rating: number;
  enrolled: string; description: string; certificate: boolean; matchScore: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
    });
    fetch("/api/courses").then(r => r.json()).then(d => {
      setCourses(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category)))];
  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/courses" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Free Courses for You</h1>
          <p className="text-slate-400 text-sm mb-6">AI-recommended courses based on your skill gaps and career goals</p>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="glass p-12 text-center">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No courses available</h3>
              <p className="text-sm text-slate-500">Complete your assessment to get personalized recommendations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(course => (
                <div key={course.id} className="glass p-5 glass-hover transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{course.category}</span>
                    <div className="flex items-center gap-1">
                      {course.certificate && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                      <span className="text-xs text-slate-500">{course.level}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{course.title}</h3>
                  <p className="text-xs text-indigo-400 mb-2">{course.provider}</p>
                  <p className="text-xs text-slate-400 mb-3 flex-1">{course.description}</p>
                  <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skills.slice(0, 4).map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{s}</span>
                    ))}
                    {course.skills.length > 4 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">+{course.skills.length - 4}</span>}
                  </div>
                  <a href={course.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-sm font-medium transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> Start Learning Free
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
