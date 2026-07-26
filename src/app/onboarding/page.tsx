"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight, ArrowLeft, Loader2, Check, Sparkles } from "lucide-react";

const SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Data Analysis",
  "Machine Learning", "Communication", "Writing", "Design", "Figma",
  "Leadership", "Project Management", "Public Speaking", "Negotiation",
  "Problem Solving", "Critical Thinking", "Creativity", "Empathy",
  "Excel", "Photoshop", "Video Editing", "Marketing", "SEO",
  "Java", "C++", "Go", "Rust", "AWS", "Docker", "Kubernetes",
  "Git", "Linux", "Networking", "Cybersecurity", "Blockchain",
  "Statistics", "Research", "Financial Modeling", "Budgeting",
];

const INTERESTS = [
  "Technology", "Science", "Healthcare", "Business", "Finance",
  "Art & Design", "Education", "Environment", "Social Impact",
  "Entertainment", "Sports", "Food & Cooking", "Travel",
  "Writing", "Music", "Gaming", "Psychology", "Philosophy",
  "Law & Justice", "Politics", "Engineering", "Mathematics",
  "Animals & Nature", "History", "Languages", "Photography",
];

const PERSONALITY_TRAITS = [
  { key: "analytical", label: "Analytical", desc: "You enjoy solving complex problems with data and logic" },
  { key: "creative", label: "Creative", desc: "You love generating new ideas and thinking outside the box" },
  { key: "social", label: "Social", desc: "You thrive when working with and helping other people" },
  { key: "leader", label: "Leader", desc: "You naturally take charge and guide groups toward goals" },
  { key: "detail", label: "Detail-oriented", desc: "You notice the small things others miss" },
  { key: "adventurous", label: "Adventurous", desc: "You enjoy taking risks and trying new things" },
];

const VALUES = [
  "High salary", "Work-life balance", "Job security", "Helping others",
  "Creativity", "Independence", "Prestige", "Remote work",
  "Continuous learning", "Making an impact", "Team collaboration", "Stability",
];

const WORK_STYLES = [
  { value: "remote", label: "Remote", desc: "Work from anywhere" },
  { value: "hybrid", label: "Hybrid", desc: "Mix of office and remote" },
  { value: "office", label: "On-site", desc: "In person at workplace" },
  { value: "flexible", label: "Flexible", desc: "No preference" },
];

const EDUCATION = [
  { value: "highschool", label: "High School" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "selftaught", label: "Self-taught" },
  { value: "tradeschool", label: "Trade School" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [data, setData] = useState({
    skills: [] as string[],
    interests: [] as string[],
    personality: {} as Record<string, string>,
    values: [] as string[],
    workStyle: "hybrid",
    education: "bachelors",
  });

  const toggle = (field: "skills" | "interests" | "values", item: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item],
    }));
  };

  const setPersonality = (key: string, value: string) => {
    setData(prev => ({
      ...prev,
      personality: { ...prev.personality, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");

      setAiAnalyzing(true);
      try {
        const aiRes = await fetch("/api/ai/career-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: data.skills,
            interests: data.interests,
            personality: Object.entries(data.personality).map(([k, v]) => `${k}: ${v}`).join(", "),
            education: data.education,
            experience: "",
            values: data.values.join(", "),
          }),
        });
        const aiData = await aiRes.json();
        localStorage.setItem("compass_career_advice", JSON.stringify(aiData));
      } catch {
        // AI failed, proceed without it
      }

      router.push("/dashboard");
    } catch {
      setLoading(false);
      setAiAnalyzing(false);
    }
  };

  const STEPS = [
    { title: "Your Skills", subtitle: "Select skills you have (even basic ones)" },
    { title: "Your Interests", subtitle: "What fields excite you?" },
    { title: "Your Personality", subtitle: "How do you naturally work?" },
    { title: "Your Values", subtitle: "What matters most in a career?" },
    { title: "Work Preferences", subtitle: "How do you prefer to work?" },
  ];

  const progress = ((step + 1) / STEPS.length) * 100;

  if (aiAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">AI is analyzing your profile</h2>
          <p className="text-slate-400 text-sm mb-6">Gemini is generating personalized career recommendations based on your skills, interests, and personality...</p>
          <div className="space-y-2 text-left text-sm text-slate-500">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Profile saved</div>
            <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> Analyzing career compatibility...</div>
            <div className="flex items-center gap-2 opacity-30"><Loader2 className="w-4 h-4" /> Identifying skill gaps...</div>
            <div className="flex items-center gap-2 opacity-30"><Loader2 className="w-4 h-4" /> Building action plan...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {step + 1} of {STEPS.length}</span>
            <span className="text-sm text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="glass p-8 mb-6">
          <h2 className="text-2xl font-bold mb-1">{STEPS[step].title}</h2>
          <p className="text-slate-400 text-sm mb-6">{STEPS[step].subtitle}</p>

          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <button key={skill} onClick={() => toggle("skills", skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${data.skills.includes(skill) ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                  {skill}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button key={interest} onClick={() => toggle("interests", interest)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${data.interests.includes(interest) ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                  {interest}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {PERSONALITY_TRAITS.map(trait => (
                <div key={trait.key} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="font-medium">{trait.label}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{trait.desc}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {["low", "medium", "high"].map(level => (
                      <button key={level} onClick={() => setPersonality(trait.key, level)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${data.personality[trait.key] === level ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-wrap gap-2">
              {VALUES.map(value => (
                <button key={value} onClick={() => toggle("values", value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${data.values.includes(value) ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                  {value}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Work Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {WORK_STYLES.map(style => (
                    <button key={style.value} onClick={() => setData(p => ({ ...p, workStyle: style.value }))}
                      className={`p-4 rounded-xl text-left transition-all ${data.workStyle === style.value ? "bg-indigo-500/20 border border-indigo-500/40" : "bg-white/[0.02] border border-white/5 hover:border-white/10"}`}>
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Education</h3>
                <select value={data.education} onChange={e => setData(p => ({ ...p, education: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm">
                  {EDUCATION.map(ed => (
                    <option key={ed.value} value={ed.value} className="bg-[#16161f]">{ed.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-medium text-sm transition-all">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-medium text-sm transition-all glow-sm disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing..." : "AI Find My Paths"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
