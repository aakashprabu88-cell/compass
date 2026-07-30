import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { skills, interests, education, experience, workStyle, values } = await req.json();

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

    await prisma.user.update({ where: { id: user.id }, data: { onboarded: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  }
}
