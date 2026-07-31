import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { CAREER_DATABASE, calculateMatchScore, parseJsonArray } from "@/lib/careers";

const DEMO_EMAIL = "demo@compass.app";
const DEMO_PASSWORD = "demo123456";

const DEMO_ASSESSMENT = {
  skills: JSON.stringify(["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "TypeScript", "HTML/CSS"]),
  interests: JSON.stringify(["Web Development", "AI/ML", "Data Science", "Cloud Computing"]),
  personality: JSON.stringify({ analytical: 8, creative: 7, social: 6, leadership: 5 }),
  values: JSON.stringify(["Innovation", "Work-Life Balance", "Growth"]),
  workStyle: "hybrid",
  education: "B.Tech Computer Science, Anna University, 2025",
  experience: "2 internships — full-stack web dev at a fintech startup and ML research assistant",
};

const DEMO_SKILL_GAPS = [
  { skillName: "System Design", currentLevel: 3, requiredLevel: 7, gap: 4, priority: "high" },
  { skillName: "Machine Learning", currentLevel: 4, requiredLevel: 8, gap: 4, priority: "high" },
  { skillName: "TypeScript", currentLevel: 6, requiredLevel: 8, gap: 2, priority: "medium" },
  { skillName: "Docker/K8s", currentLevel: 2, requiredLevel: 6, gap: 4, priority: "high" },
  { skillName: "AWS", currentLevel: 3, requiredLevel: 7, gap: 4, priority: "medium" },
  { skillName: "PostgreSQL", currentLevel: 5, requiredLevel: 7, gap: 2, priority: "medium" },
  { skillName: "Communication", currentLevel: 6, requiredLevel: 8, gap: 2, priority: "low" },
  { skillName: "Leadership", currentLevel: 4, requiredLevel: 7, gap: 3, priority: "low" },
];

export async function POST() {
  try {
    let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

    if (!user) {
      const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
      user = await prisma.user.create({
        data: { email: DEMO_EMAIL, password: hashed, name: "Demo User", onboarded: false },
      });
    }

    // Seed assessment if missing
    const existingAssessment = await prisma.assessment.findFirst({ where: { userId: user.id } });
    if (!existingAssessment) {
      await prisma.assessment.create({ data: { userId: user.id, ...DEMO_ASSESSMENT } });
    }

    // Seed skill gaps if missing
    const existingGaps = await prisma.skillGap.count({ where: { userId: user.id } });
    if (existingGaps === 0) {
      await prisma.skillGap.createMany({
        data: DEMO_SKILL_GAPS.map(g => ({ userId: user.id, ...g })),
      });
    }

    // Always recompute skill-matched career paths for the demo account so the
    // demo reflects the demo profile instead of stale pre-defined data.
    const allCareerPaths = await prisma.careerPath.findMany();
    const userProfile = {
      skills: parseJsonArray(DEMO_ASSESSMENT.skills),
      interests: parseJsonArray(DEMO_ASSESSMENT.interests),
      personality: JSON.parse(DEMO_ASSESSMENT.personality || "{}"),
      values: parseJsonArray(DEMO_ASSESSMENT.values),
      workStyle: DEMO_ASSESSMENT.workStyle,
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

    const topPaths = scored.sort((a, b) => b.total - a.total).slice(0, 10);
    await prisma.userPath.deleteMany({ where: { userId: user.id } });
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

    // Seed some job applications
    const existingApps = await prisma.jobApplication.count({ where: { userId: user.id } });
    if (existingApps === 0) {
      await prisma.jobApplication.createMany({
        data: [
          { userId: user.id, jobId: "demo-1", jobTitle: "Frontend Developer", company: "Freshworks", location: "Chennai", status: "interview", matchScore: 88 },
          { userId: user.id, jobId: "demo-2", jobTitle: "Full Stack Developer", company: "Zoho", location: "Chennai", status: "applied", matchScore: 82 },
          { userId: user.id, jobId: "demo-3", jobTitle: "React Developer", company: "Infosys", location: "Coimbatore", status: "sent", matchScore: 75 },
        ],
      });
    }

    const token = await signToken({ id: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    response.cookies.set("compass_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo seed error:", error);
    return NextResponse.json({ error: "Failed to create demo session" }, { status: 500 });
  }
}
