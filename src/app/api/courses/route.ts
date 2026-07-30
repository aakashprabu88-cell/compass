import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchCourses } from "@/lib/courses";
import { parseJsonArray } from "@/lib/careers";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) return NextResponse.json([]);

    const userSkills = parseJsonArray(assessment.skills);
    const userInterests = parseJsonArray(assessment.interests);

    const gaps = await prisma.skillGap.findMany({
      where: { userId: user.id },
      orderBy: { gap: "desc" },
    });

    const courses = matchCourses(userSkills, userInterests, gaps);
    return NextResponse.json(courses);
  } catch (e) {
    console.error("GET /api/courses", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
