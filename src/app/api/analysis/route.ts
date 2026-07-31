import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/careers";
import { generateText, extractJSON } from "@/lib/ai";
import { matchJobs } from "@/lib/jobs";

// Deep, personalized analysis that is genuinely derived from the user's own
// assessment input (skills, interests, education, experience, work style).
// Cached per user; regenerated whenever the assessment changes.

const ANALYSIS_SYSTEM = `You are a meticulous career analyst. You examine a person's actual skills, education, and experience and produce a specific, honest, personalized analysis.

RULES:
1. NEVER write generic boilerplate. Every statement must reference the person's actual listed skills, education, or experience.
2. If their input is thin, say so plainly and tell them exactly what to add.
3. Use Indian context: salaries in LPA, companies like TCS, Infosys, Zoho, Wipro, HCL, hospitals, banks, etc.
4. Career paths must come from the provided list only; pick the best 5 for THIS person and justify each with their specific skills.
5. Recommend 3-5 specific jobs (real companies) suited to their skill set, with a reason tied to their skills.
6. Action plan must be concrete and reference their actual skills (e.g., "Your React skill is strong — build X to prove Y").
7. Highlight genuine strengths from their skills AND honest gaps (skills commonly needed in their target field that they lack).
8. Return ONLY valid JSON matching the schema. No markdown, no code fences.`;

interface AnalysisJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  reason: string;
  url?: string;
}

interface AnalysisPayload {
  summary: string;
  strengths: string[];
  gaps: { skill: string; current: string; howToImprove: string; priority: string }[];
  careerPaths: {
    title: string;
    matchScore: number;
    reason: string;
    salaryRange: string;
    growthOutlook: string;
    aiRisk: string;
  }[];
  recommendedJobs: AnalysisJob[];
  actionPlan: string[];
}

