import { NextRequest, NextResponse } from "next/server";
import { generateResumeBullets, getUserProfile, profileToContext } from "@/lib/ai";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:resume:${user.id}`;
  if (!checkRateLimit(rateKey, 10, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, skills, projects, experience, education, targetRole } = body;

    if (!name || !targetRole) {
      return NextResponse.json({ error: "name and targetRole required" }, { status: 400 });
    }

    // Fetch full profile for richer resume generation
    const profile = await getUserProfile(user.id);

    const skillsArr = Array.isArray(skills) ? skills : skills?.split(",").map((s: string) => s.trim()) || [];
    const projectsArr = Array.isArray(projects) ? projects : projects?.split(";").map((s: string) => s.trim()) || [];

    // If user has a profile, use their actual skill gaps and career paths for context
    const enhancedProfile = {
      name,
      skills: skillsArr.length > 0 ? skillsArr : (profile?.skills || []),
      projects: projectsArr,
      experience: experience || profile?.experience || "",
      education: education || profile?.education || "",
      targetRole,
    };

    const result = await generateResumeBullets(enhancedProfile);

    return NextResponse.json(result, { headers: getRateLimitHeaders(rateKey, 10, 60000) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
