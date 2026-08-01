"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ExternalLink, Star, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PageTour from "@/components/PageTour";

interface Course {
  id: string; title: string; provider: string; url: string; category: string;
  skills: string[]; duration: string; level: string; rating: number;
  enrolled: string; description: string; certificate: boolean; matchScore: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      try {
        const coursesRes = await fetch("/api/courses");
        if (coursesRes.ok) {
          const d = await coursesRes.json();
          if (!cancelled) setCourses(Array.isArray(d) ? d : []);
        }
      } catch (e) { console.error("courses load", e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [authLoading]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category)))];
  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div data-tour="courses-header">
              <h1 className="text-2xl font-bold mb-1">Free Courses for You</h1>
              <p className="text-slate-400 text-sm mb-6">AI-recommended courses based on your skill gaps and career goals</p>
            </div>

            {/* Category Filter */}
            <div data-tour="courses-filter" className="flex gap-2 mb-6 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-white/5 p-12 text-center" style={{ background: "rgba(17,17,24,0.5)" }}>
                <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No courses available</h3>
                <p className="text-sm text-slate-500">Complete your assessment to get personalized recommendations</p>
              </div>
            ) : (
              <div data-tour="courses-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(course => (
                  <div key={course.id} className="rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all flex flex-col" style={{ background: "rgba(17,17,24,0.5)" }}>
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
                      <span>{course.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{course.rating}</span>
                      <span>{course.enrolled}</span>
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

          <PageTour id="courses" steps={[
            { target: "[data-tour='courses-header']", title: "Free courses", body: "Curated free courses matched to your skill gaps and career path." },
            { target: "[data-tour='courses-filter']", title: "Filter by category", body: "Zero in on programming, design, business and more." },
            { target: "[data-tour='courses-grid']", title: "Start learning", body: "Every course is free and vetted — open it and start learning today." },
          ]} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