function buildPrompt(input: {
  name: string;
  skills: string[];
  interests: string[];
  education: string;
  experience: string;
  workStyle: string;
  values: string[];
  candidatePaths: { title: string; matchScore: number; description: string; salary: string }[];
  candidateJobs: { title: string; company: string; location: string; salary: string }[];
}): string {
  return `PERSON'S REAL PROFILE (from their own input — analyze THIS, not a template):
- Name: ${input.name}
- Skills (exact, as they typed them): ${input.skills.join(", ") || "NONE GIVEN"}
- Interests: ${input.interests.join(", ") || "NONE GIVEN"}
- Education: ${input.education || "NOT GIVEN"}
- Experience: ${input.experience || "NOT GIVEN"}
- Preferred work style: ${input.workStyle}
- Values: ${input.values.join(", ") || "NOT GIVEN"}

TECHNICAL SCORING (algorithm already ranked these from the same skills — enrich, don't contradict wildly):
Candidate career paths (title, algorithm score, description):
${input.candidatePaths.map(p => `- ${p.title} | ${p.matchScore}% | ${p.description} | ${p.salary}`).join("\n") || "- (none)"}

Candidate real jobs from matching:
${input.candidateJobs.map(j => `- ${j.title} at ${j.company} (${j.location}, ${j.salary})`).join("\n") || "- (none)"}

TASK — write a FULL analysis:
{
  "summary": "3-4 sentences genuinely about THIS person — name their skills, education/experience, and where they stand, plus a concrete recommendation.",
  "strengths": ["2-4 real strengths drawn from their actual listed skills/experience"],
  "gaps": [{"skill": "skill they lack for their target field", "current": "one phrase about where they seem to be now", "howToImprove": "specific resource/action", "priority": "high|medium|low"}],
  "careerPaths": [{"title": "from the candidate list", "matchScore": 0-100, "reason": "specific reason tied to their skills/experience", "salaryRange": "₹X-Y LPA", "growthOutlook": "Booming|Growing|Stable|Declining", "aiRisk": "low|medium|high"}],
  "recommendedJobs": [{"title": "...", "company": "...", "location": "...", "salary": "...", "reason": "tied to their skills"}],
  "actionPlan": ["4-6 concrete steps referencing their actual skills, e.g. 'Use your <skill> to build <project>', 'Apply to <company> for <role>'"]
}`;
}

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  try {
    const assessment = await prisma.assessment.findUnique({ where: { userId: user.id } });
    if (!assessment) {
      return NextResponse.json({ error: "Complete the assessment first" }, { status: 400 });
    }

    // Return cached analysis if it exists and is fresh relative to the assessment
    const cached = await prisma.careerAnalysis.findUnique({ where: { userId: user.id } });
    if (cached && new Date(cached.updatedAt).getTime() >= new Date(assessment.updatedAt).getTime() - 2000) {
      try { return NextResponse.json(JSON.parse(cached.analysis)); } catch { /* fall through to regenerate */ }
    }

    const skills = parseJsonArray(assessment.skills);
    const interests = parseJsonArray(assessment.interests);
    const values = parseJsonArray(assessment.values);

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 6,
    });

    const candidatePaths = userPaths.map(up => ({
      title: up.careerPath.title,
      matchScore: Math.round(up.matchScore * 100),
      description: up.careerPath.description,
      salary: up.careerPath.salaryMin > 0
        ? `₹${up.careerPath.salaryMin / 100000}-${up.careerPath.salaryMax / 100000}L`
        : "N/A",
    }));

    const topTitles = userPaths.map(up => up.careerPath.title);
    const scoredJobs = matchJobs(skills, interests, topTitles).slice(0, 6);
    const candidateJobs = scoredJobs.map(j => ({
      title: j.title, company: j.company, location: j.city, salary: j.salary,
    }));

    const prompt = buildPrompt({
      name: user.name,
      skills,
      interests,
      education: assessment.education,
      experience: assessment.experience,
      workStyle: assessment.workStyle,
      values,
      candidatePaths,
      candidateJobs,
    });

    let payload: AnalysisPayload | null = null;
    let aiUsed = false;
    try {
      const text = await generateText(prompt, ANALYSIS_SYSTEM, { temperature: 0.5, maxTokens: 3000 });
      const parsed = extractJSON(text);
      if (parsed?.summary && Array.isArray(parsed.careerPaths)) {
        // Keep only career paths that actually exist in the user's candidate
        // list, and use the algorithm's real scores/salaries (not invented ones).
        const candidateMap = new Map(candidatePaths.map(cp => [cp.title.toLowerCase(), cp]));
        const careerPaths = (parsed.careerPaths as AnalysisPayload["careerPaths"])
          .map(cp => {
            const match = candidateMap.get(cp.title.toLowerCase());
            if (!match) return null;
            return {
              ...cp,
              matchScore: match.matchScore,
              salaryRange: match.salary !== "N/A" ? match.salary : cp.salaryRange,
            };
          })
          .filter((cp): cp is NonNullable<typeof cp> => cp !== null)
          .slice(0, 5);
        payload = { ...(parsed as AnalysisPayload), careerPaths };
        aiUsed = true;
      }
    } catch (e) {
      console.error("analysis AI failed", e);
    }

    // Honest algorithmic fallback — still driven by the user's own scores
    if (!payload) {
      payload = {
        summary: `${user.name}, your profile lists ${skills.length} skill${skills.length === 1 ? "" : "s"}${skills.length ? ` (${skills.slice(0, 5).join(", ")}${skills.length > 5 ? "…" : ""})` : ""}${assessment.education ? `, with education: ${assessment.education}` : ""}${assessment.experience ? `, and experience: ${assessment.experience}` : ""}. Based on ${candidatePaths.length} scored career paths, your strongest alignment is ${candidatePaths[0]?.title || "still forming"} at ${candidatePaths[0]?.matchScore || 0}% match. Focus on closing the gaps below and applying to the matching roles.`,
        strengths: skills.length > 0 ? skills.slice(0, 4) : ["Profile is still being built — add more skills to unlock deeper analysis"],
        gaps: (candidatePaths[0]
          ? [
              { skill: "Deepen your strongest skill with real projects", current: "Listed but not yet demonstrated", howToImprove: "Build 2-3 portfolio projects using it", priority: "high" },
              { skill: "Interview communication", current: "Unknown", howToImprove: "Use the interview preparation module daily", priority: "medium" },
            ]
          : []),
        careerPaths: candidatePaths.slice(0, 5).map(p => ({
          title: p.title,
          matchScore: p.matchScore,
          reason: `Algorithm match of ${p.matchScore}% based on your listed skills (${skills.slice(0, 3).join(", ")}${skills.length > 3 ? "…" : ""})`,
          salaryRange: p.salary,
          growthOutlook: "Growing",
          aiRisk: "medium",
        })),
        recommendedJobs: scoredJobs.slice(0, 4).map(j => ({
          title: j.title, company: j.company, location: j.city, salary: j.salary,
          reason: `Matches your skills at ${Math.round(j.matchScore * 10)}%`,
        })),
        actionPlan: [
          skills.length >= 5 ? `Apply to ${candidatePaths[0]?.title || "your top matching"} roles using your strongest skills` : "Add more of your actual skills to the assessment for a sharper analysis",
          "Build 1 real project in your top career field this month",
          "Complete 1 targeted skill gap from the list above",
          "Practice interviews through the prep module",
          "Track applications weekly in the dashboard",
        ],
      };
    }

    await prisma.careerAnalysis.upsert({
      where: { userId: user.id },
      update: { analysis: JSON.stringify({ ...payload, _ai: aiUsed, _generatedAt: new Date().toISOString() }) },
      create: { userId: user.id, analysis: JSON.stringify({ ...payload, _ai: aiUsed, _generatedAt: new Date().toISOString() }) },
    });

    return NextResponse.json(payload);
  } catch (e) {
    console.error("GET /api/analysis", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
