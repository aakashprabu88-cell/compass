"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Plus, X, Copy, CheckCircle2, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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
    if (authLoading) return;
    if (user) {
      setName(user.name || "");
      setLoading(false);
    }
  }, [authLoading, user]);

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
    } catch (e) {
      console.error("generate resume", e);
      setResult({ bullets: [{ section: "Experience", content: "Developed scalable web applications using modern technologies" }], summary: "Experienced software engineer with strong technical skills.", atsTips: ["Add quantified achievements"] });
    }
    setGenerating(false);
  };

  const tailorResume = async () => {
    if (!result || !jobDescription.trim()) return;
    setTailoring(true);
    try {
      const resumeText = result.summary + "\n" + result.bullets.map((b: any) => `${b.section}: ${b.content}`).join("\n");
      const atsRes = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tailor", resumeText, jobDescription }),
      });
      const atsData = await atsRes.json();
      setAtsResult(atsData);
      toast.success("Resume tailored successfully!");
    } catch {
      toast.error("Failed to tailor resume");
    }
    setTailoring(false);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const text = result.bullets.map((b: any) => `${b.section}:\n${b.content}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">AI Resume Builder</h1>
                <p className="text-slate-400 text-sm">Generate ATS-optimized resumes for your target roles</p>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>

            {/* Input Form */}
            {!result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Target Role</label>
                    <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30" />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Skills</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addSkill()}
                      placeholder="Add a skill..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30" />
                    <button onClick={addSkill} className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Projects</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input value={projectInput} onChange={e => setProjectInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addProject()}
                      placeholder="Add a project..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30" />
                    <button onClick={addProject} className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {projects.map(p => (
                      <span key={p} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {p}
                        <button onClick={() => removeProject(p)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Experience</label>
                    <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={3} placeholder="e.g., 3 years at Google as SDE2..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Education</label>
                    <textarea value={education} onChange={e => setEducation(e.target.value)} rows={3} placeholder="e.g., B.Tech CSE, IIT Bombay..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 resize-none" />
                  </div>
                </div>

                <button onClick={generate} disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? "Generating..." : "Generate Resume"}
                </button>
              </motion.div>
            ) : (
              /* Results */
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Summary */}
                <div className="p-5 rounded-2xl border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.05)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold">Professional Summary</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Bullets */}
                {result.bullets.map((b: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <h3 className="text-xs text-indigo-400 uppercase tracking-wider mb-3">{b.section}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{b.content}</p>
                  </div>
                ))}

                {/* ATS Tips */}
                {result.atsTips && (
                  <div className="p-5 rounded-2xl border border-amber-500/20" style={{ background: "rgba(245,158,11,0.05)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold">ATS Optimization Tips</span>
                    </div>
                    <div className="space-y-2">
                      {result.atsTips.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <TrendingUp className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATS Tailoring */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <h3 className="text-sm font-semibold mb-3">ATS Tailoring</h3>
                  <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4}
                    placeholder="Paste job description here to tailor your resume..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 resize-none mb-3" />
                  <button onClick={tailorResume} disabled={tailoring || !jobDescription.trim()}
                    className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {tailoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                    {tailoring ? "Tailoring..." : "Tailor for Job"}
                  </button>
                  {atsResult && (
                    <div className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-green-400">Tailored Resume</span>
                      </div>
                      <p className="text-xs text-slate-400">{atsResult.tailoredSummary || "Resume optimized for ATS."}</p>
                    </div>
                  )}
                </div>

                <button onClick={() => { setResult(null); setAtsResult(null); }}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm">
                  Start Over
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
