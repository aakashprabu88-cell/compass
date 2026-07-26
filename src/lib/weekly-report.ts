import { prisma } from "./db";

interface WeeklyReportData {
  applicationsSent: number;
  interviewsScheduled: number;
  skillsImproved: string[];
  newMatches: number;
  topCareerMatch: string;
  summary: string;
  recommendations: string[];
}

export async function generateWeeklyReport(userId: string): Promise<WeeklyReportData> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Get applications this week
  const apps = await prisma.jobApplication.findMany({
    where: {
      userId,
      appliedAt: { gte: weekStart, lte: weekEnd },
    },
  });

  const interviews = apps.filter(a => a.status === "interview");

  // Get skill gaps
  const gaps = await prisma.skillGap.findMany({
    where: { userId },
    orderBy: { gap: "desc" },
  });

  const highPriorityGaps = gaps.filter(g => g.priority === "high");

  // Get top career match
  const topPath = await prisma.userPath.findFirst({
    where: { userId },
    include: { careerPath: true },
    orderBy: { matchScore: "desc" },
  });

  // Get total applications (all time)
  const totalApps = await prisma.jobApplication.count({
    where: { userId },
  });

  // Generate summary
  const summary = `This week you applied to ${apps.length} positions${interviews.length > 0 ? `, secured ${interviews.length} interview(s)` : ""}. Your top career match remains ${topPath?.careerPath?.title || "TBD"} at ${topPath ? Math.round(topPath.matchScore * 100) : 0}% compatibility. ${highPriorityGaps.length > 0 ? `Focus on building ${highPriorityGaps.map(g => g.skillName).join(", ")} to strengthen your profile.` : "Your skill profile is well-matched to your target careers."}`;

  // Generate recommendations
  const recommendations: string[] = [];
  if (apps.length < 5) recommendations.push("Apply to more jobs this week — aim for 5-10 applications per week.");
  if (interviews.length === 0 && totalApps > 5) recommendations.push("Consider updating your resume and cover letter for better matching.");
  if (highPriorityGaps.length > 0) recommendations.push(`Prioritize learning: ${highPriorityGaps.slice(0, 3).map(g => g.skillName).join(", ")}`);
  if (interviews.length > 0) recommendations.push(`Great progress! Prepare for your ${interviews.length} upcoming interview(s).`);
  recommendations.push("Review your career paths weekly to stay aligned with market trends.");

  return {
    applicationsSent: apps.length,
    interviewsScheduled: interviews.length,
    skillsImproved: highPriorityGaps.slice(0, 3).map(g => g.skillName),
    newMatches: 0,
    topCareerMatch: topPath?.careerPath?.title || "N/A",
    summary,
    recommendations,
  };
}

export async function getOrCreateWeeklyReport(userId: string) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const existing = await prisma.weeklyReport.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  if (existing) return existing;

  const data = await generateWeeklyReport(userId);
  return prisma.weeklyReport.create({
    data: {
      userId,
      weekStart,
      weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
      applicationsSent: data.applicationsSent,
      interviewsScheduled: data.interviewsScheduled,
      skillsImproved: JSON.stringify(data.skillsImproved),
      newMatches: data.newMatches,
      topCareerMatch: data.topCareerMatch,
      summary: data.summary,
      recommendations: JSON.stringify(data.recommendations),
    },
  });
}
