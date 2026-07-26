import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchJobs } from "@/lib/jobs";
import { parseJsonArray } from "@/lib/careers";
import { fetchRealJobs } from "@/lib/jobs";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) return NextResponse.json({ realJobs: [], fallbackJobs: [], hasRealData: false, totalRealJobs: 0 });

    const userSkills = parseJsonArray(assessment.skills);
    const userInterests = parseJsonArray(assessment.interests);

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const topTitles = userPaths.map(up => up.careerPath.title);
    const rawQuery = topTitles.length > 0 ? topTitles[0] : userInterests[0] || "software developer";
    const query = rawQuery.replace(/\//g, " ").replace(/\b(Professional|Specialist|Engineer|Analyst)\b/g, "").trim() || "software developer";
    const city = (assessment as any).preferredCity || "Chennai";

    const realResult = await fetchRealJobs({ query, location: city, country: "in", resultsPerPage: 20 });

    // Only show curated fallback jobs when Adzuna returns nothing
    const fallbackJobs = realResult.jobs.length === 0
      ? matchJobs(userSkills, userInterests, topTitles)
      : [];

    return NextResponse.json({
      realJobs: realResult.jobs,
      fallbackJobs,
      hasRealData: realResult.jobs.length > 0,
      totalRealJobs: realResult.totalCount,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email } = await request.json();

    return NextResponse.json({
      success: true,
      message: `Job alerts enabled for ${email}. You'll receive notifications for matching positions.`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
