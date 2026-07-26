"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, TrendingUp, TrendingDown, AlertTriangle, Zap, ArrowUpRight, Briefcase, FileText, Building2, GraduationCap, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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

interface MarketData {
  topGrowingSkills: Array<{ name: string; growth: number; demand: number }>;
  salaryTrends: Array<{ role: string; avg: number; trend: number[] }>;
  aiDisruptionTimeline: Array<{ year: number; atRisk: number; enhanced: number; safe: number }>;
  jobMarketHealth: { totalOpenings: number; unfilledTechJobs: number; avgTimeToHire: number; remoteWorkPercentage: number; aiAdoptionRate: number };
  emergingCareers: Array<{ title: string; growth: string; avgSalary: number }>;
  decliningRoles: Array<{ title: string; decline: string; risk: string }>;
}

export default function MarketPage() {
  const router = useRouter();
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
    });
    fetch("/api/market").then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/market" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
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
          <h1 className="text-2xl font-bold mb-1">Job Market Intelligence</h1>
          <p className="text-slate-400 text-sm mb-8">Real-time data on skills demand, salaries, AI disruption, and market trends</p>

          {/* Health Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total Openings", value: (data.jobMarketHealth.totalOpenings / 1000000).toFixed(1) + "M", icon: Zap },
              { label: "Unfilled Tech Jobs", value: (data.jobMarketHealth.unfilledTechJobs / 1000000).toFixed(1) + "M", icon: AlertTriangle },
              { label: "Avg Days to Hire", value: data.jobMarketHealth.avgTimeToHire.toString(), icon: TrendingUp },
              { label: "Remote Work", value: data.jobMarketHealth.remoteWorkPercentage + "%", icon: TrendingUp },
              { label: "AI Adoption", value: data.jobMarketHealth.aiAdoptionRate + "%", icon: Zap },
            ].map((s, i) => (
              <div key={i} className="glass p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <s.icon className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Growing Skills */}
            <div className="glass p-6">
              <h2 className="font-semibold mb-5 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Fastest Growing Skills</h2>
              <div className="space-y-3">
                {data.topGrowingSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-32 truncate">{skill.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${skill.demand}%` }} />
                    </div>
                    <span className="text-xs text-emerald-400 font-mono w-12 text-right">+{skill.growth}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Trends */}
            <div className="glass p-6">
              <h2 className="font-semibold mb-5 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-400" /> Average Salaries</h2>
              <div className="space-y-3">
                {data.salaryTrends.map((role, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-32 truncate">{role.role}</span>
                    <div className="flex-1 flex items-center gap-1">
                      {role.trend.map((val, j) => (
                        <div key={j} className="flex-1 rounded-sm bg-indigo-500/20" style={{ height: `${(val / 200) * 20}px` }}>
                          <div className="w-full rounded-sm bg-indigo-400 transition-all" style={{ height: "100%" }} />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-mono w-16 text-right">${(role.avg / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* AI Disruption Timeline */}
            <div className="glass p-6">
              <h2 className="font-semibold mb-5 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" /> AI Disruption Timeline</h2>
              <div className="space-y-3">
                {data.aiDisruptionTimeline.map((year, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono">{year.year}</span>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-red-400">{year.atRisk}% at risk</span>
                        <span className="text-yellow-400">{year.enhanced}% enhanced</span>
                        <span className="text-green-400">{year.safe}% safe</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full flex overflow-hidden">
                      <div className="bg-red-500/60 transition-all" style={{ width: `${year.atRisk}%` }} />
                      <div className="bg-yellow-500/60 transition-all" style={{ width: `${year.enhanced}%` }} />
                      <div className="bg-green-500/60 transition-all" style={{ width: `${year.safe}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/60" /> At Risk</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500/60" /> Enhanced by AI</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500/60" /> Safe</span>
              </div>
            </div>

            {/* Emerging vs Declining */}
            <div className="space-y-6">
              <div className="glass p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400" /> Emerging Careers</h2>
                <div className="space-y-2">
                  {data.emergingCareers.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-sm">{c.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-400 font-mono">{c.growth}</span>
                        <span className="text-xs text-slate-500">${(c.avgSalary / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-400" /> Declining Roles</h2>
                <div className="space-y-2">
                  {data.decliningRoles.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-sm">{c.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-red-400 font-mono">{c.decline}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          c.risk === "critical" ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400"
                        }`}>{c.risk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


