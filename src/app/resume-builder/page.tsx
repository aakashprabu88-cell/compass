"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, Loader2, Plus, X, Copy, CheckCircle2, FileText, AlertTriangle,
  TrendingUp, Printer, Mail, Phone, MapPin, Briefcase, GraduationCap, Award,
  Gauge, Target, RefreshCw, ChevronLeft, ArrowLeft, Building2, BadgeCheck,
  ListChecks, Link2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ExperienceItem { company: string; role: string; dates: string; description: string; }
interface ProjectItem { name: string; tech: string; description: string; }
interface EducationItem { degree: string; school: string; year: string; gpa: string; }
interface CertItem { name: string; issuer: string; year: string; }

interface ResumeExperience { company: string; role: string; dates: string; bullets: string[]; }
interface ResumeProject { name: string; tech: string; bullets: string[]; }
interface ResumeEducation { degree: string; school: string; year: string; details: string; }
interface ResumeCert { name: string; issuer: string; year: string; }

interface ResumeResult {
  matchScore: number;
  verdict: string;
  summary: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: ResumeCert[];
  achievements: string[];
  skills: Record<string, string[]>;
  hiringManagerView: string;
  strengths: string[];
  gaps: string[];
  missingKeywords: string[];
  recommendations: string[];
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500/30 placeholder:text-slate-600";
const labelCls = "text-xs text-slate-500 mb-1 block";

function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 80 ? "#34d399" : clamped >= 65 ? "#fbbf24" : clamped >= 50 ? "#fb923c" : "#f87171";
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - clamped / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{clamped}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    "Exceptional": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Strong Match": "bg-green-500/15 text-green-400 border-green-500/30",
    "Competitive": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "Needs Work": "bg-orange-500/15 text-orange-400 border-orange-500/30",
    "Not Ready": "bg-red-500/15 text-red-400 border-red-500/30",
  };
  const cls = map[verdict] || map["Competitive"];
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>{verdict}</span>;
}

