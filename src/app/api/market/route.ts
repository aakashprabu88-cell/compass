import { NextResponse } from "next/server";

// Simulated real-time market data
const MARKET_DATA = {
  topGrowingSkills: [
    { name: "AI/ML", growth: 74, demand: 95 },
    { name: "Cloud Computing", growth: 42, demand: 88 },
    { name: "Cybersecurity", growth: 35, demand: 92 },
    { name: "Data Engineering", growth: 30, demand: 85 },
    { name: "DevOps", growth: 28, demand: 80 },
    { name: "UX Research", growth: 22, demand: 72 },
    { name: "Product Management", growth: 18, demand: 75 },
    { name: "Full-Stack Dev", growth: 15, demand: 82 },
  ],
  salaryTrends: [
    { role: "AI Engineer", avg: 185000, trend: [120, 135, 150, 165, 175, 185] },
    { role: "Software Eng", avg: 145000, trend: [110, 118, 125, 132, 140, 145] },
    { role: "Data Scientist", avg: 137000, trend: [95, 105, 115, 125, 132, 137] },
    { role: "Cybersecurity", avg: 130000, trend: [85, 95, 105, 115, 125, 130] },
    { role: "UX Designer", avg: 112000, trend: [80, 85, 92, 98, 105, 112] },
    { role: "Product Manager", avg: 145000, trend: [100, 110, 120, 130, 138, 145] },
  ],
  aiDisruptionTimeline: [
    { year: 2024, atRisk: 15, enhanced: 25, safe: 60 },
    { year: 2025, atRisk: 20, enhanced: 30, safe: 50 },
    { year: 2026, atRisk: 28, enhanced: 35, safe: 37 },
    { year: 2027, atRisk: 35, enhanced: 40, safe: 25 },
    { year: 2028, atRisk: 40, enhanced: 42, safe: 18 },
    { year: 2030, atRisk: 50, enhanced: 45, safe: 5 },
  ],
  jobMarketHealth: {
    totalOpenings: 8200000,
    unfilledTechJobs: 1400000,
    avgTimeToHire: 42,
    remoteWorkPercentage: 38,
    aiAdoptionRate: 72,
  },
  emergingCareers: [
    { title: "AI Ethics Officer", growth: "+340%", avgSalary: 165000 },
    { title: "Prompt Engineer", growth: "+280%", avgSalary: 135000 },
    { title: "AI Safety Researcher", growth: "+250%", avgSalary: 180000 },
    { title: "Digital Twin Architect", growth: "+200%", avgSalary: 155000 },
    { title: "Sustainability Analyst", growth: "+180%", avgSalary: 85000 },
  ],
  decliningRoles: [
    { title: "Data Entry Clerk", decline: "-45%", risk: "critical" },
    { title: "Telemarketer", decline: "-40%", risk: "critical" },
    { title: "Bank Teller", decline: "-35%", risk: "high" },
    { title: "Travel Agent", decline: "-30%", risk: "high" },
    { title: "Bookkeeper", decline: "-28%", risk: "high" },
  ],
};

export async function GET() {
  return NextResponse.json(MARKET_DATA);
}
