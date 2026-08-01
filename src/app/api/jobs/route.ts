import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/careers";
import { fetchTNJobs, rankRealJobs, matchJobs } from "@/lib/jobs";

function buildJobQueries(topTitles: string[], userSkills: string[], userInterests: string[]): string[] {
  const queries = new Set<string>();
  const clean = (t: string) => t.replace(/\//g, " ").replace(/\b(Professional|Specialist)\b/g, "").replace(/\s+/g, " ").trim();

  for (const t of topTitles.slice(0, 2)) {
    const q = clean(t);
    if (q && q.length > 2) queries.add(q);
  }

  for (const s of userSkills.slice(0, 2)) {
    if (queries.size >= 4) break;
    const q = s.trim();
    if (q.length >= 3) queries.add(q);
  }

  if (queries.size === 0 && userInterests.length > 0) {
    const q = clean(userInterests[0]);
    if (q) queries.add(q);
  }

  if (queries.size === 0) queries.add("software developer");

  return [...queries].slice(0, 4);
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) {
      return NextResponse.json({
        realJobs: [],
        fallbackJobs: matchJobs([], [], []).sort((a, b) => b.openings - a.openings).slice(0, 100),
        hasRealData: false,
        totalRealJobs: 0,
      });
    }

    const userSkills = parseJsonArray(assessment.skills);
    const userInterests = parseJsonArray(assessment.interests);

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const topTitles = userPaths.map(up => up.careerPath.title);

    const queries = buildJobQueries(topTitles, userSkills, userInterests);

    let ranked: ReturnType<typeof rankRealJobs> = [];
    let totalCount = 0;
    try {
      const realResult = await fetchTNJobs(queries, 50);
      totalCount = realResult.totalCount;
      ranked = rankRealJobs(realResult.jobs, userSkills, userInterests, topTitles);
    } catch (e) {
      console.error("Live job feed failed, using curated fallback", e);
    }

    const fallbackJobs = ranked.length === 0
      ? matchJobs(userSkills, userInterests, topTitles).slice(0, 100)
      : [];

    return NextResponse.json({
      realJobs: ranked.slice(0, 100),
      fallbackJobs,
      hasRealData: ranked.length > 0,
      totalRealJobs: totalCount,
    });
  } catch (e) {
    console.error("GET /api/jobs", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
