"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Compass,
  LogOut,
  LayoutDashboard,
  Route,
  Target,
  Briefcase,
  FileText,
  GraduationCap,
  Building2,
  Users,
  Zap,
  GitBranch,
  Shield,
  Radar,
  IndianRupee,
  ChevronRight,
  ChevronDown,
  Clock,
  Star,
  BookOpen,
  Code,
  CheckCircle,
  ExternalLink,
  Award,
  Timer,
  AlertCircle,
  Lightbulb,
  Brain,
  MessageSquare,
  Terminal,
  Mic,
} from "lucide-react";
import {
  COMPANY_DATABASE,
  getCompanyById,
  getCompanyReadiness,
} from "@/lib/company-prep";

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
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

const DEFAULT_SKILLS = ["JavaScript", "Python", "React", "Node.js", "SQL", "Java"];

export default function CompanyPrepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [expandedBehavioral, setExpandedBehavioral] = useState<number | null>(null);
  const [expandedHr, setExpandedHr] = useState<number | null>(null);
  const [expandedCoding, setExpandedCoding] = useState<number | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>(DEFAULT_SKILLS);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          router.push("/login");
          return;
        }
        if (d.assessment?.skills?.length) {
          setUserSkills(d.assessment.skills);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const selectedCompany = selectedId ? getCompanyById(selectedId) : null;
  const readiness = selectedId ? getCompanyReadiness(selectedId, userSkills) : null;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 40) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getDifficultyColor = (diff: string) => {
    const d = diff.toLowerCase();
    if (d.includes("hard")) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (d.includes("medium")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const getOutcomeColor = (outcome: string) => {
    if (outcome.toLowerCase() === "selected") return "text-emerald-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <aside
        className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto"
        style={{ background: "rgba(17,17,24,0.5)" }}
      >
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.href === "/company-prep"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {!selectedCompany ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <Target className="w-6 h-6 text-indigo-400" />
                <h1 className="text-2xl font-bold">Company Prep</h1>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Prepare for interviews at top companies with detailed prep guides, solved questions, and readiness tracking
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMPANY_DATABASE.map((company) => {
                  const companyReadiness = getCompanyReadiness(company.id, userSkills);
                  return (
                    <div
                      key={company.id}
                      className="glass p-5 glass-hover transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedId(company.id);
                        setExpandedRound(null);
                        setExpandedBehavioral(null);
                        setExpandedHr(null);
                        setExpandedCoding(null);
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-xl font-bold text-indigo-400">
                          {company.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-indigo-400 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-xs text-slate-500">{company.industry}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          {company.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {company.prepTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {company.size}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {company.techStack.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            {t}
                          </span>
                        ))}
                        {company.techStack.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">
                            +{company.techStack.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                companyReadiness.score >= 70
                                  ? "bg-emerald-400"
                                  : companyReadiness.score >= 40
                                    ? "bg-amber-400"
                                    : "bg-red-400"
                              }`}
                              style={{ width: `${companyReadiness.score}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {companyReadiness.score}% ready
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to all companies
              </button>

              <div className="glass p-6 mb-6">
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-3xl font-bold text-indigo-400 border border-indigo-500/20">
                    {selectedCompany.logo}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">{selectedCompany.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400" />
                        {selectedCompany.rating} rating
                      </span>
                      <span>{selectedCompany.industry}</span>
                      <span>{selectedCompany.size} employees</span>
                      <span>{selectedCompany.headquarters}</span>
                    </div>
                    <p className="text-sm text-slate-400">{selectedCompany.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass p-4 text-center">
                  <div className="text-xs text-slate-500 uppercase mb-1">Avg Salary</div>
                  <div className="font-semibold text-sm">{selectedCompany.avgSalary}</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-slate-500 uppercase mb-1">Prep Time</div>
                  <div className="font-semibold text-sm">{selectedCompany.prepTime}</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-slate-500 uppercase mb-1">Interview Rounds</div>
                  <div className="font-semibold text-sm">{selectedCompany.interviewRounds.length}</div>
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.techStack.map((t) => {
                    const isMatched = readiness?.matchedTech.includes(t);
                    const isMissing = readiness?.missingTech.includes(t);
                    return (
                      <span
                        key={t}
                        className={`text-xs px-2.5 py-1 rounded-lg border ${
                          isMatched
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : isMissing
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-white/5 text-slate-400 border-white/5"
                        }`}
                      >
                        {isMatched && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {isMissing && <AlertCircle className="w-3 h-3 inline mr-1" />}
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Hiring Process</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCompany.hiringProcess.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] text-indigo-400 font-mono">{i + 1}</span>
                        <span className="text-xs text-slate-300">{step}</span>
                      </div>
                      {i < selectedCompany.hiringProcess.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {readiness && (
                <div className={`glass p-5 mb-6 border ${getScoreBg(readiness.score)}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <h2 className="font-semibold text-sm">Readiness Score</h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                          strokeDasharray={`${readiness.score * 2.64} ${264 - readiness.score * 2.64}`}
                          strokeLinecap="round"
                          className={getScoreColor(readiness.score)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-bold ${getScoreColor(readiness.score)}`}>
                          {readiness.score}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase mb-1">Matched Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {readiness.matchedTech.length > 0 ? (
                              readiness.matchedTech.map((t) => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">None</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase mb-1">Missing Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {readiness.missingTech.length > 0 ? (
                              readiness.missingTech.map((t) => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Coding Patterns</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.codingPatterns.map((p) => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">OA Pattern</h2>
                </div>
                <div className="space-y-2">
                  {selectedCompany.oaPattern.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-amber-400 mt-1"><ChevronRight className="w-3 h-3" /></span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Interview Rounds</h2>
                </div>
                <div className="space-y-2">
                  {selectedCompany.interviewRounds.map((round, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedRound(expandedRound === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-mono text-indigo-400">
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{round.name}</div>
                            <div className="text-xs text-slate-500">{round.duration} · {round.difficulty}</div>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedRound === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedRound === i && (
                        <div className="px-4 pb-4 border-t border-white/5">
                          <p className="text-sm text-slate-400 mt-3 mb-3">{round.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getDifficultyColor(round.difficulty)}`}>{round.difficulty}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{round.duration}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tips</div>
                          <div className="space-y-1">
                            {round.tips.map((tip, ti) => (
                              <div key={ti} className="flex items-start gap-2 text-xs text-slate-400">
                                <CheckCircle className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Behavioral Questions with Solved Answers</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {selectedCompany.behavioralQuestions.length} questions
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedCompany.behavioralQuestions.map((qa, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedBehavioral(expandedBehavioral === i ? null : i)}
                        className="w-full flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-slate-200">{qa.question}</div>
                          <div className="text-[10px] text-indigo-400 mt-1">Click to view solved answer</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 mt-1 ${expandedBehavioral === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedBehavioral === i && (
                        <div className="px-4 pb-4 border-t border-white/5">
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Solved Answer
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{qa.answer}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-amber-400 uppercase mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Pro Tips
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <p className="text-xs text-slate-400">{qa.tips}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">HR Questions with Solved Answers</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {selectedCompany.hrQuestions.length} questions
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedCompany.hrQuestions.map((qa, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedHr(expandedHr === i ? null : i)}
                        className="w-full flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-slate-200">{qa.question}</div>
                          <div className="text-[10px] text-amber-400 mt-1">Click to view solved answer</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 mt-1 ${expandedHr === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedHr === i && (
                        <div className="px-4 pb-4 border-t border-white/5">
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Solved Answer
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{qa.answer}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-amber-400 uppercase mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Pro Tips
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <p className="text-xs text-slate-400">{qa.tips}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-semibold text-sm">Frequently Asked Coding Questions with Solutions</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedCompany.codingQuestions.length} problems
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedCompany.codingQuestions.map((cq, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedCoding(expandedCoding === i ? null : i)}
                        className="w-full flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Code className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-slate-200">{cq.problem}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getDifficultyColor(cq.difficulty)}`}>{cq.difficulty}</span>
                            <span className="text-[10px] text-emerald-400">Click to view solution</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 mt-1 ${expandedCoding === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedCoding === i && (
                        <div className="px-4 pb-4 border-t border-white/5">
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-indigo-400 uppercase mb-2 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Approach
                            </div>
                            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                              <p className="text-sm text-slate-300">{cq.approach}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                              <Code className="w-3 h-3" /> Solution
                            </div>
                            <pre className="p-4 rounded-xl bg-[#0d1117] border border-white/5 overflow-x-auto text-xs">
                              <code className="text-slate-300 font-mono leading-relaxed">{cq.solution}</code>
                            </pre>
                          </div>
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-amber-400 uppercase mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Complexity
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <p className="text-xs text-slate-400 font-mono">{cq.complexity}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedCompany.recentExperiences.length > 0 && (
                <div className="glass p-5 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <h2 className="font-semibold text-sm">Recent Interview Experiences</h2>
                  </div>
                  <div className="space-y-3">
                    {selectedCompany.recentExperiences.map((exp, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{exp.role}</span>
                            <span className="text-xs text-slate-500">{exp.date}</span>
                            <span className="text-xs text-slate-500">{exp.rounds} rounds</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getDifficultyColor(exp.difficulty)}`}>{exp.difficulty}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getOutcomeColor(exp.outcome) === "text-emerald-400" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{exp.outcome}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">{exp.tips}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">Preparation Tips</h2>
                </div>
                <div className="space-y-2">
                  {selectedCompany.preparationTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-semibold text-sm">Benefits</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.benefits.map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Culture</span>
                </div>
                <p className="text-sm text-slate-300">{selectedCompany.culture}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
