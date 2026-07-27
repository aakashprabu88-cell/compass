import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { internshipId } = await request.json();
    if (!internshipId) return NextResponse.json({ error: "internshipId required" }, { status: 400 });

    const internship = await prisma.internship.findUnique({ where: { id: internshipId } });
    if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const userSkills = assessment ? JSON.parse(assessment.skills || "[]") : [];
    const userInterests = assessment ? JSON.parse(assessment.interests || "[]") : [];
    const requiredSkills = JSON.parse(internship.skillsRequired || "[]");

    // Calculate skill match
    const matchedSkills = userSkills.filter((s: string) =>
      requiredSkills.some((r: string) => r.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
    );
    const missingSkills = requiredSkills.filter((r: string) =>
      !userSkills.some((s: string) => s.toLowerCase() === r.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
    );

    const skillMatch = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0.5;

    // Domain interest match
    const domainMatch = userInterests.some((i: string) =>
      internship.domain.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(internship.domain.toLowerCase())
    ) ? 0.9 : 0.4;

    // Overall match (weighted)
    const matchScore = Math.min(0.99, skillMatch * 0.6 + domainMatch * 0.2 + 0.2);

    // Selection probability (conservative estimate)
    const difficultyMod = internship.difficulty === "easy" ? 1.2 : internship.difficulty === "hard" ? 0.7 : 1.0;
    const selectionProbability = Math.min(0.95, matchScore * difficultyMod * 0.8);

    // Estimate learning time for missing skills
    const learningTimeMap: Record<string, number> = {
      "docker": 40, "kubernetes": 60, "aws": 50, "terraform": 45, "redis": 20,
      "kafka": 40, "solidity": 50, "flutter": 35, "swift": 40, "kotlin": 35,
      "go": 30, "rust": 50, "machine learning": 80, "deep learning": 100,
      "nlp": 60, "computer vision": 70, "pytorch": 40, "tensorflow": 40,
      "system design": 60, "penetration testing": 50, "siem": 30,
    };
    const totalLearningDays = missingSkills.reduce((sum: number, skill: string) => {
      const hours = learningTimeMap[skill.toLowerCase()] || 30;
      return sum + Math.ceil(hours / 2);
    }, 0);

    // Generate roadmap for missing skills
    const roadmap = missingSkills.map((skill: string, i: number) => ({
      skill,
      week: i + 1,
      hours: learningTimeMap[skill.toLowerCase()] || 30,
      resources: [
        `Learn ${skill} fundamentals on freeCodeCamp`,
        `Practice ${skill} projects on GitHub`,
        `Complete ${skill} challenges on HackerRank`,
      ],
    }));

    const matchResult = {
      matchScore: Math.round(matchScore * 100),
      skillMatch: Math.round(skillMatch * 100),
      domainMatch: Math.round(domainMatch * 100),
      selectionProbability: Math.round(selectionProbability * 100),
      resumeReadiness: assessment ? 78 : 50,
      matchedSkills,
      missingSkills,
      totalLearningDays,
      roadmap,
      internship: {
        id: internship.id,
        title: internship.title,
        company: internship.company,
        companyLogo: internship.companyLogo,
        stipend: internship.stipend,
        workMode: internship.workMode,
        duration: internship.duration,
        difficulty: internship.difficulty,
        competitionLevel: internship.competitionLevel,
        acceptanceRate: internship.acceptanceRate,
        isPPO: internship.isPPO,
        openings: internship.openings,
        deadline: internship.deadline,
      },
    };

    return NextResponse.json(matchResult);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
