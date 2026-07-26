import { NextRequest, NextResponse } from "next/server";
import { getCareerAdvice } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skills, interests, personality, education, experience, values } = body;

    if (!skills || !interests) {
      return NextResponse.json({ error: "skills and interests required" }, { status: 400 });
    }

    const advice = await getCareerAdvice({
      skills: Array.isArray(skills) ? skills : [skills],
      interests: Array.isArray(interests) ? interests : [interests],
      personality: personality || "",
      education: education || "",
      experience: experience || "",
      values: values || "",
    });

    return NextResponse.json(advice);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
