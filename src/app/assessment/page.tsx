"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Sparkles, Briefcase, GraduationCap, Code2, Heart, User, Zap, Loader2, Compass } from "lucide-react";
import PageTour from "@/components/PageTour";

const SKILL_CATEGORIES: { label: string; skills: string[] }[] = [
  {
    label: "Technology & Programming",
    skills: [
      "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby",
      "React", "Vue.js", "Angular", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET",
      "HTML/CSS", "Tailwind CSS", "Bootstrap", "SASS",
      "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
      "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Git",
      "Data Structures", "Algorithms", "System Design", "OOP", "Design Patterns",
      "Machine Learning", "Deep Learning", "Data Science", "NLP", "Computer Vision",
      "DevOps", "Cloud Computing", "Cybersecurity", "Blockchain", "Mobile Development",
    ],
  },
  {
    label: "Business & Commerce",
    skills: [
      "Accounting", "Bookkeeping", "Financial Analysis", "Excel", "Tally", "QuickBooks", "Taxation",
      "Economics", "Marketing", "Digital Marketing", "SEO", "Social Media Marketing", "Sales", "Negotiation",
      "Business Strategy", "HR Management", "Recruitment", "Payroll", "Public Relations", "Supply Chain", "Logistics",
    ],
  },
  {
    label: "Science & Research",
    skills: [
      "Physics", "Chemistry", "Biology", "Mathematics", "Statistics", "Research", "Laboratory Skills",
      "Environmental Science", "Genetics", "Biochemistry", "Scientific Writing", "Data Analysis",
    ],
  },
  {
    label: "Healthcare & Medicine",
    skills: [
      "Medicine", "Nursing", "Anatomy", "Pharmacology", "Patient Care", "Physiotherapy",
      "Radiology", "Dentistry", "Psychology", "First Aid", "Public Health", "Veterinary Science",
    ],
  },
  {
    label: "Law & Legal",
    skills: [
      "Legal Research", "Legal Writing", "Contract Law", "Litigation", "Corporate Law", "Intellectual Property",
    ],
  },
  {
    label: "Design & Creative",
    skills: [
      "Figma", "Photoshop", "Illustrator", "InDesign", "Canva", "UI/UX Design", "Graphic Design",
      "Video Editing", "Animation", "Photography", "3D Modeling", "Typography", "SketchUp", "AutoCAD",
    ],
  },
  {
    label: "Arts & Humanities",
    skills: [
      "Writing", "Journalism", "Copywriting", "Content Creation", "History", "Sociology", "Political Science",
      "Philosophy", "Languages", "Public Speaking", "Communication", "Storytelling",
    ],
  },
  {
    label: "Education & Teaching",
    skills: [
      "Teaching", "Curriculum Design", "Lesson Planning", "Educational Technology", "Career Counseling",
    ],
  },
  {
    label: "Trades & Skilled Work",
    skills: [
      "Electrical", "Plumbing", "Carpentry", "Welding", "Automotive Repair", "Construction", "HVAC", "Fabrication",
    ],
  },
  {
    label: "Soft Skills",
    skills: [
      "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Creativity", "Adaptability",
      "Time Management", "Empathy", "Project Management", "Decision Making", "Attention to Detail", "Organization",
    ],
  },
];

const SKILL_OPTIONS = SKILL_CATEGORIES.flatMap(c => c.skills);

const INTEREST_OPTIONS = [
  "Web Development", "AI/ML", "Data Science", "Cloud Computing", "DevOps",
  "Mobile Apps", "Cybersecurity", "Blockchain", "IoT", "Game Development",
  "Open Source", "System Design", "Database Administration", "UI/UX Design", "Product Management",
  "Finance & Banking", "Marketing & Sales", "Entrepreneurship", "HR & People Management",
  "Healthcare & Medicine", "Public Health", "Fitness & Sports",
  "Education & Teaching", "Law & Legal", "Creative Arts & Design", "Film & Media",
  "Music", "Writing & Publishing", "Science & Research",
  "Government & Public Service", "NGO & Social Impact", "Trades & Skilled Work",
  "Construction & Infrastructure", "Hospitality & Tourism", "Food & Beverage",
];

const WORK_STYLES = ["remote", "hybrid", "onsite"];

