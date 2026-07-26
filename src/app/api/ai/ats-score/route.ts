import { NextRequest, NextResponse } from "next/server";
import { getATSScore } from "@/lib/ai";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:ats:${user.id}`;
  if (!checkRateLimit(rateKey, 10, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "resumeText and jobDescription required" }, { status: 400 });
    }

    const result = await getATSScore(resumeText, jobDescription);
    return NextResponse.json(result, { headers: getRateLimitHeaders(rateKey, 10, 60000) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
