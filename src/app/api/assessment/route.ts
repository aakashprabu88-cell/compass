import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { CAREER_DATABASE, calculateMatchScore, parseJsonArray } from "@/lib/careers";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("compass_token")?.value;
  if (!token) return null;
  const jwt = await verifyToken(token);
  if (!jwt || !jwt.id) return null;
  return jwt as { id: string; email: string; name: string };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({ where: { userId: user.id } });
    return NextResponse.json(assessment || {});
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

async function ensureCareerPathsSeeded() {
  const currentSlugs = CAREER_DATABASE.map(c => c.slug);
  const existing = await prisma.careerPath.findMany({ select: { slug: true } });
  const existingSlugs = existing.map(e => e.slug);

  const stale = existingSlugs.filter(s => !currentSlugs.includes(s));
  if (stale.length > 0) {
    await prisma.careerPath.deleteMany({ where: { slug: { in: stale } } });
  }

  const missing = currentSlugs.filter(s => !existingSlugs.includes(s));
  if (missing.length > 0) {
    await prisma.careerPath.createMany({
      data: CAREER_DATABASE.filter(c => missing.includes(c.slug)).map(c => ({
        title: c.title,
        slug: c.slug,
        description: c.description,
        salaryMin: c.salaryMin,
        salaryMax: c.salaryMax,
        growthOutlook: c.growthOutlook,
        aiRisk: c.aiRisk,
        aiRiskScore: c.aiRiskScore,
        requiredSkills: JSON.stringify(c.requiredSkills),
        industries: JSON.stringify(c.industries),
        educationLevel: c.educationLevel,
        timeToEntry: c.timeToEntry,
        keyTasks: JSON.stringify(c.keyTasks),
        futureOutlook: c.futureOutlook,
      })),
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { skills, interests, education, experience, workStyle, values, personality } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: "Please select at least one skill" }, { status: 400 });
    }

    const existing = await prisma.assessment.findFirst({ where: { userId: user.id } });

    if (existing) {
      await prisma.assessment.update({
        where: { id: existing.id },
        data: {
          skills: JSON.stringify(skills),
          interests: JSON.stringify(interests || []),
          education: education || "",
          experience: experience || "",
          workStyle: workStyle || "hybrid",
          values: JSON.stringify(values || []),
        },
      });
    } else {
      await prisma.assessment.create({
        data: {
          userId: user.id,
          skills: JSON.stringify(skills),
          interests: JSON.stringify(interests || []),
          education: education || "",
          experience: experience || "",
          workStyle: workStyle || "hybrid",
          values: JSON.stringify(values || []),
        },
      });
    }

    // Seed career paths if needed, then match user against all careers
    await ensureCareerPathsSeeded();
    const allCareerPaths = await prisma.careerPath.findMany();

    const userProfile = {
      skills,
      interests: interests || [],
      personality: personality || { analytical: 5, creative: 5, social: 5, leadership: 5 },
      values: values || [],
      workStyle: workStyle || "hybrid",
    };

    const scored = allCareerPaths.map(cp => {
      const careerData = CAREER_DATABASE.find(c => c.slug === cp.slug) || {
        title: cp.title,
        slug: cp.slug,
        description: cp.description,
        salaryMin: cp.salaryMin,
        salaryMax: cp.salaryMax,
        growthOutlook: cp.growthOutlook,
        aiRisk: cp.aiRisk,
        aiRiskScore: cp.aiRiskScore,
        requiredSkills: parseJsonArray(cp.requiredSkills),
        industries: parseJsonArray(cp.industries),
        educationLevel: cp.educationLevel,
        timeToEntry: cp.timeToEntry,
        keyTasks: parseJsonArray(cp.keyTasks),
        futureOutlook: cp.futureOutlook,
      };
      const result = calculateMatchScore(userProfile, careerData);
      return { careerPathId: cp.id, ...result };
    });

    // Remove old UserPath records for this user, then create new top-10
    await prisma.userPath.deleteMany({ where: { userId: user.id } });
    const topPaths = scored.sort((a, b) => b.total - a.total).slice(0, 10);
    if (topPaths.length > 0) {
      await prisma.userPath.createMany({
        data: topPaths.map((p, i) => ({
          userId: user.id,
          careerPathId: p.careerPathId,
          matchScore: p.total,
          skillMatch: p.skillMatch,
          interestMatch: p.interestMatch,
          aiSafetyScore: p.aiSafetyScore,
          rank: i + 1,
        })),
      });
    }

    // Create skill gaps based on top matching career
    if (topPaths.length > 0) {
      await prisma.skillGap.deleteMany({ where: { userId: user.id } });
      const topSlug = (await prisma.careerPath.findUnique({ where: { id: topPaths[0].careerPathId } }))?.slug;
      const topCareerData = CAREER_DATABASE.find(c => c.slug === topSlug);
      if (topCareerData) {
        const gaps = topCareerData.requiredSkills.map(skill => {
          const userHas = skills.some((us: string) =>
            us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase())
          );
          const currentLevel = userHas ? 7 : 2;
          const requiredLevel = 7;
          const gap = Math.max(0, requiredLevel - currentLevel);
          return {
            userId: user.id,
            skillName: skill,
            currentLevel,
            requiredLevel,
            gap,
            priority: gap >= 4 ? "high" : gap >= 2 ? "medium" : "low",
          };
        });
        await prisma.skillGap.createMany({ data: gaps });
      }
    }

    await prisma.user.update({ where: { id: user.id }, data: { onboarded: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  }
}
