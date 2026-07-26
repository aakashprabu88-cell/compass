export interface CompanyGrowthSignal {
  company: string;
  jobCount: number;
  growthScore: number;
  trend: "growing" | "stable" | "shrinking";
  avgSalary: number;
  topRoles: string[];
  industries: string[];
  signal: string;
}

export interface IndustryDemand {
  industry: string;
  jobCount: number;
  avgSalary: number;
  growthRate: number;
  topSkills: string[];
  demandLevel: "hot" | "warm" | "cool";
}

export interface HiringTrend {
  period: string;
  totalJobs: number;
  avgSalary: number;
  topCompanies: string[];
}

export interface SalaryTrend {
  role: string;
  avgSalary: number;
  trend: string;
  jobCount: number;
}

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

export function analyzeCompanyGrowth(jobs: any[]): CompanyGrowthSignal[] {
  const byCompany: Record<string, any[]> = {};
  for (const j of jobs) {
    const c = j.company || "Unknown";
    if (!byCompany[c]) byCompany[c] = [];
    byCompany[c].push(j);
  }

  return Object.entries(byCompany).map(([company, cJobs]) => {
    const jobCount = cJobs.length;
    const salaries = cJobs.map((j: any) => j.salaryMin || j.salaryMax || 0).filter((s: number) => s > 0);
    const avgSalary = Math.round(avg(salaries) / 1000);
    const recentJobs = cJobs.filter((j: any) => {
      const days = j.postedDaysAgo || 99;
      return days <= 7;
    }).length;

    const roles = [...new Set(cJobs.map((j: any) => j.title))];
    const industries = [...new Set(cJobs.flatMap((j: any) => j.industries || []))];

    let growthScore = 0;
    growthScore += Math.min(jobCount * 12, 40);
    growthScore += Math.min(recentJobs * 8, 25);
    growthScore += Math.min(avgSalary / 100, 20);
    growthScore += Math.min(roles.length * 3, 15);
    growthScore = Math.min(Math.round(growthScore), 100);

    const trend: "growing" | "stable" | "shrinking" = growthScore >= 60 ? "growing" : growthScore >= 30 ? "stable" : "shrinking";

    let signal = "";
    if (trend === "growing") signal = `${company} has ${jobCount} active openings — strong hiring signal`;
    else if (trend === "stable") signal = `${company} maintaining steady hiring with ${jobCount} positions`;
    else signal = `${company} has limited openings — may be consolidating`;

    return { company, jobCount, growthScore, trend, avgSalary, topRoles: roles.slice(0, 3), industries, signal };
  }).sort((a, b) => b.growthScore - a.growthScore);
}

export function detectHiringTrends(jobs: any[]): HiringTrend[] {
  const recent = jobs.filter((j: any) => (j.postedDaysAgo || 99) <= 7);
  const older = jobs.filter((j: any) => (j.postedDaysAgo || 99) > 7 && (j.postedDaysAgo || 99) <= 30);

  const recentCompanies = [...new Set(recent.map((j: any) => j.company))];
  const olderCompanies = [...new Set(older.map((j: any) => j.company))];

  return [
    { period: "Last 7 days", totalJobs: recent.length, avgSalary: Math.round(avg(recent.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0))), topCompanies: recentCompanies.slice(0, 5) },
    { period: "8-30 days ago", totalJobs: older.length, avgSalary: Math.round(avg(older.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0))), topCompanies: olderCompanies.slice(0, 5) },
  ];
}

export function calculateIndustryDemand(jobs: any[]): IndustryDemand[] {
  const byIndustry: Record<string, any[]> = {};
  for (const j of jobs) {
    const industries = j.industries || ["Other"];
    for (const ind of industries) {
      if (!byIndustry[ind]) byIndustry[ind] = [];
      byIndustry[ind].push(j);
    }
  }

  return Object.entries(byIndustry).map(([industry, iJobs]) => {
    const salaries = iJobs.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0);
    const avgSalary = Math.round(avg(salaries));
    const skillCounts: Record<string, number> = {};
    for (const j of iJobs) {
      for (const s of (j.requiredSkills || [])) {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      }
    }
    const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s);
    const recentCount = iJobs.filter((j: any) => (j.postedDaysAgo || 99) <= 5).length;
    const growthRate = iJobs.length > 0 ? Math.round((recentCount / iJobs.length) * 100) : 0;
    const demandLevel: "hot" | "warm" | "cool" = iJobs.length >= 5 ? "hot" : iJobs.length >= 2 ? "warm" : "cool";

    return { industry, jobCount: iJobs.length, avgSalary, growthRate, topSkills, demandLevel };
  }).sort((a, b) => b.jobCount - a.jobCount);
}

export function findHotCompanies(jobs: any[]): CompanyGrowthSignal[] {
  return analyzeCompanyGrowth(jobs).slice(0, 10);
}

export function getSalaryTrends(jobs: any[]): SalaryTrend[] {
  const byRole: Record<string, any[]> = {};
  for (const j of jobs) {
    const role = j.title || "Unknown";
    if (!byRole[role]) byRole[role] = [];
    byRole[role].push(j);
  }

  return Object.entries(byRole).map(([role, rJobs]) => {
    const salaries = rJobs.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0);
    const avgSalary = Math.round(avg(salaries));
    const recentCount = rJobs.filter((j: any) => (j.postedDaysAgo || 99) <= 7).length;
    const trend = recentCount > rJobs.length * 0.3 ? "rising" : recentCount > 0 ? "stable" : "cooling";
    return { role, avgSalary, trend, jobCount: rJobs.length };
  }).sort((a, b) => b.avgSalary - a.avgSalary);
}

export function generateHiringInsights(jobs: any[]): string[] {
  const insights: string[] = [];
  const companies = analyzeCompanyGrowth(jobs);
  const hot = companies.filter(c => c.trend === "growing");
  if (hot.length > 0) {
    insights.push(`${hot[0].company} is the hottest employer right now with ${hot[0].jobCount} active openings across ${hot[0].industries.join(", ")}`);
  }
  const industries = calculateIndustryDemand(jobs);
  const topIndustry = industries[0];
  if (topIndustry) {
    insights.push(`${topIndustry.industry} leads with ${topIndustry.jobCount} open positions — average salary ₹${topIndustry.avgSalary}K`);
  }
  const techJobs = jobs.filter((j: any) => (j.industries || []).includes("Technology"));
  if (techJobs.length > 0) {
    const techSalaries = techJobs.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0);
    const nonTech = jobs.filter((j: any) => !(j.industries || []).includes("Technology"));
    const nonTechSal = nonTech.map((j: any) => j.salaryMin || 0).filter((s: number) => s > 0);
    if (avg(techSalaries) > avg(nonTechSal)) {
      const diff = Math.round(((avg(techSalaries) - avg(nonTechSal)) / avg(nonTechSal)) * 100);
      insights.push(`Tech roles pay ${diff}% more than non-tech roles on average`);
    }
  }
  const urgent = jobs.filter((j: any) => j.urgent);
  if (urgent.length > 0) {
    insights.push(`${urgent.length} companies have URGENT hiring needs — apply immediately for faster responses`);
  }
  const remote = jobs.filter((j: any) => j.type === "remote" || (j.location || "").toLowerCase().includes("remote"));
  if (remote.length > 0) {
    insights.push(`${remote.length} remote positions available — location is no longer a barrier`);
  }
  if (insights.length < 5) {
    insights.push(`${jobs.length} total opportunities currently available across ${companies.length} companies`);
  }
  return insights.slice(0, 6);
}
