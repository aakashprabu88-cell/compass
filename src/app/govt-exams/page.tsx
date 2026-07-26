"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  LogOut,
  LayoutDashboard,
  Route,
  Briefcase,
  FileText,
  Building2,
  GraduationCap,
  Target,
  Shield,
  Award,
  BookOpen,
  Clock,
  IndianRupee,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calculator,
  Calendar,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Trophy,
  GitBranch,
  Radar,
  Mic,
} from "lucide-react";
import {
  getAllExams,
  getExamById,
  calculateSuccessProbability,
  generatePrepTimeline,
  getFallbackCareers,
  compareGovtVsPrivate,
  type GovtExam,
  type PrepTimeline,
  type FallbackCareer,
  type GovtVsPrivate,
} from "@/lib/govt-exams";

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
  { href: "/mock-interview", label: "Mock Interview", icon: Mic },
  { href: "/resume-builder", label: "Resume Builder", icon: FileText },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  moderate: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400", label: "Moderate" },
  hard: { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-400", label: "Hard" },
  very_hard: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "Very Hard" },
};

const PRESTIGE_COLORS: Record<string, string> = {
  medium: "text-blue-400",
  high: "text-amber-400",
  very_high: "text-purple-400",
};

export default function GovtExamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<GovtExam[]>([]);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [selectedFallback, setSelectedFallback] = useState<string | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<string>("IAS / Civil Services");
  const [showComparison, setShowComparison] = useState(false);

  const [calcEducation, setCalcEducation] = useState("graduation");
  const [calcPrepMonths, setCalcPrepMonths] = useState(6);
  const [calcAttempts, setCalcAttempts] = useState(1);
  const [calcExam, setCalcExam] = useState("upsc-cse");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setUser(d);
    });
    setExams(getAllExams());
    setLoading(false);
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const timelineData = useMemo(() => {
    if (!selectedTimeline) return [];
    const exam = getExamById(selectedTimeline);
    if (!exam) return [];
    return generatePrepTimeline(exam, 1);
  }, [selectedTimeline]);

  const fallbackData = useMemo(() => {
    if (!selectedFallback) return null;
    return getFallbackCareers(selectedFallback);
  }, [selectedFallback]);

  const comparisonData = useMemo(() => {
    return compareGovtVsPrivate(selectedComparison);
  }, [selectedComparison]);

  const successProb = useMemo(() => {
    return calculateSuccessProbability({
      education: calcEducation,
      prepMonths: calcPrepMonths,
      attempts: calcAttempts,
      targetExam: calcExam,
    });
  }, [calcEducation, calcPrepMonths, calcAttempts, calcExam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.href === "/dashboard" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
              {user?.name?.[0]}
            </div>
            <div className="text-sm truncate">{user?.name}</div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Government Exam Pathway</h1>
              <p className="text-slate-400 text-sm">India&apos;s premier competitive exams — detailed intel, timelines, and strategy</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6 mb-8">
            {[
              { label: "Exams Tracked", value: exams.length, icon: BookOpen, color: "indigo" },
              { label: "Avg Success Rate", value: `${(exams.reduce((s, e) => s + e.successRate, 0) / exams.length).toFixed(1)}%`, icon: TrendingUp, color: "emerald" },
              { label: "Very Hard Exams", value: exams.filter(e => e.difficulty === "very_hard").length, icon: Award, color: "red" },
              { label: "PSU/Govt Roles", value: "50+", icon: Users, color: "amber" },
            ].map((stat, i) => (
              <div key={i} className="glass p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Exam Grid */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" /> All Government Exams
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map(exam => {
                const diff = DIFFICULTY_COLORS[exam.difficulty];
                const isExpanded = expandedExam === exam.id;
                return (
                  <div key={exam.id} className="glass glass-hover transition-all cursor-pointer" onClick={() => setExpandedExam(isExpanded ? null : exam.id)}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${diff.bg} ${diff.text}`}>{diff.label}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                      <h3 className="font-semibold text-sm mb-0.5">{exam.name}</h3>
                      <p className="text-[11px] text-slate-500 mb-2">{exam.conductingBody}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{exam.successRate}%</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{exam.salary.split("–")[0].trim()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />{exam.avgPrepTime}
                        <span className={`ml-auto ${PRESTIGE_COLORS[exam.prestige]}`}>{exam.prestige === "very_high" ? "★★★" : exam.prestige === "high" ? "★★" : "★"}</span>
                      </div>

                      {/* Success Rate Ring */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                            <circle
                              cx="24" cy="24" r="20" fill="none"
                              stroke={exam.successRate < 2 ? "#ef4444" : exam.successRate < 5 ? "#eab308" : "#22c55e"}
                              strokeWidth="4"
                              strokeDasharray={`${(exam.successRate / 100) * 125.6} 125.6`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{exam.successRate}%</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          <div className="font-medium text-slate-300">Success Rate</div>
                          <div>{exam.salary.split("(")[0].trim()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-5 pt-3 border-t border-white/5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{exam.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Pattern</span>
                            <span className="text-xs text-slate-300">{exam.pattern}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Eligibility</span>
                            <span className="text-xs text-slate-300">{exam.eligibility}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Attempts</span>
                            <span className="text-xs text-slate-300">{exam.attempts}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Age Limit</span>
                            <span className="text-xs text-slate-300">{exam.ageLimit}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Fee</span>
                            <span className="text-xs text-slate-300">{exam.examFee}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 w-20 shrink-0 font-medium uppercase">Salary</span>
                            <span className="text-xs text-slate-300">{exam.salary}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-[10px] text-slate-500 font-medium uppercase">Syllabus Highlights</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {exam.syllabus.map((s, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{s.length > 50 ? s.slice(0, 50) + "..." : s}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setSelectedTimeline(selectedTimeline === exam.id ? null : exam.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Prep Timeline
                          </button>
                          <button onClick={() => setSelectedFallback(selectedFallback === exam.id ? null : exam.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Fallbacks
                          </button>
                          <a href={exam.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Official
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Success Calculator */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Success Probability Calculator
            </h2>
            <div className="glass p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Education Level</label>
                  <select value={calcEducation} onChange={e => setCalcEducation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    <option value="12th">12th Pass (Higher Secondary)</option>
                    <option value="graduation">Graduation (Bachelor&apos;s Degree)</option>
                    <option value="engineering">Engineering (B.Tech/B.E)</option>
                    <option value="biology">Biology Sciences (B.Sc/Biology)</option>
                    <option value="post_graduation">Post Graduation (Master&apos;s)</option>
                    <option value="mba">MBA</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Preparation Months</label>
                  <input type="range" min="1" max="36" value={calcPrepMonths}
                    onChange={e => setCalcPrepMonths(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 mt-1" />
                  <span className="text-xs text-slate-400">{calcPrepMonths} months</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Previous Attempts</label>
                  <input type="number" min="1" max="20" value={calcAttempts}
                    onChange={e => setCalcAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Target Exam</label>
                  <select value={calcExam} onChange={e => setCalcExam(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {exams.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Probability Gauge */}
              <div className="flex items-center gap-8">
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="80" cy="80" r="70" fill="none"
                      stroke={successProb < 5 ? "#ef4444" : successProb < 15 ? "#eab308" : successProb < 30 ? "#22c55e" : "#6366f1"}
                      strokeWidth="10"
                      strokeDasharray={`${(successProb / 100) * 439.8} 439.8`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{successProb.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-500 uppercase">probability</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Analysis</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      {successProb < 3
                        ? "This exam has extremely low success rates. Intensive preparation over 12+ months is essential."
                        : successProb < 10
                        ? "Competitive odds. Consistent preparation with mock tests will significantly improve your chances."
                        : successProb < 25
                        ? "Reasonable probability with dedicated preparation. Focus on weak areas and timed practice."
                        : "Strong probability. Your preparation is on the right track — maintain consistency."}
                    </p>
                    <p>
                      <span className="text-white font-medium">{getExamById(calcExam)?.name}</span> requires an average of{" "}
                      <span className="text-indigo-400">{getExamById(calcExam)?.avgPrepTime}</span> of dedicated preparation.
                      Current success rate is <span className="text-amber-400">{getExamById(calcExam)?.successRate}%</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prep Timeline */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Preparation Timeline
            </h2>
            {!selectedTimeline ? (
              <div className="glass p-8 text-center">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Click &quot;Prep Timeline&quot; on any exam card above to view a month-by-month study plan</p>
              </div>
            ) : (
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold">{getExamById(selectedTimeline)?.name} — Preparation Timeline</h3>
                  <button onClick={() => setSelectedTimeline(null)} className="text-xs text-slate-500 hover:text-white">Close</button>
                </div>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/5" />
                  <div className="space-y-6">
                    {timelineData.map((phase, idx) => (
                      <div key={idx} className="relative flex gap-4 pl-2">
                        {/* Node */}
                        <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          phase.milestone
                            ? "bg-indigo-500/20 border-indigo-500"
                            : "bg-white/5 border-white/10"
                        }`}>
                          <span className="text-[10px] font-bold text-indigo-400">{phase.month}</span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-semibold">{phase.title}</h4>
                            {phase.milestone && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Milestone</span>
                            )}
                          </div>
                          <ul className="space-y-1">
                            {phase.tasks.map((task, ti) => (
                              <li key={ti} className="text-xs text-slate-400 flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Fallback Mapper */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-amber-400" /> Fallback Career Mapper
            </h2>
            <p className="text-xs text-slate-500 mb-4">If I don&apos;t clear this exam — what else can I do? Alternative careers based on similar skills and preparation.</p>
            {!selectedFallback ? (
              <div className="glass p-8 text-center">
                <ArrowRight className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Click &quot;Fallbacks&quot; on any exam card above to explore alternative career paths</p>
              </div>
            ) : fallbackData && (
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold">{fallbackData.fromExam} — Alternative Paths</h3>
                  <button onClick={() => setSelectedFallback(null)} className="text-xs text-slate-500 hover:text-white">Close</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fallbackData.alternatives.map((alt, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-amber-500/20 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </div>
                        <h4 className="text-sm font-semibold">{alt.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{alt.reason}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{alt.salary}</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          alt.difficulty === "Very Hard" ? "bg-red-500/10 text-red-400" :
                          alt.difficulty === "Hard" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-green-500/10 text-green-400"
                        }`}>{alt.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Govt vs Private Comparison */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" /> Government vs Private Sector
            </h2>
            <div className="glass p-6">
              <div className="flex items-center gap-4 mb-5">
                <label className="text-xs text-slate-500 font-medium">Compare for role:</label>
                <select value={selectedComparison} onChange={e => { setSelectedComparison(e.target.value); setShowComparison(true); }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                  <option value="IAS / Civil Services">IAS / Civil Services</option>
                  <option value="Banking (PO/Clerk)">Banking (PO/Clerk)</option>
                  <option value="Engineer (RRB/SSC)">Engineer (RRB/SSC)</option>
                  <option value="General">General Comparison</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4 w-1/4">Category</th>
                      <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4 w-1/3">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-400" /> Government</span>
                      </th>
                      <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4 w-1/3">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-blue-400" /> Private</span>
                      </th>
                      <th className="text-left text-xs text-slate-500 font-medium pb-3 w-1/6">Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-sm font-medium text-slate-300 pr-4">{row.category}</td>
                        <td className="py-3 text-xs text-slate-400 pr-4">{row.govt}</td>
                        <td className="py-3 text-xs text-slate-400 pr-4">{row.private}</td>
                        <td className="py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            row.winner === "government"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : row.winner === "private"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}>
                            {row.winner === "government" ? "Govt" : row.winner === "private" ? "Private" : "Tie"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <div className="text-lg font-bold text-green-400">
                    {comparisonData.filter(r => r.winner === "government").length}
                  </div>
                  <div className="text-[10px] text-slate-500">Government Wins</div>
                </div>
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <div className="text-lg font-bold text-blue-400">
                    {comparisonData.filter(r => r.winner === "private").length}
                  </div>
                  <div className="text-[10px] text-slate-500">Private Wins</div>
                </div>
                <div className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <div className="text-lg font-bold text-slate-400">
                    {comparisonData.filter(r => r.winner === "tie").length}
                  </div>
                  <div className="text-[10px] text-slate-500">Ties</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
