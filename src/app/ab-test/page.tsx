"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, Trophy, AlertTriangle, Sparkles, ChevronDown, ChevronUp, RotateCcw, Copy, Check } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface ResumeVersion {
  id: string;
  label: string;
  content: string;
  atsScore: number;
  sectionScores: { name: string; score: number; feedback: string }[];
  missingKeywords: string[];
  suggestions: string[];
  optimizedSummary: string;
  timestamp: string;
}

export default function ABTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "compare">("upload");
  const [currentLabel, setCurrentLabel] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);
        try {
          const stored = JSON.parse(localStorage.getItem("compass_resume_ab_test") || "[]");
          setVersions(Array.isArray(stored) ? stored : []);
        } catch {}
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const analyzeVersion = async () => {
    if (!currentContent.trim() || !currentLabel.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: currentContent, jobDescription: jobDescription || undefined }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      const version: ResumeVersion = {
        id: Date.now().toString(),
        label: currentLabel,
        content: currentContent,
        atsScore: data.atsScore || 0,
        sectionScores: data.sectionScores || [],
        missingKeywords: data.missingKeywords || [],
        suggestions: data.suggestions || [],
        optimizedSummary: data.optimizedSummary || "",
        timestamp: new Date().toISOString(),
      };

      const updated = [...versions, version];
      setVersions(updated);
      localStorage.setItem("compass_resume_ab_test", JSON.stringify(updated));

      if (updated.length >= 2) {
        const sorted = [...updated].sort((a, b) => b.atsScore - a.atsScore);
        setWinner(sorted[0].id);
        setActiveTab("compare");
      }

      setCurrentLabel("");
      setCurrentContent("");
    } catch {} finally { setAnalyzing(false); }
  };

  const removeVersion = (id: string) => {
    const updated = versions.filter(v => v.id !== id);
    setVersions(updated);
    localStorage.setItem("compass_resume_ab_test", JSON.stringify(updated));
    if (winner === id) {
      const sorted = [...updated].sort((a, b) => b.atsScore - a.atsScore);
      setWinner(sorted[0]?.id || null);
    }
  };

  const clearAll = () => {
    setVersions([]);
    setWinner(null);
    localStorage.removeItem("compass_resume_ab_test");
  };

  const sorted = [...versions].sort((a, b) => b.atsScore - a.atsScore);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-cyan-400" /> A/B Resume Testing</h1>
              <p className="text-slate-400 text-sm mt-1">Compare resume versions side-by-side to find the highest ATS score</p>
            </div>
            <div className="flex gap-2">
              {versions.length > 0 && (
                <button onClick={clearAll} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs transition-colors">Clear All</button>
              )}
            </div>
          </motion.div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "upload" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10"}`}>
              Add Version ({versions.length})
            </button>
            <button onClick={() => setActiveTab("compare")} disabled={versions.length < 2}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "compare" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10 disabled:opacity-40"}`}>
              Compare ({versions.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "upload" ? (
              <motion.div key="upload" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input form */}
                  <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                    <h3 className="font-semibold mb-4">Add Resume Version</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Version Label *</label>
                        <input value={currentLabel} onChange={e => setCurrentLabel(e.target.value)}
                          placeholder="e.g., Version A - Technical Focus"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Resume Content *</label>
                        <textarea value={currentContent} onChange={e => setCurrentContent(e.target.value)} rows={12}
                          placeholder="Paste your resume text here..."
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-none font-mono text-xs leading-relaxed" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Target Job Description (optional)</label>
                        <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4}
                          placeholder="Paste the job description for targeted ATS scoring..."
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" />
                      </div>
                      <button onClick={analyzeVersion} disabled={analyzing || !currentContent.trim() || !currentLabel.trim()}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-40 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                        {analyzing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Analyze Resume</>}
                      </button>
                    </div>
                  </div>

                  {/* Existing versions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-2">Analyzed Versions</h3>
                    {sorted.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p>No versions analyzed yet. Add your first resume version to start comparing.</p>
                      </div>
                    )}
                    {sorted.map((v, i) => (
                      <motion.div key={v.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border transition-all ${winner === v.id ? "bg-emerald-500/[0.05] border-emerald-500/30" : "bg-white/[0.03] border-white/5"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {winner === v.id && <Trophy className="w-4 h-4 text-emerald-400" />}
                            <span className="font-medium text-sm">{v.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${v.atsScore >= 80 ? "text-emerald-400" : v.atsScore >= 60 ? "text-amber-400" : "text-red-400"}`}>
                              {v.atsScore}%
                            </span>
                            <button onClick={() => removeVersion(v.id)} className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors">
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 mb-2">
                          <div className={`h-full rounded-full transition-all ${v.atsScore >= 80 ? "bg-emerald-500" : v.atsScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${v.atsScore}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-600">{new Date(v.timestamp).toLocaleString()} · {v.content.length} chars</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="compare" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {sorted.length < 2 ? (
                  <div className="text-center py-20 text-slate-500">
                    <p>Add at least 2 resume versions to compare.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Winner banner */}
                    {winner && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Trophy className="w-7 h-7 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-emerald-400">Winner: {sorted[0].label}</h3>
                            <p className="text-sm text-slate-400">ATS Score: {sorted[0].atsScore}% — {sorted[0].atsScore > sorted[1].atsScore ? `${sorted[0].atsScore - sorted[1].atsScore}% higher` : "tied"} than runner-up</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Side by side comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sorted.map((v, i) => (
                        <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                          className={`p-6 rounded-xl border ${i === 0 ? "bg-emerald-500/[0.03] border-emerald-500/20" : "bg-white/[0.03] border-white/5"}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {i === 0 && <Trophy className="w-4 h-4 text-emerald-400" />}
                              <span className="font-semibold">{v.label}</span>
                              {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">BEST</span>}
                            </div>
                            <span className={`text-2xl font-bold ${v.atsScore >= 80 ? "text-emerald-400" : v.atsScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{v.atsScore}%</span>
                          </div>

                          {/* Section scores */}
                          {v.sectionScores.length > 0 && (
                            <div className="mb-4 space-y-2">
                              {v.sectionScores.map((s, j) => (
                                <div key={j}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">{s.name}</span>
                                    <span className={`font-medium ${s.score >= 80 ? "text-emerald-400" : s.score >= 50 ? "text-amber-400" : "text-red-400"}`}>{s.score}%</span>
                                  </div>
                                  <div className="h-1 rounded-full bg-white/5">
                                    <div className={`h-full rounded-full ${s.score >= 80 ? "bg-emerald-500" : s.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                      style={{ width: `${s.score}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Missing keywords */}
                          {v.missingKeywords.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Missing Keywords ({v.missingKeywords.length})
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {v.missingKeywords.slice(0, 8).map((kw, j) => (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{kw}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggestions */}
                          {v.suggestions.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Suggestions</h4>
                              <ul className="space-y-1">
                                {v.suggestions.slice(0, 4).map((s, j) => (
                                  <li key={j} className="text-xs text-slate-400 flex items-start gap-1.5">
                                    <span className="text-cyan-400 mt-0.5">→</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Keyword diff */}
                    {sorted.length >= 2 && (
                      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                        <h3 className="font-semibold mb-3">Keyword Coverage Diff</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sorted.slice(0, 2).map((v, i) => (
                            <div key={v.id}>
                              <div className="text-xs text-slate-400 mb-2">{v.label}</div>
                              <div className="flex flex-wrap gap-1.5">
                                {v.missingKeywords.length === 0 ? (
                                  <span className="text-xs text-emerald-400">All keywords covered!</span>
                                ) : v.missingKeywords.map((kw, j) => (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{kw}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