export default function ResumeBuilderPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const printRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [improving, setImproving] = useState<{ kind: "experience" | "project"; index: number } | null>(null);

  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [contact, setContact] = useState({ email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceItem[]>([{ company: "", role: "", dates: "", description: "" }]);
  const [projects, setProjects] = useState<ProjectItem[]>([{ name: "", tech: "", description: "" }]);
  const [education, setEducation] = useState<EducationItem[]>([{ degree: "", school: "", year: "", gpa: "" }]);
  const [certifications, setCertifications] = useState<CertItem[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [result, setResult] = useState<ResumeResult | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setName(user.name || "");
      setContact(c => ({ ...c, email: user.email || "" }));
      setLoading(false);
    }
  }, [authLoading, user]);

  const addSkill = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };
  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));
  const addAchievement = () => { if (achievementInput.trim() && !achievements.includes(achievementInput.trim())) { setAchievements([...achievements, achievementInput.trim()]); setAchievementInput(""); } };
  const removeAchievement = (a: string) => setAchievements(achievements.filter(x => x !== a));

  const updateExp = (i: number, f: keyof ExperienceItem, v: string) => setExperiences(prev => prev.map((e, j) => j === i ? { ...e, [f]: v } : e));
  const updateProj = (i: number, f: keyof ProjectItem, v: string) => setProjects(prev => prev.map((p, j) => j === i ? { ...p, [f]: v } : p));
  const updateEdu = (i: number, f: keyof EducationItem, v: string) => setEducation(prev => prev.map((e, j) => j === i ? { ...e, [f]: v } : e));
  const updateCert = (i: number, f: keyof CertItem, v: string) => setCertifications(prev => prev.map((c, j) => j === i ? { ...c, [f]: v } : c));
  const setContactField = (f: keyof typeof contact, v: string) => setContact(c => ({ ...c, [f]: v }));

  const filledFields = [
    name.trim(), targetRole.trim(), skills.length > 0,
    experiences.some(e => e.company || e.description),
    projects.some(p => p.name || p.description),
    education.some(e => e.degree || e.school),
    achievements.length > 0,
    contact.linkedin || contact.github || contact.portfolio,
  ].filter(Boolean).length;
  const totalSections = 8;

  const generate = async () => {
    if (!name.trim() || !targetRole.trim()) {
      toast.error("Add your name and target role first");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, targetRole, targetCompany, jobDescription, ...contact,
          skills, experiences: experiences.filter(e => e.company || e.role || e.description),
          projects: projects.filter(p => p.name || p.description),
          education: education.filter(e => e.degree || e.school),
          certifications: certifications.filter(c => c.name),
          achievements,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to generate resume");
        return;
      }
      setResult(data);
      toast.success("First-class resume ready!");
    } catch (e) {
      console.error("generate resume", e);
      toast.error("Failed to generate resume");
    }
    setGenerating(false);
  };

  const improve = async (kind: "experience" | "project", index: number) => {
    const source = kind === "experience" ? result!.experience[index] : result!.projects[index];
    const raw = source.bullets.join("\n") || (kind === "experience"
      ? `${(source as ResumeExperience).company} ${(source as ResumeExperience).role}`
      : `${(source as ResumeProject).name} ${(source as ResumeProject).tech}`);
    setImproving({ kind, index });
    try {
      const res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "improve", targetRole, kind, raw }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { toast.error(data.error || "Failed to improve"); return; }
      const bullets = String(data.improved).split("\n").map(s => s.trim()).filter(Boolean);
      setResult(prev => {
        if (!prev) return prev;
        if (kind === "experience") return { ...prev, experience: prev.experience.map((e, i) => i === index ? { ...e, bullets } : e) };
        return { ...prev, projects: prev.projects.map((p, i) => i === index ? { ...p, bullets } : p) };
      });
      toast.success("Bullets improved with more impact");
    } catch (e) {
      console.error("improve resume", e);
      toast.error("Failed to improve section");
    }
    setImproving(null);
  };

  const resetAll = () => {
    setResult(null);
    setImproving(null);
    setExperiences([{ company: "", role: "", dates: "", description: "" }]);
    setProjects([{ name: "", tech: "", description: "" }]);
    setEducation([{ degree: "", school: "", year: "", gpa: "" }]);
    setCertifications([]);
    setAchievements([]);
    setAchievementInput("");
    setSkills([]);
    setSkillInput("");
    setJobDescription("");
    setTargetCompany("");
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push(name.toUpperCase());
    lines.push([contact.email, contact.phone, contact.location].filter(Boolean).join(" · "));
    lines.push([contact.linkedin && `LinkedIn: ${contact.linkedin}`, contact.github && `GitHub: ${contact.github}`, contact.portfolio && `Portfolio: ${contact.portfolio}`].filter(Boolean).join(" · "));
    lines.push("");
    lines.push("SUMMARY");
    lines.push(result.summary);
    lines.push("");
    lines.push("SKILLS");
    Object.entries(result.skills).forEach(([cat, list]) => lines.push(`${cat}: ${list.join(", ")}`));
    if (result.experience.length) {
      lines.push("");
      lines.push("EXPERIENCE");
      result.experience.forEach(e => {
        lines.push(`${e.role} — ${e.company}${e.dates ? ` (${e.dates})` : ""}`);
        e.bullets.forEach(b => lines.push(`- ${b}`));
      });
    }
    if (result.projects.length) {
      lines.push("");
      lines.push("PROJECTS");
      result.projects.forEach(p => {
        lines.push(`${p.name}${p.tech ? ` — ${p.tech}` : ""}`);
        p.bullets.forEach(b => lines.push(`- ${b}`));
      });
    }
    if (result.education.length) {
      lines.push("");
      lines.push("EDUCATION");
      result.education.forEach(e => lines.push(`- ${e.degree} — ${e.school}${e.year ? ` (${e.year})` : ""}${e.details ? ` — ${e.details}` : ""}`));
    }
    if (result.certifications.length) {
      lines.push("");
      lines.push("CERTIFICATIONS");
      result.certifications.forEach(c => lines.push(`- ${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`));
    }
    if (result.achievements.length) {
      lines.push("");
      lines.push("ACHIEVEMENTS");
      result.achievements.forEach(a => lines.push(`- ${a}`));
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-doc, #resume-doc * { visibility: visible !important; }
          #resume-doc { position: absolute; left: 0; top: 0; width: 100%; color: #111 !important; background: #fff !important; }
          #resume-doc .resume-sect-title { border-bottom: 1.5px solid #111 !important; color: #111 !important; }
          #resume-doc p, #resume-doc li { color: #222 !important; }
        }
      `}</style>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">First-Class AI Resume Builder</h1>
                <p className="text-slate-400 text-sm">Built the way a top-company hiring manager would want it — analyzed, scored, and rewritten for impact</p>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all">
                    <Printer className="w-3.5 h-3.5" /> Print / PDF
                  </button>
                  <button onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                </div>
              )}
            </div>

            {!result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Progress */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-medium">Profile completeness</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                      style={{ width: `${(filledFields / totalSections) * 100}%` }} />
                  </div>
                  <span>{filledFields}/{totalSections}</span>
                </div>

                {/* Contact & Target */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold">Target &amp; Contact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Aarav Sharma" />
                    </div>
                    <div>
                      <label className={labelCls}>Target Role</label>
                      <input value={targetRole} onChange={e => setTargetRole(e.target.value)} className={inputCls} placeholder="Software Engineer, Data Analyst, SDE..." />
                    </div>
                    <div>
                      <label className={labelCls}>Dream Company <span className="text-slate-600">(optional)</span></label>
                      <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} className={inputCls} placeholder="Google, Microsoft, Flipkart..." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelCls}>Email</label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input value={contact.email} onChange={e => setContactField("email", e.target.value)} className={`${inputCls} pl-8`} placeholder="you@mail.com" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input value={contact.phone} onChange={e => setContactField("phone", e.target.value)} className={`${inputCls} pl-8`} placeholder="+91 98..." />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className={labelCls}>Location</label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input value={contact.location} onChange={e => setContactField("location", e.target.value)} className={`${inputCls} pl-8`} placeholder="Bengaluru" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>LinkedIn</label>
                        <div className="relative">
                          <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input value={contact.linkedin} onChange={e => setContactField("linkedin", e.target.value)} className={`${inputCls} pl-8`} placeholder="linkedin.com/in/..." />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>GitHub</label>
                        <div className="relative">
                          <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input value={contact.github} onChange={e => setContactField("github", e.target.value)} className={`${inputCls} pl-8`} placeholder="github.com/..." />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelCls}>Paste Job Description <span className="text-slate-600">(optional — resume gets tuned to its keywords)</span></label>
                    <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={3}
                      placeholder="Paste the exact job posting for the role you want. The AI will match keywords, priorities and expectations to it..."
                      className={`${inputCls} resize-none`} />
                  </div>
                </div>

                {/* Skills */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BadgeCheck className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold">Skills</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addSkill()}
                      placeholder="e.g., Python, React, AWS, SQL..."
                      className={inputCls} />
                    <button onClick={addSkill} className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors shrink-0">
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

                {/* Experience */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">Work Experience</span>
                    </div>
                    <button onClick={() => setExperiences([...experiences, { company: "", role: "", dates: "", description: "" }])}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {experiences.map((e, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <input value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} className={inputCls} placeholder="Company" />
                          <input value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} className={inputCls} placeholder="Role / title" />
                          <div className="flex gap-2">
                            <input value={e.dates} onChange={ev => updateExp(i, "dates", ev.target.value)} className={inputCls} placeholder="2023 - Present" />
                            {experiences.length > 1 && (
                              <button onClick={() => setExperiences(prev => prev.filter((_, j) => j !== i))}
                                className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 shrink-0">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea value={e.description} onChange={ev => updateExp(i, "description", ev.target.value)} rows={3}
                          placeholder="What you did (raw notes ok). e.g., 'Built a dashboard for 5k users. Cut page load from 3s to 1s. Led a 4 person team...'"
                          className={`${inputCls} resize-none`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">Projects</span>
                    </div>
                    <button onClick={() => setProjects([...projects, { name: "", tech: "", description: "" }])}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.map((p, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input value={p.name} onChange={ev => updateProj(i, "name", ev.target.value)} className={inputCls} placeholder="Project name" />
                          <input value={p.tech} onChange={ev => updateProj(i, "tech", ev.target.value)} className={inputCls} placeholder="Tech stack" />
                          <button onClick={() => setProjects(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)}
                            className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea value={p.description} onChange={ev => updateProj(i, "description", ev.target.value)} rows={2}
                          placeholder="e.g., 'Built a real-time chat app for 2k students. 60% faster than WhatsApp for campus use. Deployed on Vercel.'"
                          className={`${inputCls} resize-none`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">Education</span>
                    </div>
                    <button onClick={() => setEducation([...education, { degree: "", school: "", year: "", gpa: "" }])}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {education.map((e, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                        <input value={e.degree} onChange={ev => updateEdu(i, "degree", ev.target.value)} className={inputCls} placeholder="B.Tech CSE" />
                        <input value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} className={inputCls} placeholder="College / school" />
                        <input value={e.year} onChange={ev => updateEdu(i, "year", ev.target.value)} className={inputCls} placeholder="2025" />
                        <input value={e.gpa} onChange={ev => updateEdu(i, "gpa", ev.target.value)} className={inputCls} placeholder="CGPA 8.5" />
                        <button onClick={() => setEducation(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)}
                          className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications + Achievements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold">Certifications</span>
                      </div>
                      <button onClick={() => setCertifications([...certifications, { name: "", issuer: "", year: "" }])}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {certifications.map((c, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input value={c.name} onChange={ev => updateCert(i, "name", ev.target.value)} className={inputCls} placeholder="Cert name" />
                          <input value={c.issuer} onChange={ev => updateCert(i, "issuer", ev.target.value)} className={inputCls} placeholder="Issuer" />
                          <button onClick={() => setCertifications(prev => prev.filter((_, j) => j !== i))}
                            className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {certifications.length === 0 && <p className="text-xs text-slate-600">Optional — AWS, certifications, courses, etc.</p>}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">Achievements</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input value={achievementInput} onChange={e => setAchievementInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addAchievement()}
                        placeholder="e.g., Runner-up, Smart India Hackathon 2024"
                        className={inputCls} />
                      <button onClick={addAchievement} className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors shrink-0">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {achievements.map(a => (
                        <span key={a} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {a}
                          <button onClick={() => removeAchievement(a)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={generate} disabled={generating}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? "Analyzing profile & writing your resume..." : "Generate First-Class Resume"}
                </button>
                <p className="text-center text-[11px] text-slate-600">The AI scores your profile like a hiring manager, finds gaps, and rewrites everything for maximum impact.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Recruiter analysis */}
                <div className="p-5 rounded-2xl border border-white/10" style={{ background: "rgba(17,17,24,0.6)" }}>
                  <div className="flex items-start gap-5 flex-wrap">
                    <ScoreRing score={result.matchScore} />
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-semibold">Hiring-Market Readiness</span>
                        <VerdictBadge verdict={result.verdict} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{result.hiringManagerView}</p>
                      <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                        <Gauge className="w-3.5 h-3.5" />
                        Score = how a recruiter screening for "{targetRole}" would rate this resume vs. the applicant pool.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-green-500/15" style={{ background: "rgba(16,185,129,0.04)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">What stands out</span>
                    </div>
                    <ul className="space-y-1.5">
                      {result.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-xs text-slate-400"><CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />{s}</li>)}
                    </ul>
                  </div>
                  <div className="p-5 rounded-2xl border border-red-500/15" style={{ background: "rgba(239,68,68,0.04)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">Red flags a recruiter would catch</span>
                    </div>
                    <ul className="space-y-1.5">
                      {result.gaps.map((g, i) => <li key={i} className="flex items-start gap-2 text-xs text-slate-400"><X className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />{g}</li>)}
                    </ul>
                  </div>
                </div>

                {result.missingKeywords.length > 0 && (
                  <div className="p-5 rounded-2xl border border-amber-500/15" style={{ background: "rgba(245,158,11,0.04)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-400">Missing keywords the ATS / recruiter searches for</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((k, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">How to make it even stronger</span>
                    </div>
                    <ol className="space-y-1.5">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="w-4 h-4 rounded-full bg-indigo-500/15 text-indigo-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Resume document */}
                <div className="p-5 rounded-2xl border border-white/10" style={{ background: "rgba(17,17,24,0.6)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold">Your First-Class Resume</span>
                    </div>
                    <button onClick={() => window.print()}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                    </button>
                  </div>
                  <div ref={printRef} id="resume-doc" className="rounded-xl bg-white text-slate-900 p-8 shadow-2xl" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
                    {/* Header */}
                    <div className="text-center mb-5">
                      <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900">{name}</h2>
                      <div className="mt-1.5 text-[11px] text-slate-700 space-x-2">
                        {[contact.email, contact.phone, contact.location].filter(Boolean).map((c, i) => (
                          <span key={i}>{c} <span className="text-slate-400">·</span> </span>
                        ))}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-700 space-x-2">
                        {[contact.linkedin && `linkedin.com/in/${contact.linkedin.replace(/^.*\/(in\/)?/, "")}`, contact.github && `github.com/${contact.github.replace(/^.*github\.com\//, "")}`, contact.portfolio].filter(Boolean).map((c, i) => (
                          <span key={i}>{c} <span className="text-slate-400">·</span> </span>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-4">
                      <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Summary</h3>
                      <p className="text-[12px] text-slate-800 leading-relaxed">{result.summary}</p>
                    </div>

                    {/* Skills */}
                    {Object.keys(result.skills).length > 0 && (
                      <div className="mb-4">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Skills</h3>
                        {Object.entries(result.skills).map(([cat, list]) => (
                          <p key={cat} className="text-[12px] text-slate-800 leading-relaxed mb-0.5">
                            <span className="font-semibold">{cat}:</span> {list.join(", ")}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Experience */}
                    {result.experience.length > 0 && (
                      <div className="mb-4">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Experience</h3>
                        {result.experience.map((e, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[12px] font-bold text-slate-900">{e.role}{e.company ? ` — ${e.company}` : ""}</span>
                              {e.dates && <span className="text-[11px] text-slate-600 italic">{e.dates}</span>}
                            </div>
                            <ul className="mt-1 space-y-0.5">
                              {e.bullets.map((b, j) => <li key={j} className="text-[12px] text-slate-800 leading-relaxed list-disc ml-4">{b}</li>)}
                            </ul>
                            <div className="mt-1">
                              <button onClick={() => improve("experience", i)} disabled={!!improving}
                                className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-500 font-medium print:hidden">
                                {improving?.kind === "experience" && improving.index === i ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                                AI-improve these bullets
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {result.projects.length > 0 && (
                      <div className="mb-4">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Projects</h3>
                        {result.projects.map((p, i) => (
                          <div key={i} className="mb-2.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[12px] font-bold text-slate-900">{p.name}</span>
                              {p.tech && <span className="text-[11px] text-slate-600 italic">{p.tech}</span>}
                            </div>
                            <ul className="mt-1 space-y-0.5">
                              {p.bullets.map((b, j) => <li key={j} className="text-[12px] text-slate-800 leading-relaxed list-disc ml-4">{b}</li>)}
                            </ul>
                            <div className="mt-1">
                              <button onClick={() => improve("project", i)} disabled={!!improving}
                                className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-500 font-medium print:hidden">
                                {improving?.kind === "project" && improving.index === i ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                                AI-improve these bullets
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {result.education.length > 0 && (
                      <div className="mb-4">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Education</h3>
                        {result.education.map((e, i) => (
                          <p key={i} className="text-[12px] text-slate-800 leading-relaxed">
                            <span className="font-bold">{e.degree}</span> — {e.school}{e.year ? ` (${e.year})` : ""}{e.details ? ` · ${e.details}` : ""}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Certifications */}
                    {result.certifications.length > 0 && (
                      <div className="mb-4">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Certifications</h3>
                        {result.certifications.map((c, i) => (
                          <p key={i} className="text-[12px] text-slate-800">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</p>
                        ))}
                      </div>
                    )}

                    {/* Achievements */}
                    {result.achievements.length > 0 && (
                      <div className="mb-2">
                        <h3 className="resume-sect-title text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 border-b border-slate-900 pb-1 mb-2">Achievements</h3>
                        {result.achievements.map((a, i) => (
                          <p key={i} className="text-[12px] text-slate-800 leading-relaxed">• {a}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => { setResult(null); setImproving(null); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4" /> Edit Inputs
                  </button>
                  <button onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm">
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
