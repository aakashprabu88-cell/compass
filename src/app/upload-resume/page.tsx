"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Upload, FileText, CheckCircle, Zap, Sparkles, GraduationCap, Briefcase, Building2, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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

export default function UploadResumePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [autoApplying, setAutoApplying] = useState(false);
  const [fileName, setFileName] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [autoApplyResult, setAutoApplyResult] = useState<any>(null);
  const [existingResume, setExistingResume] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setLoading(false);
    });
    fetch("/api/resume").then(r => r.json()).then(d => {
      if (d && d.extractedSkills) {
        setExistingResume(d);
        setExtractedSkills(JSON.parse(d.extractedSkills));
        setSummary(d.summary);
        setExperience(d.experience || "");
        setEducation(d.education || "");
      }
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const uploadResume = async () => {
    setUploading(true);
    const formData = new FormData();
    const file = fileRef.current?.files?.[0];
    if (file) formData.append("resume", file);
    if (skillsText) formData.append("skills", skillsText);
    if (experience) formData.append("experience", experience);
    if (education) formData.append("education", education);

    const res = await fetch("/api/resume", { method: "POST", body: formData });
    const data = await res.json();
    setExtractedSkills(data.skills || []);
    setSummary(data.summary || "");
    setExistingResume(data.resume);
    setUploading(false);
  };

  const autoApply = async () => {
    setAutoApplying(true);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoApply: true }),
    });
    const data = await res.json();
    setAutoApplyResult(data);
    setAutoApplying(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/upload-resume" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Upload Resume & Auto-Apply</h1>
          <p className="text-slate-400 text-sm mb-8">Upload your resume, we extract your skills and automatically apply to matching jobs across Tamil Nadu</p>

          {/* Upload Section */}
          <div className="glass p-6 mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-indigo-400" /> Resume Upload</h2>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-indigo-500/30 transition-all cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              {fileName ? (
                <p className="text-sm text-indigo-400">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm text-slate-400 mb-1">Click to upload your resume</p>
                  <p className="text-xs text-slate-600">PDF, DOC, DOCX, or TXT</p>
                </>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Your Skills (comma-separated)</label>
                <textarea value={skillsText} onChange={e => setSkillsText(e.target.value)} rows={2}
                  placeholder="e.g. Python, React, SQL, Machine Learning, Figma"
                  className="w-full !rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Experience</label>
                  <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full !rounded-xl text-sm">
                    <option value="">Select</option>
                    <option value="fresher">Fresher (0 years)</option>
                    <option value="1-2">1–2 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Education</label>
                  <select value={education} onChange={e => setEducation(e.target.value)} className="w-full !rounded-xl text-sm">
                    <option value="">Select</option>
                    <option value="highschool">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor&apos;s Degree</option>
                    <option value="masters">Master&apos;s Degree</option>
                    <option value="phd">Ph.D</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={uploadResume} disabled={uploading || (!fileName && !skillsText)}
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing Resume...</> : <><Upload className="w-4 h-4" /> Upload & Extract Skills</>}
            </button>
          </div>

          {/* Extracted Skills */}
          {extractedSkills.length > 0 && (
            <div className="glass p-6 mb-6 glow-sm">
              <h2 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Skills Detected</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {extractedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm">{skill}</span>
                ))}
              </div>
              {summary && <p className="text-sm text-slate-400">{summary}</p>}
            </div>
          )}

          {/* Auto-Apply */}
          {extractedSkills.length > 0 && (
            <div className="glass p-6 mb-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Auto-Apply to Jobs</h2>
              <p className="text-sm text-slate-400 mb-4">
                We&apos;ll match your skills against 50+ jobs across Tamil Nadu and automatically apply to the best matches. You&apos;ll get a summary of all applications.
              </p>
              <button onClick={autoApply} disabled={autoApplying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-400 hover:to-purple-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {autoApplying ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Auto-applying to matching jobs...</> : <><Sparkles className="w-4 h-4" /> Auto-Apply to All Matching Jobs</>}
              </button>
            </div>
          )}

          {/* Auto-Apply Results */}
          {autoApplyResult && (
            <div className="glass p-6 glow-sm">
              <h2 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Applications Sent!</h2>
              <p className="text-sm text-slate-400 mb-4">
                Successfully applied to <strong className="text-white">{autoApplyResult.applied}</strong> matching positions across Tamil Nadu.
              </p>
              <div className="space-y-2 mb-4">
                {autoApplyResult.jobs?.slice(0, 10).map((j: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="text-sm font-medium">{j.title}</div>
                      <div className="text-xs text-slate-500">{j.company} — {j.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-400">{Math.round(j.matchScore * 10)}%</div>
                      <a href={j.applyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300">View →</a>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/applications" className="block text-center py-2 rounded-xl bg-white/5 text-sm text-slate-400 hover:text-white transition-all">
                View All Applications →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
