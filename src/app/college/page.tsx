"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, AlertTriangle, CheckCircle2, TrendingUp, School, BarChart3, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import Sidebar from "@/components/Sidebar";

interface StudentData {
  id: string;
  name: string;
  assessment: {
    skills: string[];
    interests: string[];
    personality: Record<string, string>;
  } | null;
  paths: { matchScore: number; careerPath: { title: string; aiRisk: string } }[];
  skillGaps: { skillName: string; gap: number; priority: string }[];
}

export default function CollegeDashboardPage() {
  const { t, locale } = useLanguage();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) { setUser(data); }

        // Simulate college data (in real app, this would be an API call)
        // For demo, we generate mock data based on the seed
        const mockStudents: StudentData[] = [
          { id: "1", name: "Priya Sharma", assessment: { skills: ["Python", "Machine Learning"], interests: ["AI", "Data Science"], personality: { analytical: "high", creative: "low" } }, paths: [{ matchScore: 0.85, careerPath: { title: "AI/ML Engineer", aiRisk: "none" } }], skillGaps: [{ skillName: "Deep Learning", gap: 3, priority: "high" }] },
          { id: "2", name: "Rahul Verma", assessment: { skills: ["JavaScript", "React"], interests: ["Web Dev", "Design"], personality: { creative: "high", analytical: "medium" } }, paths: [{ matchScore: 0.78, careerPath: { title: "UX/UI Designer", aiRisk: "low" } }], skillGaps: [{ skillName: "Figma", gap: 2, priority: "medium" }] },
          { id: "3", name: "Anjali Patel", assessment: { skills: ["Communication", "Leadership"], interests: ["Business", "Management"], personality: { social: "high", leadership: "high" } }, paths: [{ matchScore: 0.72, careerPath: { title: "Product Manager", aiRisk: "low" } }], skillGaps: [{ skillName: "Data Analysis", gap: 4, priority: "high" }] },
          { id: "4", name: "Vikram Singh", assessment: { skills: ["Java", "SQL"], interests: ["Finance", "Technology"], personality: { analytical: "high" } }, paths: [{ matchScore: 0.68, careerPath: { title: "Financial Analyst", aiRisk: "high" } }], skillGaps: [{ skillName: "Python", gap: 3, priority: "high" }] },
          { id: "5", name: "Sneha Reddy", assessment: null, paths: [], skillGaps: [] },
          { id: "6", name: "Arjun Nair", assessment: { skills: ["Python", "Statistics"], interests: ["Research", "Healthcare"], personality: { investigative: "high" } }, paths: [{ matchScore: 0.81, careerPath: { title: "Data Scientist", aiRisk: "medium" } }], skillGaps: [{ skillName: "SQL", gap: 2, priority: "medium" }] },
          { id: "7", name: "Meera Iyer", assessment: { skills: ["Writing", "Research"], interests: ["Media", "Content"], personality: { artistic: "high" } }, paths: [{ matchScore: 0.65, careerPath: { title: "Journalist", aiRisk: "high" } }], skillGaps: [{ skillName: "Digital Marketing", gap: 3, priority: "high" }] },
          { id: "8", name: "Karthik Menon", assessment: { skills: ["CAD", "Physics"], interests: ["Engineering", "Manufacturing"], personality: { realistic: "high" } }, paths: [{ matchScore: 0.76, careerPath: { title: "Mechanical Engineer", aiRisk: "low" } }], skillGaps: [{ skillName: "3D Modeling", gap: 2, priority: "medium" }] },
        ];
        if (!cancelled) { setStudents(mockStudents); setLoading(false); }
      } catch { if (!cancelled) router.push("/"); }
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  const isHi = locale === "hi";

  const assessed = students.filter(s => s.assessment);
  const atRisk = assessed.filter(s => s.skillGaps.some(g => g.priority === "high"));
  const careerReady = assessed.filter(s => s.paths.some(p => p.matchScore > 0.7));

  // Skill frequency
  const skillFreq: Record<string, number> = {};
  assessed.forEach(s => {
    s.skillGaps.forEach(g => {
      skillFreq[g.skillName] = (skillFreq[g.skillName] || 0) + 1;
    });
  });
  const topSkillGaps = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Career distribution
  const careerDist: Record<string, number> = {};
  assessed.forEach(s => {
    s.paths.forEach(p => {
      careerDist[p.careerPath.title] = (careerDist[p.careerPath.title] || 0) + 1;
    });
  });

  // AI risk distribution
  const aiRiskDist: Record<string, number> = { safe: 0, risky: 0, critical: 0 };
  assessed.forEach(s => {
    s.paths.forEach(p => {
      if (p.careerPath.aiRisk === "none" || p.careerPath.aiRisk === "low") aiRiskDist.safe++;
      else if (p.careerPath.aiRisk === "medium") aiRiskDist.risky++;
      else aiRiskDist.critical++;
    });
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">{t.college.title}</h1>
            <p className="text-slate-400 text-sm mb-6">{t.college.subtitle}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: t.college.totalStudents, value: students.length, icon: Users, color: "text-indigo-400" },
              { label: t.college.assessed, value: assessed.length, icon: CheckCircle2, color: "text-green-400" },
              { label: t.college.atRisk, value: atRisk.length, icon: AlertTriangle, color: "text-red-400" },
              { label: t.college.ready, value: careerReady.length, icon: TrendingUp, color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Skill Gaps */}
            <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="font-semibold text-sm">{t.college.skillGaps}</h2>
              </div>
              <div className="space-y-3">
                {topSkillGaps.map(([skill, count]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill}</span>
                      <span className="text-amber-400">{count} {isHi ? "छात्र" : "students"}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${(count / assessed.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {topSkillGaps.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{t.college.noData}</p>}
              </div>
            </div>

            {/* Career Distribution */}
            <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h2 className="font-semibold text-sm">{t.college.careerDistribution}</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(careerDist).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([career, count]) => (
                  <div key={career}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{career}</span>
                      <span className="text-indigo-400">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${(count / assessed.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Risk Distribution */}
            <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h2 className="font-semibold text-sm">{t.college.aiRisk}</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-400">{t.shield.safe}</span>
                    <span>{aiRiskDist.safe}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${(aiRiskDist.safe / Math.max(assessed.length, 1)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-400">{t.shield.risky}</span>
                    <span>{aiRiskDist.risky}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${(aiRiskDist.risky / Math.max(assessed.length, 1)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-400">{t.shield.critical}</span>
                    <span>{aiRiskDist.critical}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${(aiRiskDist.critical / Math.max(assessed.length, 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Students At Risk */}
            <div className="p-5 rounded-2xl border border-red-500/20" style={{ background: "rgba(239,68,68,0.05)" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="font-semibold text-sm">{t.college.studentsAtRisk}</h2>
              </div>
              <div className="space-y-2">
                {atRisk.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-400">
                      {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs text-slate-500">
                        {s.skillGaps.filter(g => g.priority === "high").length} {isHi ? "उच्च प्राथमिकता कौशल अंतर" : "high-priority skill gaps"}
                      </div>
                    </div>
                    <div className="text-xs text-red-400 font-medium">
                      {s.paths[0]?.matchScore ? `${Math.round(s.paths[0].matchScore * 100)}%` : "—"}
                    </div>
                  </div>
                ))}
                {atRisk.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{isHi ? "कोई छात्र जोखिम में नहीं" : "No students at risk"}</p>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 rounded-2xl border border-indigo-500/20 text-center" style={{ background: "rgba(99,102,241,0.05)" }}>
            <School className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
            <h3 className="font-semibold mb-2">{isHi ? "अपने कॉलेज में Compass लाएं" : "Bring Compass to Your College"}</h3>
            <p className="text-sm text-slate-400 mb-4">{isHi ? "हर छात्र को करियर काउंसलर मिलना चाहिए।" : "Every student deserves a career counselor."}</p>
            <Link href="/aptitude-test" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all font-semibold text-sm">
              {isHi ? "छात्रों को असेसमेंट दिलाएं" : "Have Students Take Assessment"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
