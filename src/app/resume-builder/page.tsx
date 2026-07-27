"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Plus, X, Copy, CheckCircle2, FileText, Target, AlertTriangle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // ATS Tailoring state
  const [jobDescription, setJobDescription] = useState("");
  const [tailoring, setTailoring] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/"); return; }
      if (!d.onboarded) { router.push("/dashboard"); return; }
      setName(d.name || "");
      setUser({ name: d.name, email: d.email });
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const addSkill = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };
  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));
  const addProject = () => { if (projectInput.trim() && !projects.includes(projectInput.trim())) { setProjects([...projects, projectInput.trim()]); setProjectInput(""); } };
  const removeProject = (p: string) => setProjects(projects.filter(x => x !== p));

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, skills, projects, experience, education, targetRole }),
      });
      setResult(await res.json());
    } catch {
      setResult({ bullets: [{ section: "Experience", content: "Developed scalable web applications using modern technologies" }], summary: "Experienced software engineer with strong technical skills.", atsTips: ["Add quantified achievements"] });
    }
    setGenerating(false);
  };

  const tailorResume = async () => {
    if (!result || !jobDescription.trim()) return;
    setTailoring(true);
    try {
      const resumeText = [
        name, `Target: ${targetRole}`, "",
        "Professional Summary", result.summary, "",
        "Skills", skills.join(", "), "",
        "Experience & Projects",
        ...result.bullets.map((b: any) => b.content),
      ].join("\n");

      const res = await fetch("/api/ai/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription: jobDescription.trim() }),
      });
      setAtsResult(await res.json());
      if (res.ok) toast.success("ATS analysis complete");
    } catch {
      setAtsResult({ overallScore: 0, error: "Failed to analyze" });
    }
    setTailoring(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = [name, `Target: ${targetRole}`, "", "Professional Summary", result.summary, "", "Skills", skills.join(", "), "", "Experience & Projects", ...result.bullets.map((b: any) => `• ${b.content}`), "", "ATS Tips", ...result.atsTips.map((t: string) => `→ ${t}`)].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Resume copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-3"><FileText className="w-7 h-7 text-indigo-400" /> AI Resume Builder</h1>
            <p className="text-slate-400 text-sm mb-6">Generate bullet points, summary, and ATS-optimize for any job description</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="glass p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Details</h3>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Target Role</label>
                  <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer, Data Scientist" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Skills</label>
                  <div className="flex gap-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Type skill + Enter" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                    <button onClick={addSkill} className="px-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map(s => (<span key={s} className="px-2 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-400 flex items-center gap-1">{s} <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button></span>))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Projects</label>
                  <div className="flex gap-2">
                    <input value={projectInput} onChange={e => setProjectInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addProject(); } }} placeholder="Describe project + Enter" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                    <button onClick={addProject} className="px-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {projects.map(p => (<span key={p} className="px-2 py-1 rounded-lg bg-green-500/10 text-xs text-green-400 flex items-center gap-1">{p.slice(0, 40)}{p.length > 40 ? "..." : ""} <button onClick={() => removeProject(p)}><X className="w-3 h-3" /></button></span>))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Experience</label>
                  <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={3} placeholder="Internships, jobs, freelance..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Education</label>
                  <input value={education} onChange={e => setEducation(e.target.value)} placeholder="B.Tech CS, IIT Bombay, 2025" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <button onClick={generate} disabled={generating || !name || !targetRole}
                  className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {generating ? (<><Loader2 className="w-4 h-4 animate-spin" /> AI is generating...</>) : (<><Sparkles className="w-4 h-4" /> Generate Resume</>)}
                </button>
              </div>

              {/* ATS Tailoring Section */}
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">One-Click ATS Tailoring</h3>
                  </div>
                  <p className="text-xs text-slate-500">Paste a job description to get an ATS score and see how to improve your resume for this specific job.</p>
                  <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5} placeholder="Paste the full job description here..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none resize-none" />
                  <button onClick={tailorResume} disabled={tailoring || !jobDescription.trim()}
                    className="w-full py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {tailoring ? (<><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>) : (<><Target className="w-4 h-4" /> Score & Tailor Resume</>)}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              {!result && !generating && (
                <div className="glass p-16 text-center">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Resume</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">Fill in your details and click Generate. Then paste a job description to get an ATS score and tailoring suggestions.</p>
                </div>
              )}

              {generating && (
                <div className="glass p-16 text-center">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI is writing your resume</h3>
                  <p className="text-sm text-slate-500">Generating bullet points, summary, and ATS tips...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300">Generated Resume</h3>
                    <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-400 hover:text-white">
                      {copied ? <><CheckCircle2 className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>

                  <div className="glass p-6 space-y-5">
                    <div className="border-b border-white/5 pb-4">
                      <h2 className="text-xl font-bold">{name}</h2>
                      <p className="text-sm text-indigo-400">{targetRole}</p>
                      {education && <p className="text-xs text-slate-500 mt-1">{education}</p>}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Professional Summary</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-1.5">{skills.map(s => <span key={s} className="px-2 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-400">{s}</span>)}</div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience & Achievements</h3>
                      <div className="space-y-2">{result.bullets.map((b: any, i: number) => (<div key={i} className="flex gap-2 text-sm"><span className="text-indigo-400 mt-0.5">•</span><span className="text-slate-300">{b.content}</span></div>))}</div>
                    </div>
                  </div>

                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> ATS Optimization Tips</h3>
                    <div className="space-y-2">{result.atsTips.map((tip: string, i: number) => (<div key={i} className="flex items-start gap-2 text-xs text-slate-400"><CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{tip}</div>))}</div>
                  </div>

                  {/* ATS Score Results */}
                  <AnimatePresence>
                    {atsResult && !atsResult.error && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Target className="w-4 h-4 text-amber-400" /> ATS Score Analysis</h3>

                        {/* Score Ring */}
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                                stroke={atsResult.overallScore >= 70 ? "#10b981" : atsResult.overallScore >= 40 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="3" strokeDasharray={`${atsResult.overallScore}, 100`} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-bold">{atsResult.overallScore}</span>
                            </div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold ${atsResult.overallScore >= 70 ? "text-green-400" : atsResult.overallScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                              {atsResult.overallScore >= 70 ? "Strong Match" : atsResult.overallScore >= 40 ? "Moderate Match" : "Needs Improvement"}
                            </div>
                            <div className="text-xs text-slate-500">Keyword Match: {atsResult.keywordMatch}%</div>
                          </div>
                        </div>

                        {/* Section Scores */}
                        {atsResult.sectionScores && (
                          <div className="space-y-2">
                            {atsResult.sectionScores.map((s: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-24">{s.name}</span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/5">
                                  <div className={`h-full rounded-full ${s.score >= 70 ? "bg-green-500" : s.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${s.score}%` }} />
                                </div>
                                <span className="text-xs font-medium w-8 text-right">{s.score}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Missing Keywords */}
                        {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Missing Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {atsResult.missingKeywords.map((kw: string, i: number) => (
                                <span key={i} className="px-2 py-1 rounded-lg bg-red-500/10 text-xs text-red-400 border border-red-500/20">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> How to Improve</h4>
                            <div className="space-y-1.5">
                              {atsResult.suggestions.map((s: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                  <span className="text-indigo-400 mt-0.5">→</span>{s}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Optimized Summary */}
                        {atsResult.optimizedSummary && (
                          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Optimized Summary</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{atsResult.optimizedSummary}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}
