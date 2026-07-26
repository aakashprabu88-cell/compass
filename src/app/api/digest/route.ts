import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const [applications, paths, gaps, lastReport] = await Promise.all([
      prisma.jobApplication.findMany({
        where: {
          userId: user.id,
          appliedAt: { gte: weekStart, lte: weekEnd },
        },
        orderBy: { appliedAt: "desc" },
      }),
      prisma.userPath.findMany({
        where: { userId: user.id },
        include: { careerPath: true },
        orderBy: { matchScore: "desc" },
        take: 5,
      }),
      prisma.skillGap.findMany({
        where: { userId: user.id },
        orderBy: { gap: "desc" },
      }),
      prisma.weeklyReport.findFirst({
        where: {
          userId: user.id,
          weekStart: { gte: new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000), lte: weekStart },
        },
      }),
    ]);

    const interviewSessions = JSON.parse(localStorage.getItem("compass_interview_history") || "[]");
    const thisWeekInterviews = Array.isArray(interviewSessions)
      ? interviewSessions.filter((s: any) => {
          const d = new Date(s.date);
          return d >= weekStart && d <= weekEnd;
        })
      : [];

    const prevApps = lastReport ? lastReport.applicationsSent : 0;
    const appDelta = applications.length - prevApps;

    const topPath = paths[0];
    const highPriorityGaps = gaps.filter(g => g.priority === "high").slice(0, 5);
    const avgInterviewScore = thisWeekInterviews.length
      ? Math.round(thisWeekInterviews.reduce((s: number, i: any) => s + i.overallScore, 0) / thisWeekInterviews.length)
      : 0;

    const recommendations: string[] = [];
    if (applications.length < 10) recommendations.push("Apply to at least 10 jobs this week to increase your chances.");
    if (highPriorityGaps.length > 0) recommendations.push(`Focus on improving ${highPriorityGaps.map(g => g.skillName).join(", ")} — these are high-priority gaps.`);
    if (thisWeekInterviews.length < 2) recommendations.push("Complete at least 2 mock interviews this week to build confidence.");
    if (appDelta < 0) recommendations.push("Your application rate dropped compared to last week. Stay consistent.");
    if (topPath && topPath.matchScore < 0.7) recommendations.push(`Consider exploring ${topPath.careerPath.title} more deeply — your match is ${Math.round(topPath.matchScore * 100)}%.`);

    const summary = [
      `You applied to ${applications.length} job${applications.length !== 1 ? "s" : ""} this week${appDelta > 0 ? ` (+${appDelta} vs last week)` : appDelta < 0 ? ` (${appDelta} vs last week)` : ""}.`,
      thisWeekInterviews.length > 0 ? `Completed ${thisWeekInterviews.length} mock interview${thisWeekInterviews.length !== 1 ? "s" : ""} with an average score of ${avgInterviewScore}%.` : "No mock interviews completed this week.",
      topPath ? `Your top career match remains ${topPath.careerPath.title} at ${Math.round(topPath.matchScore * 100)}%.` : "",
    ].filter(Boolean).join(" ");

    const digest = {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      applicationsSent: applications.length,
      interviewsScheduled: thisWeekInterviews.length,
      avgInterviewScore,
      skillsImproved: highPriorityGaps.map(g => g.skillName),
      newMatches: paths.length,
      topCareerMatch: topPath?.careerPath?.title || "",
      summary,
      recommendations,
      topJobs: applications.slice(0, 5).map(a => ({ title: a.jobTitle, company: a.company, status: a.status })),
      trend: appDelta,
    };

    return NextResponse.json(digest);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
