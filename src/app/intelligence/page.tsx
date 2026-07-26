"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass, LogOut, LayoutDashboard, Route, Briefcase, FileText,
  GraduationCap, Target, Building2,
  Radar, TrendingUp, TrendingDown, IndianRupee, Users, Zap,
  Lightbulb, BarChart3, ArrowUp, ArrowDown, Minus,
  Trophy,
  GitBranch,
  Shield,
  Mic,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  findHotCompanies, calculateIndustryDemand, getSalaryTrends,
  generateHiringInsights,
  type CompanyGrowthSignal, type IndustryDemand, type SalaryTrend,
} from "@/lib/hiring-intelligence";

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

export default function IntelligencePage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [hotCompanies, setHotCompanies] = useState<CompanyGrowthSignal[]>([]);
  const [industries, setIndustries] = useState<IndustryDemand[]>([]);
  const [salaryByRole, setSalaryByRole] = useState<SalaryTrend[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  const [uniqueCompanies, setUniqueCompanies] = useState(0);
  const [hottestIndustry, setHottestIndustry] = useState("");
  const [avgSalary, setAvgSalary] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/login"); return; }
        if (!d.onboarded) { router.push("/onboarding"); return; }
      });
  }, [router]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => {
        const apiJobs = d.jobs || [];
        import("@/lib/jobs").then((mod) => {
          const localJobs = mod.JOB_DATABASE.map((j: any) => ({
            ...j,
            salaryMin: j.salaryMin * 1000,
            salaryMax: j.salaryMax * 1000,
          }));
          const combined = [...localJobs, ...apiJobs];
          setAllJobs(combined);

          const companySet = new Set(combined.map((j: any) => j.company));
          setUniqueCompanies(companySet.size);

          const salSum = combined
            .map((j: any) => j.salaryMin || 0)
            .filter((s: number) => s > 0);
          const avg = salSum.length
            ? Math.round(salSum.reduce((a: number, b: number) => a + b, 0) / salSum.length)
            : 0;
          setAvgSalary(avg);

          const indDemand = calculateIndustryDemand(combined);
          setIndustries(indDemand);
          setHottestIndustry(indDemand[0]?.industry || "—");

          setHotCompanies(findHotCompanies(combined));
          setSalaryByRole(getSalaryTrends(combined));
          setInsights(generateHiringInsights(combined));

          setLoading(false);
        });
      });
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <aside
        className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto"
        style={{ background: "rgba(17,17,24,0.5)" }}
      >
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.href === "/intelligence"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Radar className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold">Hiring Intelligence</h1>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Real-time hiring signals, salary benchmarks, and market trends
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Companies Hiring", value: uniqueCompanies, icon: Building2, color: "indigo" },
              { label: "Hottest Industry", value: hottestIndustry, icon: TrendingUp, color: "red" },
              { label: "Avg Salary", value: `₹${avgSalary}K`, icon: IndianRupee, color: "green" },
              { label: "Active Openings", value: allJobs.length, icon: Users, color: "purple" },
            ].map((s) => (
              <div key={s.label} className="glass p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/10 flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                </div>
                <div>
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hot Companies */}
          <div className="glass p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold text-sm">Hot Companies</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">Company</th>
                    <th className="text-left pb-3 font-medium">Jobs</th>
                    <th className="text-left pb-3 font-medium">Growth Score</th>
                    <th className="text-left pb-3 font-medium">Trend</th>
                    <th className="text-left pb-3 font-medium">Top Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {hotCompanies.map((c) => (
                    <tr key={c.company} className="border-t border-white/5">
                      <td className="py-3 font-medium text-white">{c.company}</td>
                      <td className="py-3 text-slate-300">{c.jobCount}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                c.growthScore >= 60
                                  ? "bg-green-400"
                                  : c.growthScore >= 30
                                    ? "bg-yellow-400"
                                    : "bg-slate-500"
                              }`}
                              style={{ width: `${c.growthScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{c.growthScore}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {c.trend === "growing" && (
                          <span className="flex items-center gap-1 text-green-400 text-xs">
                            <ArrowUp className="w-3 h-3" /> Growing
                          </span>
                        )}
                        {c.trend === "stable" && (
                          <span className="flex items-center gap-1 text-yellow-400 text-xs">
                            <Minus className="w-3 h-3" /> Stable
                          </span>
                        )}
                        {c.trend === "shrinking" && (
                          <span className="flex items-center gap-1 text-red-400 text-xs">
                            <ArrowDown className="w-3 h-3" /> Shrinking
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.topRoles.map((r) => (
                            <span
                              key={r}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Industry Demand */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h2 className="font-semibold text-sm">Industry Demand</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {industries.map((ind) => {
                const borderColor =
                  ind.demandLevel === "hot"
                    ? "border-red-500/30"
                    : ind.demandLevel === "warm"
                      ? "border-yellow-500/30"
                      : "border-blue-500/30";
                const bgColor =
                  ind.demandLevel === "hot"
                    ? "bg-red-500/5"
                    : ind.demandLevel === "warm"
                      ? "bg-yellow-500/5"
                      : "bg-blue-500/5";
                return (
                  <div
                    key={ind.industry}
                    className={`glass p-4 border ${borderColor} ${bgColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{ind.industry}</h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          ind.demandLevel === "hot"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : ind.demandLevel === "warm"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ind.demandLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-1">
                      {ind.jobCount} jobs · ₹{ind.avgSalary}K avg
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ind.topSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Salary by Role */}
          <div className="glass p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="w-4 h-4 text-green-400" />
              <h2 className="font-semibold text-sm">Salary by Role</h2>
            </div>
            {salaryByRole.length > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salaryByRole.slice(0, 15)}
                    layout="vertical"
                    margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(v: number) => `₹${v / 1000}L`}
                      axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="role"
                      width={160}
                      tick={{ fill: "#cbd5e1", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17,17,24,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#94a3b8" }}
                      formatter={(value) => [`₹${Math.round(Number(value) / 1000)}L avg`, "Salary"]}
                    />
                    <Bar
                      dataKey="avgSalary"
                      fill="rgba(99,102,241,0.6)"
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No salary data available</p>
            )}
          </div>

          {/* AI Insights */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h2 className="font-semibold text-sm">AI Insights</h2>
            </div>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
