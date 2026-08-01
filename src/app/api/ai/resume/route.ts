import { NextRequest, NextResponse } from "next/server";
import { generateFirstClassResume, improveResumeText, getUserProfile, profileToContext } from "@/lib/ai";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:resume:${user.id}`;
  if (!checkRateLimit(rateKey, 10, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }
  const rateHeaders = getRateLimitHeaders(rateKey, 10, 60000);

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "improve") {
      const { targetRole, kind, raw } = body;
      if (!raw || !raw.trim()) {
        return NextResponse.json({ error: "raw content required" }, { status: 400 });
      }
      const result = await improveResumeText(targetRole || "Software Engineer", kind === "project" ? "project" : "experience", raw);
      return NextResponse.json(result, { headers: rateHeaders });
    }

    const {
      name, targetRole, targetCompany, jobDescription,
      email, phone, location, linkedin, github, portfolio,
      skills, experiences, projects, education, certifications, achievements,
    } = body;

    if (!name || !targetRole) {
      return NextResponse.json({ error: "name and targetRole required" }, { status: 400 });
    }

    const profile = await getUserProfile(user.id);

    const result = await generateFirstClassResume({
      name: String(name),
      email: String(email || user.email || ""),
      phone: String(phone || ""),
      location: String(location || ""),
      linkedin: String(linkedin || ""),
      github: String(github || ""),
      portfolio: String(portfolio || ""),
      targetRole: String(targetRole),
      targetCompany: String(targetCompany || ""),
      jobDescription: String(jobDescription || ""),
      skills: Array.isArray(skills) ? skills.map(String) : [],
      experiences: Array.isArray(experiences) ? experiences : [],
      projects: Array.isArray(projects) ? projects : [],
      education: Array.isArray(education) ? education : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      achievements: Array.isArray(achievements) ? achievements.map(String) : [],
      profileContext: profile ? profileToContext(profile) : undefined,
    });

    return NextResponse.json(result, { headers: rateHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
