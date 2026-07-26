"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Briefcase, FileText, Building2, GraduationCap, Target, Shield, GitBranch, Radar, IndianRupee, Trophy, FileText as ResumeIcon, Sparkles, Download, Copy, CheckCircle2, Loader2, Plus, X } from "lucide-react";

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
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

export default function ResumeBuilderPage() {
  const router = useRouter();
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

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setName(d.name || "");
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

  const addProject = () => {
    if (projectInput.trim() && !projects.includes(projectInput.trim())) {
      setProjects([...projects, projectInput.trim()]);
      setProjectInput("");
    }
  };

  const removeProject = (p: string) => setProjects(projects.filter(x => x !== p));

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, skills, projects, experience, education, targetRole }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        bullets: [{ section: "Experience", content: "Developed scalable web applications using modern technologies" }],
        summary: "Experienced software engineer with strong technical skills.",
        atsTips: ["Add quantified achievements", "Tailor for specific role"],
      });
    }
    setGenerating(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = [
      name,
      `Target: ${targetRole}`,
      "",
      "Professional Summary",
      result.summary,
      "",
      "Skills",
      skills.join(", "),
      "",
      "Experience & Projects",
      ...result.bullets.map((b: any) => `• ${b.content}`),
      "",
      "ATS Tips",
      ...result.atsTips.map((t: string) => `→ ${t}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/resume-builder" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3"><ResumeIcon className="w-7 h-7 text-indigo-400" /> AI Resume Builder</h1>
          <p className="text-slate-400 text-sm mb-6">AI generates bullet points, summary, and ATS optimization for your target role</p>

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
                  <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer, Data Scientist"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Skills</label>
                  <div className="flex gap-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      placeholder="Type skill + Enter" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                    <button onClick={addSkill} className="px-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map(s => (
                      <span key={s} className="px-2 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-400 flex items-center gap-1">
                        {s} <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Projects</label>
                  <div className="flex gap-2">
                    <input value={projectInput} onChange={e => setProjectInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addProject(); } }}
                      placeholder="Describe project + Enter" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                    <button onClick={addProject} className="px-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {projects.map(p => (
                      <span key={p} className="px-2 py-1 rounded-lg bg-green-500/10 text-xs text-green-400 flex items-center gap-1">
                        {p.slice(0, 40)}{p.length > 40 ? "..." : ""} <button onClick={() => removeProject(p)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Experience</label>
                  <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={3} placeholder="Internships, jobs, freelance..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Education</label>
                  <input value={education} onChange={e => setEducation(e.target.value)} placeholder="B.Tech CS, IIT Bombay, 2025"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <button onClick={generate} disabled={generating || !name || !targetRole}
                  className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {generating ? (<><Loader2 className="w-4 h-4 animate-spin" /> AI is generating...</>) : (<><Sparkles className="w-4 h-4" /> Generate Resume</>)}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              {!result && !generating && (
                <div className="glass p-16 text-center">
                  <ResumeIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Resume</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">Fill in your details and click Generate. The AI will create bullet points, a professional summary, and ATS optimization tips.</p>
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

                  {/* Resume Preview */}
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
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map(s => <span key={s} className="px-2 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-400">{s}</span>)}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience & Achievements</h3>
                      <div className="space-y-2">
                        {result.bullets.map((b: any, i: number) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            <span className="text-slate-300">{b.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ATS Tips */}
                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> ATS Optimization Tips</h3>
                    <div className="space-y-2">
                      {result.atsTips.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
