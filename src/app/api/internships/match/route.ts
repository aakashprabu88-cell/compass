import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getUserProfile, generateInternshipMatchAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { internshipId } = await request.json();
    if (!internshipId) return NextResponse.json({ error: "internshipId required" }, { status: 400 });

    const internship = await prisma.internship.findUnique({ where: { id: internshipId } });
    if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });

    // Get full user profile for AI analysis
    const profile = await getUserProfile(user.id);

    if (!profile) {
      // Fallback: basic algorithmic match if no profile
      const assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      const userSkills = assessment ? JSON.parse(assessment.skills || "[]") : [];
      const requiredSkills = JSON.parse(internship.skillsRequired || "[]");
      const matched = userSkills.filter((s: string) =>
        requiredSkills.some((r: string) => s.toLowerCase() === r.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
      );
      const missing = requiredSkills.filter((r: string) => !matched.some((m: string) => m.toLowerCase() === r.toLowerCase() || m.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(m.toLowerCase())));
      const skillMatch = requiredSkills.length > 0 ? matched.length / requiredSkills.length : 0.5;

      return NextResponse.json({
        matchScore: Math.round(Math.min(0.95, skillMatch * 0.7 + 0.3) * 100),
        skillMatch: Math.round(skillMatch * 100),
        domainMatch: 50,
        selectionProbability: Math.round(Math.min(0.85, skillMatch * 0.6) * 100),
        resumeReadiness: 50,
        matchedSkills: matched,
        missingSkills: missing,
        totalLearningDays: missing.length * 7,
        roadmap: missing.map((skill: string, i: number) => ({
          skill,
          week: i + 1,
          hours: 20,
          resources: [`Learn ${skill} on freeCodeCamp`, `Practice ${skill} projects on GitHub`],
        })),
        aiAnalysis: "Complete your career assessment for a personalized AI analysis.",
        internship: {
          id: internship.id, title: internship.title, company: internship.company,
          companyLogo: internship.companyLogo, stipend: internship.stipend,
          workMode: internship.workMode, duration: internship.duration,
          difficulty: internship.difficulty, competitionLevel: internship.competitionLevel,
          acceptanceRate: internship.acceptanceRate, isPPO: internship.isPPO,
          openings: internship.openings, deadline: internship.deadline,
        },
      });
    }

    // Use AI for semantic matching
    const requiredSkills = JSON.parse(internship.skillsRequired || "[]");
    const aiResult = await generateInternshipMatchAI(profile, {
      title: internship.title,
      company: internship.company,
      domain: internship.domain,
      skillsRequired: requiredSkills,
      description: internship.description,
      difficulty: internship.difficulty,
      workMode: internship.workMode,
      stipend: internship.stipend,
      duration: internship.duration,
    });

    return NextResponse.json({
      matchScore: aiResult.matchScore,
      skillMatch: aiResult.skillMatch,
      domainMatch: aiResult.domainMatch,
      selectionProbability: aiResult.selectionProbability,
      resumeReadiness: profile.resumeCount > 0 ? 82 : 55,
      matchedSkills: aiResult.matchedSkills,
      missingSkills: aiResult.missingSkills,
      totalLearningDays: aiResult.totalLearningDays,
      roadmap: aiResult.roadmap,
      aiAnalysis: aiResult.aiAnalysis,
      internship: {
        id: internship.id, title: internship.title, company: internship.company,
        companyLogo: internship.companyLogo, stipend: internship.stipend,
        workMode: internship.workMode, duration: internship.duration,
        difficulty: internship.difficulty, competitionLevel: internship.competitionLevel,
        acceptanceRate: internship.acceptanceRate, isPPO: internship.isPPO,
        openings: internship.openings, deadline: internship.deadline,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
