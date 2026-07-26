import { NextRequest, NextResponse } from "next/server";
import { generateResumeBullets } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, skills, projects, experience, education, targetRole } = body;

    if (!name || !targetRole) {
      return NextResponse.json({ error: "name and targetRole required" }, { status: 400 });
    }

    const result = await generateResumeBullets({
      name,
      skills: Array.isArray(skills) ? skills : skills?.split(",").map((s: string) => s.trim()) || [],
      projects: Array.isArray(projects) ? projects : projects?.split(";").map((s: string) => s.trim()) || [],
      experience: experience || "",
      education: education || "",
      targetRole,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
