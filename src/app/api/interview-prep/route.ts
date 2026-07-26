import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getInterviewQuestions, getAllCareerCategories } from "@/lib/interview";
import { parseJsonArray } from "@/lib/careers";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const career = searchParams.get("career") || "";

    if (career) {
      const questions = getInterviewQuestions(career);
      return NextResponse.json(questions);
    }

    // Return questions for user's top career
    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const careers = userPaths.map(up => up.careerPath.title);
    const allQuestions = careers.flatMap(c => getInterviewQuestions(c));

    // Deduplicate
    const seen = new Set();
    const unique = allQuestions.filter(q => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });

    return NextResponse.json({
      questions: unique,
      categories: getAllCareerCategories(),
      userCareers: careers,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