async function fetchAssessment() {
  try {
    const res = await fetch("/api/assessment");
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default function AssessmentPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [workStyle, setWorkStyle] = useState("hybrid");
  const [skillInput, setSkillInput] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(async d => {
      if (!d || d.error) { router.push("/"); return; }
      if (d.onboarded) { router.push("/dashboard"); return; }
      setIsDemo(d.email === "demo@compass.app");
      const existing = await fetchAssessment();
      if (existing) {
        try { setSkills(JSON.parse(existing.skills)); } catch {}
        try { setInterests(JSON.parse(existing.interests)); } catch {}
        setEducation(existing.education || "");
        setExperience(existing.experience || "");
        setWorkStyle(existing.workStyle || "hybrid");
      }
      setPageLoading(false);
    }).catch(() => router.push("/"));
  }, [router]);

  const toggleSkill = (s: string) => {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const submitAssessment = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, interests, education, experience, workStyle }),
      });
      if (res.ok) router.push("/assessment/results");
      else { const err = await res.json(); alert(err.error || "Failed to save"); }
    } catch { alert("Network error"); }
    setSaving(false);
  };

  if (pageLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#0a0a12]">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center animate-pulse">
        <Compass className="w-5 h-5 text-indigo-400" />
      </div>
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-4 lg:p-8 overflow-y-auto bg-[#0a0a12]">
      <div className="max-w-3xl mx-auto" style={{ animation: "fadeIn 0.4s ease-out both" }}>
        {isDemo && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs text-center">
            <Zap className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            Demo profile pre-filled. Customize or continue.
          </div>
        )}

        <div data-tour="assessment-hero" className="mb-8 text-center" style={{ animation: "slideUp 0.5s ease-out both" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Let's Build Your Profile</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">Tell us about your skills and interests so we can personalize your career journey</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${step >= s ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30" : "bg-white/[0.04] text-slate-600"}`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 rounded-full transition-all ${step > s ? "bg-indigo-500" : "bg-white/[0.06]"}`} />}
            </div>
          ))}
        </div>

        <div data-tour="assessment-step" key={step} style={{ animation: "slideIn 0.35s ease-out both" }}>
          {step === 1 && (
            <div className="p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(17,17,24,0.6)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">What are your skills?</h2>
              </div>
              <p className="text-sm text-slate-500 mb-5">Select skills you know across any stream — add custom ones too</p>

              <div className="space-y-5">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.label}>
                    <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{cat.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s) => (
                        <button key={s} onClick={() => toggleSkill(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${skills.includes(s) ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm" : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:border-white/20 hover:text-slate-300"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (addCustomSkill(), e.preventDefault())}
                  placeholder="Add a custom skill..."
                  className="flex-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600" />
                <button type="button" onClick={addCustomSkill}
                  className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all">Add</button>
              </div>

              {skills.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-slate-600 mb-2">Selected ({skills.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20 flex items-center gap-1.5">
                        {s}
                        <button onClick={() => toggleSkill(s)} className="text-indigo-400/50 hover:text-indigo-300 transition-colors">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(17,17,24,0.6)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">What interests you?</h2>
              </div>
              <p className="text-sm text-slate-500 mb-5">Pick the domains you're excited about</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {INTEREST_OPTIONS.map((i) => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${interests.includes(i) ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm" : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:border-white/20 hover:text-slate-300"}`}>
                    {i}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Education</label>
                  <input value={education} onChange={e => setEducation(e.target.value)} placeholder="e.g. B.Tech Computer Science, Anna University, 2025"
                    className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Experience</label>
                  <textarea value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 2 internships — full-stack dev at a fintech startup"
                    className="w-full h-20 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2.5 block">Preferred Work Style</label>
                  <div className="flex gap-2">
                    {WORK_STYLES.map(ws => (
                      <button key={ws} onClick={() => setWorkStyle(ws)}
                        className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all border capitalize ${workStyle === ws ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm" : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:border-white/20 hover:text-slate-300"}`}>
                        {ws}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(17,17,24,0.6)" }}>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Review your profile</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Confirm everything looks right before we save</p>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><Code2 className="w-3.5 h-3.5" /> Skills ({skills.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => <span key={s} className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">{s}</span>)}
                    {skills.length === 0 && <span className="text-xs text-slate-600 italic">No skills selected</span>}
                  </div>
                </div>

                {interests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"><Heart className="w-3.5 h-3.5" /> Interests</div>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.map(i => <span key={i} className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20">{i}</span>)}
                    </div>
                  </div>
                )}

                {(education || experience) && <div className="h-px bg-white/[0.06]" />}

                {education && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5"><GraduationCap className="w-3.5 h-3.5" /> Education</div>
                    <p className="text-sm text-slate-300">{education}</p>
                  </div>
                )}

                {experience && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5"><Briefcase className="w-3.5 h-3.5" /> Experience</div>
                    <p className="text-sm text-slate-300">{experience}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5"><Zap className="w-3.5 h-3.5" /> Work Style</div>
                  <span className="px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs capitalize border border-indigo-500/20">{workStyle}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div data-tour="assessment-nav" className="flex items-center justify-between mt-6">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.push("/")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-all">
            <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Back to Home" : "Previous"}
          </button>

          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && skills.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20 text-white">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submitAssessment} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {saving ? "Saving..." : "Complete Profile"}
            </button>
          )}
        </div>
      </div>

      <PageTour id="assessment" steps={[
        { target: "[data-tour='assessment-hero']", title: "3 steps to your profile", body: "Compass builds your career profile from skills, interests and experience." },
        { target: "[data-tour='assessment-step']", title: "Pick your skills", body: "Select from AI-suggested categories or add your own — every choice sharpens your match." },
        { target: "[data-tour='assessment-nav']", title: "Review & complete", body: "Step through Back / Next and finish to unlock your AI career analysis." },
      ]}/>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
