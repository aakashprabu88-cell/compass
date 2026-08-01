import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/careers";
import { fetchRealCompanies, rankRealJobs, isTamilNaduLocation } from "@/lib/jobs";
import { deriveCompanyContact, isRealCompany, getEmailConfigStatus, buildProfessionalEmail } from "@/lib/email";

function buildQueries(topTitles: string[], userSkills: string[], userInterests: string[]): string[] {
  const queries = new Set<string>();
  const clean = (t: string) => t.replace(/\//g, " ").replace(/\b(Professional|Specialist)\b/g, "").replace(/\s+/g, " ").trim();

  for (const t of topTitles.slice(0, 3)) {
    const c = clean(t);
    if (c && c.length > 2) queries.add(c);
  }

  for (const s of userSkills.slice(0, 4)) {
    if (queries.size >= 6) break;
    const q = s.trim();
    if (q.length >= 3) queries.add(q);
  }

  for (const i of userInterests.slice(0, 2)) {
    if (queries.size >= 7) break;
    const q = i.trim();
    if (q.length >= 3) queries.add(q);
  }

  if (queries.size === 0) queries.add("software");
  return [...queries].slice(0, 7);
}

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const userSkills = assessment ? parseJsonArray(assessment.skills) : [];
    const userInterests = assessment ? parseJsonArray(assessment.interests) : [];
    const topTitles = userPaths.map(up => up.careerPath.title);

    const url = new URL(req.url);
    const locationFilter = url.searchParams.get("location") || "all";

    const queries = buildQueries(topTitles, userSkills, userInterests);
    const { companies } = await fetchRealCompanies(queries, 25);

    const ranked = rankRealJobs(companies, userSkills, userInterests, topTitles);

    const profile = {
      name: user.name,
      email: user.email,
      skills: userSkills,
      interests: userInterests,
      education: assessment?.education || "",
      experience: assessment?.experience || "",
      personality: assessment?.personality || "",
      topCareers: topTitles,
    };

    const byCompany = new Map<string, { company: string; jobs: (typeof ranked)[number][]; isTn: boolean }>();
    for (const job of ranked) {
      if (!isRealCompany(job.company)) continue;
      const isTn = isTamilNaduLocation(job.location);
      const entry = byCompany.get(job.company);
      if (!entry) {
        byCompany.set(job.company, { company: job.company, jobs: [job], isTn });
      } else {
        entry.jobs.push(job);
        if (isTn) entry.isTn = true;
      }
    }

    const matches = [...byCompany.values()]
      .filter(entry => locationFilter === "tn" ? entry.isTn : true)
      .map(entry => {
        const tnJobs = entry.jobs.filter(j => isTamilNaduLocation(j.location));
        const top = locationFilter === "tn" ? (tnJobs[0] || entry.jobs[0]) : entry.jobs[0];
        const contact = deriveCompanyContact({
          company: entry.company,
          role: top.title,
          location: top.location,
          applyUrl: top.applyUrl,
        });
        if (!contact) return null;
        const draft = buildProfessionalEmail({ profile, company: entry.company, role: top.title, location: top.location });
        return {
          ...contact,
          isTn: entry.isTn,
          matchScore: top.matchScore,
          jobCount: entry.jobs.length,
          description: top.description,
          companyLogo: top.companyLogo,
          otherRoles: entry.jobs.slice(1, 4).map(j => j.title),
          draftSubject: draft.subject,
          draftBody: draft.body,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => (locationFilter === "all" ? Number(b.isTn) - Number(a.isTn) : 0) || b.matchScore - a.matchScore)
      .slice(0, 50);

    const tnCount = [...byCompany.values()].filter(e => e.isTn).length;

    return NextResponse.json({
      companies: matches,
      config: getEmailConfigStatus(),
      totalHiring: byCompany.size,
      tnHiring: tnCount,
    });
  } catch (e) {
    console.error("GET /api/email/companies", e);
    return NextResponse.json({ companies: [], config: getEmailConfigStatus(), totalHiring: 0, tnHiring: 0 });
  }
}
