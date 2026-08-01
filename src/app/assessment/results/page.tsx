"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Briefcase, Target, TrendingUp, AlertTriangle, ExternalLink, MapPin, Clock, DollarSign, CheckCircle, ArrowRight, Loader2, Compass, ChevronRight, GraduationCap, Zap, Users, Brain, ListChecks, Award } from "lucide-react";
import PageTour from "@/components/PageTour";

interface Job {
  id: string; title: string; company: string; location: string; city: string;
  type: string; salary: string; requiredSkills: string[]; description: string;
  url: string; applyUrl: string; postedDaysAgo: number; matchScore?: number;
  _isReal?: boolean;
}

interface PathData { id: string; matchScore: number; careerPath: { title: string; description: string; salaryMin: number; salaryMax: number; growthOutlook: string; aiRisk: string; }; }

interface SkillGapData { id: string; skillName: string; currentLevel: number; requiredLevel: number; gap: number; priority: string; }

interface Analysis {
  summary?: string;
  strengths?: string[];
  gaps?: { skill: string; current: string; howToImprove: string; priority: string }[];
  careerPaths?: { title: string; matchScore: number; reason: string; salaryRange: string; growthOutlook: string; aiRisk: string }[];
  recommendedJobs?: { title: string; company: string; location: string; salary: string; reason: string }[];
  actionPlan?: string[];
  _ai?: boolean;
}

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gaps, setGaps] = useState<SkillGapData[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paths" | "jobs" | "skills">("paths");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        const me = await meRes.json();
        if (!me || me.error) { router.push("/"); return; }
        if (!cancelled) setUser(me);

        const safeFetch = (url: string) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
        const [assessmentData, pathsData, jobsData, gapsData] = await Promise.all([
          fetch("/api/assessment").then(r => r.ok ? r.json() : null),
          safeFetch("/api/paths"),
          safeFetch("/api/jobs"),
          safeFetch("/api/skills"),
        ]);

        if (cancelled) return;
        setAssessment(assessmentData);
        setPaths(Array.isArray(pathsData) ? pathsData : []);
        setGaps(Array.isArray(gapsData) ? gapsData : []);

        if (jobsData) {
          const real = Array.isArray(jobsData.realJobs) ? jobsData.realJobs.map((j: any) => ({ ...j, _isReal: true })) : [];
          setJobs(real.slice(0, 9));
        }
      } catch (e) { console.error("load results", e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  // Deep personalized analysis (generated server-side from the user's real input)
  useEffect(() => {
    let cancelled = false;
    async function loadAnalysis() {
      try {
        const res = await fetch("/api/analysis");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setAnalysis(data);
        } else {
          const err = await res.json().catch(() => null);
          if (!cancelled) setAnalysisError(err?.error || "Analysis unavailable");
        }
      } catch {
        if (!cancelled) setAnalysisError("Analysis unavailable");
      }
      if (!cancelled) setAnalysisLoading(false);
    }
    if (!loading) loadAnalysis();
    return () => { cancelled = true; };
  }, [loading]);

  const parseSkills = () => {
    if (!assessment?.skills) return [];
    try { return JSON.parse(assessment.skills); } catch { return []; }
  };

  const skills = parseSkills();
  const topPath = paths[0];
  const avgMatch = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.matchScore, 0) / paths.length * 100) : 0;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#0a0a12]">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center animate-pulse">
        <Compass className="w-5 h-5 text-indigo-400" />
      </div>
      <p className="text-sm text-slate-500">Analyzing your profile...</p>
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a12] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        {/* Success Banner */}
        <div data-tour="results-banner" className="p-6 mb-8 rounded-2xl border border-emerald-500/20 relative overflow-hidden" style={{ background: "rgba(16,185,129,0.05)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]" style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
          <div className="flex items-start gap-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">Your profile is ready!</h1>
              <p className="text-sm text-slate-400 mb-4">We've analyzed your skills and found matching opportunities below.</p>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((s: string) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">{s}</span>
                ))}
                {skills.length > 8 && <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-500 text-xs">+{skills.length - 8}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div data-tour="results-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Top Match", value: topPath?.careerPath?.title?.split(" ").slice(0, 3).join(" ") || "—", icon: Target, color: "text-indigo-400" },
            { label: "Avg Match Score", value: `${avgMatch}%`, icon: TrendingUp, color: "text-emerald-400" },
            { label: "Jobs Found", value: `${jobs.length}`, icon: Briefcase, color: "text-amber-400" },
            { label: "Skill Gaps", value: `${gaps.filter(g => g.priority === "high").length}`, icon: AlertTriangle, color: "text-rose-400" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5" style={{ animation: `slideUp 0.5s ease-out ${0.1 + i * 0.08}s both` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Deep Personalized Analysis */}
        <div data-tour="results-analysis" className="mb-8 rounded-2xl border border-indigo-500/20 overflow-hidden" style={{ background: "rgba(15,15,30,0.6)" }}>
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Your Personalized Analysis</h2>
            {analysis?._ai && <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded ml-auto">AI Deep Analysis</span>}
          </div>

          {analysisLoading ? (
            <div className="flex items-center justify-center gap-3 py-10">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-500">Analyzing your skills, education & experience...</p>
            </div>
          ) : analysisError ? (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-slate-500">{analysisError}</p>
            </div>
          ) : analysis ? (
            <div className="p-5 space-y-5">
              {analysis.summary && (
                <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
              )}

              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><Award className="w-3.5 h-3.5 text-emerald-400" /> Your Strengths</div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.strengths.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.careerPaths && analysis.careerPaths.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><Target className="w-3.5 h-3.5 text-indigo-400" /> Why These Career Paths Fit You</div>
                  <div className="space-y-2">
                    {analysis.careerPaths.slice(0, 5).map((p, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{p.title}</span>
                          <span className="text-xs font-semibold text-emerald-400 shrink-0">{p.matchScore}%</span>
                        </div>
                        <p className="text-xs text-slate-400">{p.reason}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          {p.salaryRange && p.salaryRange !== "N/A" && <span className="text-[11px] text-slate-500 flex items-center gap-1"><DollarSign className="w-3 h-3" />{p.salaryRange}</span>}
                          {p.growthOutlook && <span className="text-[11px] text-slate-500 capitalize">{p.growthOutlook}</span>}
                          {p.aiRisk && <span className={`text-[11px] capitalize ${p.aiRisk === "low" ? "text-emerald-400" : p.aiRisk === "high" ? "text-rose-400" : "text-amber-400"}`}>AI Risk: {p.aiRisk}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.gaps && analysis.gaps.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Skills to Build</div>
                  <div className="space-y-2">
                    {analysis.gaps.slice(0, 4).map((g, i) => (
                      <div key={i} className="p-3 rounded-xl bg-rose-500/[0.03] border border-rose-500/10">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-medium text-white">{g.skill}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${g.priority === "high" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400"}`}>{g.priority}</span>
                        </div>
                        {g.current && <p className="text-xs text-slate-500">{g.current}</p>}
                        {g.howToImprove && <p className="text-xs text-slate-400 mt-0.5">→ {g.howToImprove}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.recommendedJobs && analysis.recommendedJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><Briefcase className="w-3.5 h-3.5 text-amber-400" /> Jobs That Fit You</div>
                  <div className="space-y-2">
                    {analysis.recommendedJobs.slice(0, 4).map((j, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-medium text-white">{j.title} <span className="text-slate-400 font-normal">@ {j.company}</span></span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                          {j.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>}
                          {j.salary && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{j.salary}</span>}
                        </div>
                        {j.reason && <p className="text-xs text-slate-400 mt-1">{j.reason}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.actionPlan && analysis.actionPlan.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><ListChecks className="w-3.5 h-3.5 text-indigo-400" /> Your Action Plan</div>
                  <ol className="space-y-1.5">
                    {analysis.actionPlan.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
          {[
            { key: "paths" as const, label: "Career Paths", icon: Target },
            { key: "jobs" as const, label: "Matching Jobs", icon: Briefcase },
            { key: "skills" as const, label: "Skill Analysis", icon: Zap },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-indigo-500/20 text-indigo-300 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Career Paths Tab */}
        {activeTab === "paths" && (
          <div className="space-y-3" style={{ animation: "fadeIn 0.3s ease-out both" }}>
            {paths.length > 0 ? paths.map((p, i) => (
              <div key={p.id} className="p-4 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all" style={{ background: "rgba(17,17,24,0.5)", animation: `slideUp 0.4s ease-out ${i * 0.06}s both` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm">
                    {Math.round(p.matchScore * 100)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{p.careerPath.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.careerPath.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {p.careerPath.salaryMin > 0 && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />₹{p.careerPath.salaryMin / 100000}L - ₹{p.careerPath.salaryMax / 100000}L
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 capitalize">{p.careerPath.growthOutlook} growth</span>
                      <span className={`text-[11px] capitalize ${p.careerPath.aiRisk === "low" ? "text-emerald-400" : p.careerPath.aiRisk === "high" ? "text-rose-400" : "text-amber-400"}`}>
                        AI Risk: {p.careerPath.aiRisk}
                      </span>
                    </div>
                  </div>
                  <Link href={`/paths`} className="shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.3)" }}>
                <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Career paths are being generated based on your skills.</p>
                <p className="text-xs text-slate-600 mt-1">Visit the dashboard to see your personalized matches.</p>
              </div>
            )}
            <div className="text-center pt-2">
              <Link href="/paths" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View all career paths <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Matching Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-3" style={{ animation: "fadeIn 0.3s ease-out both" }}>
            {jobs.length > 0 ? jobs.slice(0, 5).map((job, i) => (
              <div key={job.id} className="p-4 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all" style={{ background: "rgba(17,17,24,0.5)", animation: `slideUp 0.4s ease-out ${i * 0.06}s both` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                        <p className="text-xs text-slate-400">{job.company}</p>
                      </div>
                      {job.matchScore && (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">{job.matchScore}%</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.city || job.location}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                      {job.salary && <span className="text-[11px] text-slate-500 flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>}
                      {job._isReal && <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Real</span>}
                    </div>
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.requiredSkills.slice(0, 4).map((s: string) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-500">{s}</span>
                        ))}
                        {job.requiredSkills.length > 4 && <span className="text-[10px] text-slate-600">+{job.requiredSkills.length - 4}</span>}
                      </div>
                    )}
                  </div>
                  {(job.url || job.applyUrl) && (
                    <a href={job.url || job.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.3)" }}>
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No matching jobs found yet.</p>
                <p className="text-xs text-slate-600 mt-1">Jobs will appear as your profile gets more data.</p>
              </div>
            )}
            <div className="text-center pt-2">
              <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                Browse all jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Skill Analysis Tab */}
        {activeTab === "skills" && (
          <div className="space-y-3" style={{ animation: "fadeIn 0.3s ease-out both" }}>
            {gaps.length > 0 ? (
              <>
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> Skill Gaps to Close</h3>
                  <div className="space-y-4">
                    {gaps.slice(0, 6).map(gap => (
                      <div key={gap.id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{gap.skillName}</span>
                          <span className={gap.priority === "high" ? "text-rose-400 font-medium" : "text-amber-400"}>{gap.gap} point gap</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${gap.priority === "high" ? "bg-gradient-to-r from-rose-500 to-rose-400" : "bg-gradient-to-r from-amber-500 to-amber-400"}`}
                            style={{ width: `${Math.min(100, (gap.currentLevel / Math.max(gap.requiredLevel, 1)) * 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                          <span>Current: {gap.currentLevel}/10</span>
                          <span>Required: {gap.requiredLevel}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center pt-1">
                  <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View detailed skill analysis <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> Your Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((s: string) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">{s}</span>
                  ))}
                  {skills.length === 0 && <p className="text-sm text-slate-500">No skills registered yet.</p>}
                </div>
                <Link href="/skills" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Improve your skills <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div data-tour="results-actions" className="flex flex-col sm:flex-row gap-3 justify-center mt-8 pt-6 border-t border-white/5">
          <Link href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 text-white">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all text-slate-300">
            <Briefcase className="w-4 h-4" /> Browse Jobs
          </Link>
          <Link href="/interview-preparation"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all text-slate-300">
            <GraduationCap className="w-4 h-4" /> Start Interview Prep
          </Link>
        </div>
      </div>

      <PageTour id="assessment-results" steps={[
        { target: "[data-tour='results-banner']", title: "Profile complete", body: "Your AI profile is ready — built from your skills, interests and experience." },
        { target: "[data-tour='results-stats']", title: "Your match stats", body: "Top career match, average match, jobs found and skill gaps at a glance." },
        { target: "[data-tour='results-analysis']", title: "Deep personal analysis", body: "A full AI breakdown: strengths, recommended paths, gaps, jobs and an action plan." },
        { target: "[data-tour='results-actions']", title: "Next steps", body: "Jump to your dashboard, browse matched jobs, or start interview prep." },
      ]}/>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
