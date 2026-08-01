import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { buildEmailInput, getCachedEmail } from "@/lib/email-ai";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:email-gen:${user.id}`;
  if (!checkRateLimit(rateKey, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const { company, role, style } = await req.json();
    if (!company || !role) {
      return NextResponse.json({ error: "company and role are required" }, { status: 400 });
    }

    const { input, missing, culture } = await buildEmailInput(user.id, {
      company: String(company),
      role: String(role),
      style: (["formal", "friendly", "technical", "startup", "executive"].includes(style) ? style : "formal"),
    });

    const draft = await getCachedEmail(input);
    const profile = await prisma.careerDetails.findUnique({ where: { userId: user.id } });
    if (profile) {
      await prisma.careerDetails.update({ where: { userId: user.id }, data: { preferredStyle: input.style } });
    }

    return NextResponse.json(
      { subject: draft.subject, body: draft.body, style: input.style, culture, missing },
      { headers: getRateLimitHeaders(rateKey, 30, 60000) }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
