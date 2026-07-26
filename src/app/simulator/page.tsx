"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Briefcase, FileText, Building2, GraduationCap, Target, TrendingUp, TrendingDown, Shield, AlertTriangle, Lightbulb, BarChart3, GitBranch, Zap, ChevronDown, Trophy, IndianRupee, Mic } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { SimulationParams, SimulationResult, runSimulation, generateRecommendation } from "@/lib/simulator";

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
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

const ROLES = [
  "Software Engineer", "Data Scientist", "Product Manager", "UX Designer",
  "DevOps Engineer", "Cybersecurity Analyst", "AI/ML Engineer", "Business Analyst",
  "Cloud Architect", "Mobile Developer", "Full Stack Developer", "Backend Developer",
  "Frontend Developer", "QA Engineer", "Technical Writer", "System Administrator",
  "Network Engineer", "Database Administrator", "Project Manager", "Marketing Manager",
  "Financial Analyst", "HR Manager", "Sales Manager", "Operations Manager",
  "Content Creator", "Graphic Designer", "Video Editor", "Teacher", "Nurse", "Doctor",
  "Lawyer", "Mechanical Engineer", "Civil Engineer", "Electrical Engineer"
];

const CITIES = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Remote"];

export default function SimulatorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const [currentRole, setCurrentRole] = useState("Software Engineer");
  const [currentSalary, setCurrentSalary] = useState(5);
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [targetCity, setTargetCity] = useState("Bangalore");
  const [riskTolerance, setRiskTolerance] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [years, setYears] = useState(5);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const runSim = () => {
    setSimulating(true);
    setResult(null);
    setTimeout(() => {
      const params: SimulationParams = {
        currentRole, currentSalary, targetRole, targetCity,
        riskTolerance, years, currentSkills: []
      };
      const res = runSimulation(params);
      setResult(res);
      setSimulating(false);
    }, 50);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const salaryData = result ? result.percentiles.p50.map((v, i) => ({
    year: `Year ${i + 1}`,
    p10: result.percentiles.p10[i],
    p50: result.percentiles.p50[i],
    p90: result.percentiles.p90[i],
  })) : [];

  const skillData = result ? result.skillGrowth.map(s => ({
    year: `Year ${s.year}`,
    Skills: s.skills,
    Experience: s.experience,
    Network: s.network,
    Overall: s.overall,
  })) : [];

  const riskData = result ? result.riskAnalysis.map(r => ({
    subject: r.label.replace(" Risk", ""),
    score: r.score,
    fullMark: 100,
  })) : [];

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/simulator" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3"><GitBranch className="w-7 h-7 text-indigo-400" /> Career Simulator</h1>
          <p className="text-slate-400 text-sm mb-6">Simulate your career transition — see salary, skills, and risk projections over time</p>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="glass p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Configure Simulation</h3>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Current Role</label>
                  <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Current Salary (LPA)</label>
                  <input type="number" value={currentSalary} onChange={e => setCurrentSalary(Number(e.target.value))} min={1} max={100}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Target Role</label>
                  <select value={targetRole} onChange={e => setTargetRole(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Target City</label>
                  <select value={targetCity} onChange={e => setTargetCity(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Risk Tolerance</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["conservative", "moderate", "aggressive"] as const).map(r => (
                      <button key={r} onClick={() => setRiskTolerance(r)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${riskTolerance === r ? "bg-indigo-500 text-white" : "bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Timeline: {years} years</label>
                  <input type="range" min={1} max={10} value={years} onChange={e => setYears(Number(e.target.value))}
                    className="w-full accent-indigo-500" />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>1 year</span><span>10 years</span></div>
                </div>

                <button onClick={runSim} disabled={simulating}
                  className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {simulating ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Simulating...</>) : (<><Zap className="w-4 h-4" /> Run Simulation</>)}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {!result && !simulating && (
                <div className="glass p-16 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configure Your Simulation</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">Select your current role, target role, and preferences on the left, then click Run Simulation to see your projected career trajectory over the next few years.</p>
                </div>
              )}

              {simulating && (
                <div className="glass p-16 text-center">
                  <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Running Monte Carlo Simulation</h3>
                  <p className="text-sm text-slate-500">Generating 1,000 career trajectories...</p>
                </div>
              )}

              {result && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Median Final Salary</div>
                      <div className="text-2xl font-bold text-indigo-400">₹{result.summary.medianFinalSalary}L</div>
                      <div className="text-[10px] text-slate-500 mt-1">per annum</div>
                    </div>
                    <div className="glass p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Salary Growth</div>
                      <div className={`text-2xl font-bold flex items-center gap-1 ${result.summary.salaryGrowth > 0 ? "text-green-400" : "text-red-400"}`}>
                        {result.summary.salaryGrowth > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {Math.abs(result.summary.salaryGrowth)}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">over {years} years</div>
                    </div>
                    <div className="glass p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Best Case (90th)</div>
                      <div className="text-2xl font-bold text-green-400">₹{result.summary.bestCase}L</div>
                      <div className="text-[10px] text-slate-500 mt-1">top 10% outcome</div>
                    </div>
                    <div className="glass p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Worst Case (10th)</div>
                      <div className="text-2xl font-bold text-orange-400">₹{result.summary.worstCase}L</div>
                      <div className="text-[10px] text-slate-500 mt-1">bottom 10% outcome</div>
                    </div>
                  </div>

                  {/* Salary Trajectory Chart */}
                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-400" /> Salary Trajectory (Monte Carlo)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salaryData}>
                        <defs>
                          <linearGradient id="p90fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="p50fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="p10fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={v => `₹${v}L`} />
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(v) => [`₹${v}L`, ""]} />
                        <Area type="monotone" dataKey="p90" stroke="#22c55e" fill="url(#p90fill)" strokeWidth={1.5} name="Best Case (P90)" />
                        <Area type="monotone" dataKey="p50" stroke="#6366f1" fill="url(#p50fill)" strokeWidth={2.5} name="Median (P50)" />
                        <Area type="monotone" dataKey="p10" stroke="#f97316" fill="url(#p10fill)" strokeWidth={1.5} name="Worst Case (P10)" />
                        <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Skill Growth + Risk */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    <div className="glass p-5">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4">Skill & Growth Trajectory</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={skillData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                          <Line type="monotone" dataKey="Skills" stroke="#6366f1" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="Experience" stroke="#22c55e" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="Network" stroke="#f59e0b" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="Overall" stroke="#ec4899" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="glass p-5">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-400" /> Risk Analysis</h3>
                      <div className="space-y-4">
                        {result.riskAnalysis.map((r, i) => {
                          const color = r.score <= 30 ? "bg-green-500" : r.score <= 60 ? "bg-yellow-500" : "bg-red-500";
                          const textColor = r.score <= 30 ? "text-green-400" : r.score <= 60 ? "text-yellow-400" : "text-red-400";
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-400">{r.label}</span>
                                <span className={`text-xs font-medium ${textColor}`}>{r.score}/100</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${r.score}%` }} />
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5">{r.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400" /> AI Recommendation</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{result.summary.recommendation}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
