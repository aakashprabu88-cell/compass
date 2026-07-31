import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/careers";
import { fetchTNInternJobs, rankRealJobs, mapToInternship } from "@/lib/jobs";

function buildInternQueries(topTitles: string[], userSkills: string[], userInterests: string[]): string[] {
  const queries = new Set<string>();
  const clean = (t: string) => t.replace(/\//g, " ").replace(/\b(Professional|Specialist|Engineer|Analyst)\b/g, "").replace(/\s+/g, " ").trim();

  for (const t of topTitles.slice(0, 2)) {
    const c = clean(t);
    if (c && c.length > 2) queries.add(`${c} intern`);
  }

  for (const s of userSkills.slice(0, 3)) {
    if (queries.size >= 4) break;
    const q = s.trim();
    if (q.length >= 3) queries.add(`${q} intern`);
  }

  if (queries.size === 0 && userInterests.length > 0) {
    const c = clean(userInterests[0]);
    if (c) queries.add(`${c} intern`);
  }

  if (queries.size === 0) queries.add("intern");

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

    if (!assessment) return NextResponse.json({ internships: [], totalReal: 0 });

    const userSkills = parseJsonArray(assessment.skills);
    const userInterests = parseJsonArray(assessment.interests);

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const topTitles = userPaths.map(up => up.careerPath.title);
    const queries = buildInternQueries(topTitles, userSkills, userInterests);
    const { jobs, totalCount } = await fetchTNInternJobs(queries, 20);

    const ranked = rankRealJobs(jobs, userSkills, userInterests, topTitles);
    const internships = ranked.slice(0, 40).map(j => mapToInternship(j));

    return NextResponse.json({ internships, totalReal: totalCount });
  } catch (e) {
    console.error("GET /api/internships/live", e);
    return NextResponse.json({ internships: [], totalReal: 0 });
  }
}
