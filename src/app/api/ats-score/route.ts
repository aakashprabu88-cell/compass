import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/careers";
import { calculateATS } from "@/lib/ai-tools";
import { JOB_DATABASE } from "@/lib/jobs";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobId } = await request.json();
    const job = JOB_DATABASE.find(j => j.id === jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    const assessment = await prisma.assessment.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

    const skills = resume ? parseJsonArray(resume.extractedSkills) : assessment ? parseJsonArray(assessment.skills) : [];
    const exp = resume?.experience || assessment?.education || "0 years";

    const result = calculateATS(skills, exp, job);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
