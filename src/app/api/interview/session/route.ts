import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUserProfile, generateInterviewSession } from "@/lib/ai";

const ROUND_TYPES = ["technical", "hr", "behavioral", "managerial", "panel", "coding"];

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const roundType = searchParams.get("type") || "technical";
    if (!ROUND_TYPES.includes(roundType)) {
      return NextResponse.json({ error: "Invalid round type" }, { status: 400 });
    }

    const profile = await getUserProfile(user.id);
    const topRole = profile?.topCareerPaths[0]?.title || "Software Developer";
    const fallbackCompany = topRole.toLowerCase().includes("software") || topRole.toLowerCase().includes("developer")
      ? "a leading Indian tech company"
      : topRole;
    const company = searchParams.get("company") || fallbackCompany || "Tech Company";

    const session = await generateInterviewSession(roundType as any, topRole, company, profile);

    if (!session) {
      return NextResponse.json({ error: "AI could not generate a session" }, { status: 500 });
    }

    return NextResponse.json(session);
  } catch (e) {
    console.error("GET /api/interview/session", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
