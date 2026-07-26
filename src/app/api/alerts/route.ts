import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface AlertPreferences {
  skills: string[];
  locations: string[];
  minSalary: number;
  maxAge: number; // days
  frequency: "daily" | "weekly";
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user's skills and preferences
    const [assessment, gaps, paths] = await Promise.all([
      prisma.assessment.findFirst({ where: { userId: user.id } }),
      prisma.skillGap.findMany({ where: { userId: user.id } }),
      prisma.userPath.findMany({
        where: { userId: user.id },
        include: { careerPath: true },
        orderBy: { matchScore: "desc" },
        take: 3,
      }),
    ]);

    const skills = assessment ? JSON.parse(assessment.skills || "[]") : [];
    const interests = assessment ? JSON.parse(assessment.interests || "[]") : [];
    const topPaths = paths.map(p => p.careerPath.title);
    const highPrioritySkills = gaps.filter(g => g.priority === "high").map(g => g.skillName);

    // Check Adzuna for new matching jobs
    let newJobs: any[] = [];
    try {
      const APP_ID = process.env.ADZUNA_APP_ID;
      const API_KEY = process.env.ADZUNA_API_KEY;
      if (APP_ID && API_KEY) {
        const searchTerms = [...skills.slice(0, 3), ...topPaths.slice(0, 2)].join(" OR ");
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${API_KEY}&results_per_page=10&what=${encodeURIComponent(searchTerms)}&content-type=application/json`;
        const adzRes = await fetch(url);
        if (adzRes.ok) {
          const adzData = await adzRes.json();
          newJobs = (adzData.results || []).map((j: any) => ({
            title: j.title,
            company: j.company?.display_name || "Unknown",
            location: j.location?.display_name || "",
            salary: j.salary_min ? `${Math.round(j.salary_min)}-${Math.round(j.salary_max || 0)}` : null,
            description: j.description?.slice(0, 200) || "",
            url: j.redirect_url,
            created: j.created,
          }));
        }
      }
    } catch {}

    // Build personalized alerts
    const alerts = {
      newJobs,
      matchingSkills: skills.slice(0, 5),
      highPriorityGaps: highPrioritySkills,
      recommendedActions: [
        ...highPrioritySkills.slice(0, 3).map(s => `Learn ${s} — it's a high-priority gap for your top career paths`),
        ...topPaths.slice(0, 2).map(p => `Explore new ${p} roles — there are ${newJobs.length} fresh listings`),
        "Update your resume with latest skills to improve ATS matching",
      ],
      topPaths: topPaths,
      jobCount: newJobs.length,
      lastChecked: new Date().toISOString(),
    };

    return NextResponse.json(alerts);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
