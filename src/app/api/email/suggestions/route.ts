import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { suggestImprovements } from "@/lib/email-ai";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:email-sug:${user.id}`;
  if (!checkRateLimit(rateKey, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const { subject, body, company, role, details } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: "subject and body are required" }, { status: 400 });
    }

    const suggestions = await suggestImprovements({
      subject: String(subject).slice(0, 500),
      body: String(body).slice(0, 8000),
      company: String(company || ""),
      role: String(role || ""),
      details: details || {
        location: "", phone: "", github: "", linkedin: "", portfolio: "",
        targetRole: "", employmentType: "internship", projects: [], certifications: [], achievements: [],
        preferredStyle: "formal",
      },
    });

    return NextResponse.json({ suggestions }, { headers: getRateLimitHeaders(rateKey, 30, 60000) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
