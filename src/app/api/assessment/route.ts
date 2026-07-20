import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { CAREER_DATABASE, calculateMatchScore, calculateSkillGaps, parseJsonArray } from "@/lib/careers";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { skills, interests, personality, values, workStyle, education, experience } = body;

  // Save assessment
  const assessment = await prisma.assessment.upsert({
    where: { userId: user.id },
    update: {
      skills: JSON.stringify(skills),
      interests: JSON.stringify(interests),
      personality: JSON.stringify(personality),
      values: JSON.stringify(values),
      workStyle: workStyle || "hybrid",
      education: education || "",
      experience: experience || "",
    },
    create: {
      userId: user.id,
      skills: JSON.stringify(skills),
      interests: JSON.stringify(interests),
      personality: JSON.stringify(personality),
      values: JSON.stringify(values),
      workStyle: workStyle || "hybrid",
      education: education || "",
      experience: experience || "",
    },
  });

  // Mark user as onboarded
  await prisma.user.update({ where: { id: user.id }, data: { onboarded: true } });

  // Calculate matches against all careers
  const userProfile = {
    skills,
    interests,
    personality: personality || {},
    values: values || [],
    workStyle: workStyle || "hybrid",
  };

  // Delete old matches and skill gaps
  await prisma.userPath.deleteMany({ where: { userId: user.id } });
  await prisma.skillGap.deleteMany({ where: { userId: user.id } });

  // Score all careers
  const scored = CAREER_DATABASE.map(career => {
    const scores = calculateMatchScore(userProfile, career);
    return { career, ...scores };
  }).sort((a, b) => b.total - a.total);

  // Save top 10 paths
  for (let i = 0; i < Math.min(10, scored.length); i++) {
    const { career, total, skillMatch, interestMatch, aiSafetyScore } = scored[i];
    const dbCareer = await prisma.careerPath.upsert({
      where: { slug: career.slug },
      update: {},
      create: {
        title: career.title,
        slug: career.slug,
        description: career.description,
        salaryMin: career.salaryMin,
        salaryMax: career.salaryMax,
        growthOutlook: career.growthOutlook,
        aiRisk: career.aiRisk,
        aiRiskScore: career.aiRiskScore,
        requiredSkills: JSON.stringify(career.requiredSkills),
        industries: JSON.stringify(career.industries),
        educationLevel: career.educationLevel,
        timeToEntry: career.timeToEntry,
        keyTasks: JSON.stringify(career.keyTasks),
        futureOutlook: career.futureOutlook,
      },
    });

    await prisma.userPath.create({
      data: {
        userId: user.id,
        careerPathId: dbCareer.id,
        matchScore: total,
        skillMatch,
        interestMatch,
        aiSafetyScore,
        rank: i + 1,
      },
    });
  }

  // Calculate skill gaps for top 3 careers
  for (let i = 0; i < Math.min(3, scored.length); i++) {
    const gaps = calculateSkillGaps(skills, scored[i].career);
    for (const gap of gaps) {
      if (gap.gap > 0) {
        await prisma.skillGap.upsert({
          where: { userId_skillName: { userId: user.id, skillName: gap.skill } },
          update: { currentLevel: gap.current, requiredLevel: gap.required, gap: gap.gap },
          create: {
            userId: user.id,
            skillName: gap.skill,
            currentLevel: gap.current,
            requiredLevel: gap.required,
            gap: gap.gap,
            priority: gap.gap >= 4 ? "high" : gap.gap >= 2 ? "medium" : "low",
          },
        });
      }
    }
  }

  return NextResponse.json({ success: true, topMatch: scored[0]?.career.title });
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const assessment = await prisma.assessment.findUnique({ where: { userId: user.id } });
  return NextResponse.json(assessment);
}
