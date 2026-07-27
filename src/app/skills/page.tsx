"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, BookOpen } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface SkillGap { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }

const SKILL_RESOURCES: Record<string, { free: string[]; paid: string[] }> = {
  "Python": { free: ["Python.org Tutorial", "freeCodeCamp Python"], paid: ["Udemy: 100 Days of Code"] },
  "Machine Learning": { free: ["Andrew Ng's ML Course", "Kaggle Learn"], paid: ["Coursera ML Specialization"] },
  "Deep Learning": { free: ["fast.ai", "deeplearning.ai"], paid: ["Udacity Nanodegree"] },
  "Data Analysis": { free: ["Kaggle Courses", "Google Data Analytics Certificate"], paid: ["DataCamp"] },
  "SQL": { free: ["SQLBolt", "Mode Analytics Tutorial"], paid: ["Coursera: SQL for Data Science"] },
  "Statistics": { free: ["Khan Academy", "StatQuest YouTube"], paid: ["edX Statistics Course"] },
  "Communication": { free: ["Toastmasters", "Coursera: Communication Skills"], paid: ["MasterClass"] },
  "Leadership": { free: ["Harvard Business Review", "TED Talks on Leadership"], paid: ["LinkedIn Learning"] },
  "Design Thinking": { free: ["IDEO Design Kit", "Stanford d.school"], paid: ["Coursera: Design Thinking"] },
  "Figma": { free: ["Figma Academy", "YouTube Tutorials"], paid: ["Udemy Figma Course"] },
  default: { free: ["Coursera", "edX", "Khan Academy", "YouTube"], paid: ["Udemy", "LinkedIn Learning"] },
};

export default function SkillsPage() {
  const router = useRouter();
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
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

        const skillsRes = await fetch("/api/skills");
        if (skillsRes.ok) {
          const d = await skillsRes.json();
          if (!cancelled) setGaps(Array.isArray(d) ? d : []);
        }
      } catch { if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const highGaps = gaps.filter(g => g.priority === "high");
  const medGaps = gaps.filter(g => g.priority === "medium");
  const lowGaps = gaps.filter(g => g.priority === "low");

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Skill Gap Analysis</h1>
            <p className="text-slate-400 text-sm mb-8">AI-identified gaps between your current skills and career requirements</p>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "High Priority", count: highGaps.length, color: "red", desc: "Critical skills to build now" },
                { label: "Medium Priority", count: medGaps.length, color: "yellow", desc: "Important for advancement" },
                { label: "Low Priority", count: lowGaps.length, color: "green", desc: "Nice-to-have skills" },
              ].map(s => (
                <div key={s.label} className="glass p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{s.label}</div>
                  <div className={`text-3xl font-bold text-${s.color}-400 mb-1`}>{s.count}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Skill Gaps List */}
            {gaps.length === 0 ? (
              <div className="glass p-12 text-center">
                <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No skill gaps identified</h3>
                <p className="text-sm text-slate-500">Complete your assessment to see skill gaps</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gaps.map(gap => {
                  const resources = SKILL_RESOURCES[gap.skillName] || SKILL_RESOURCES.default;
                  return (
                    <div key={gap.id} className="glass p-5 glass-hover transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{gap.skillName}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            gap.priority === "high" ? "bg-red-500/10 text-red-400" :
                            gap.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-green-500/10 text-green-400"
                          }`}>
                            {gap.priority} priority
                          </span>
                        </div>
                        <span className="text-sm font-mono text-slate-400">{gap.currentLevel}/10 → {gap.requiredLevel}/10</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 rounded-full bg-white/5 mb-4">
                        <div className="absolute h-full rounded-full bg-white/10" style={{ width: `${gap.requiredLevel * 10}%` }} />
                        <div className={`absolute h-full rounded-full transition-all ${
                          gap.priority === "high" ? "bg-red-500" : gap.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                        }`} style={{ width: `${gap.currentLevel * 10}%` }} />
                        <div className="absolute h-full w-0.5 bg-white/30" style={{ left: `${gap.requiredLevel * 10}%` }} />
                      </div>

                      {/* Learning Resources */}
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Free Resources
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {resources.free.map(r => (
                              <span key={r} className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Paid Resources</div>
                          <div className="flex flex-wrap gap-1.5">
                            {resources.paid.map(r => (
                              <span key={r} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5">{r}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
