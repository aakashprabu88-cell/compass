import { NextRequest, NextResponse } from "next/server";
import { getCareerAdvice } from "@/lib/ai";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:career:${user.id}`;
  if (!checkRateLimit(rateKey, 10, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

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

    return NextResponse.json(advice, { headers: getRateLimitHeaders(rateKey, 10, 60000) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
