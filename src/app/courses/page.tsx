"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ExternalLink, Star, Clock, Users, CheckCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) { router.push("/"); return; }
        const userData = await authRes.json();
        if (!userData || userData.error) { router.push("/"); return; }
        if (!userData.onboarded) { router.push("/dashboard"); return; }
        if (cancelled) return;
        setUser(userData);

        const coursesRes = await fetch("/api/courses");
        if (coursesRes.ok) {
          const d = await coursesRes.json();
          if (!cancelled) setCourses(Array.isArray(d) ? d : []);
        }
      } catch { if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category)))];
  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

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
    </ErrorBoundary>
  );
}
