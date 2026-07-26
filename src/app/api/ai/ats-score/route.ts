import { NextRequest, NextResponse } from "next/server";
import { getATSScore } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "resumeText and jobDescription required" }, { status: 400 });
    }

    const result = await getATSScore(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
