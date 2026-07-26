import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchMentors } from "@/lib/mentors";
import { parseJsonArray } from "@/lib/careers";

export async function GET() {
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
      take: 5,
    });

    const userSkills = assessment ? parseJsonArray(assessment.skills) : [];
    const userInterests = assessment ? parseJsonArray(assessment.interests) : [];
    const topTitles = userPaths.map(up => up.careerPath.title);

    const mentors = matchMentors(userSkills, userInterests, topTitles);

    return NextResponse.json(mentors);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { mentorId, message } = await request.json();

    const existing = await prisma.userMentor.findUnique({
      where: { userId_mentorId: { userId: user.id, mentorId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already requested" }, { status: 400 });
    }

    const match = await prisma.userMentor.create({
      data: {
        userId: user.id,
        mentorId,
        message: message || "",
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, match });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
