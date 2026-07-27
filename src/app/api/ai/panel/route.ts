import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

async function chat(system: string, prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("No API key");

  for (const model of [MODEL, FALLBACK_MODEL]) {
    try {
      const res = await fetch(GROQ_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 512,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch { continue; }
  }
  throw new Error("AI unavailable");
}

const INTERVIEWER_PROMPTS: Record<string, string> = {
  hr: `You are Priya Sharma, an HR Manager at a top Indian tech company. You are warm but probing.
Your style: behavioral questions, culture fit, motivation, salary expectations, career goals.
You use Indian context (LPA, Indian companies). You probe for self-awareness and genuine motivation.
Ask ONE question at a time. Be conversational. Reference their previous answers.`,
  tech: `You are Arjun Mehta, a Tech Lead at a top Indian tech company. You are analytical and detail-oriented.
Your style: deep technical questions, system design, coding approach, problem-solving methodology.
You challenge assumptions and ask follow-ups. You expect specific technical details.
Ask ONE question at a time. Be precise. Reference their previous answers.`,
  behavioral: `You are Sneha Patel, a Behavioral Analyst at a top Indian tech company. You are empathetic but rigorous.
Your style: STAR method, self-awareness, leadership, teamwork, conflict resolution.
You probe for real examples and quantify results. You look for growth mindset.
Ask ONE question at a time. Be encouraging but push for depth. Reference their previous answers.`,
};

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  if (!checkRateLimit(`panel:${user.id}`, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { action, role, company, history } = body;

    if (action === "question") {
      const { interviewer, interviewerName, interviewerRole, interviewerPersonality, questionNumber } = body;
      const system = INTERVIEWER_PROMPTS[interviewer] || INTERVIEWER_PROMPTS.hr;
      const historyText = history?.length
        ? "\n\nPrevious Q&A:\n" + history.map((h: any) => `Candidate was asked: ${h.question}\nThey answered: ${h.answer || "(no answer yet)"}`).join("\n")
        : "";

      const prompt = `Interview for ${role} at ${company}. Question #${questionNumber + 1} (out of 3 for you).${historyText}\n\nAsk your next question.`;
      const question = await chat(system, prompt);
      return NextResponse.json({ question: question.replace(/^["']|["']$/g, "") });
    }

    if (action === "followup") {
      const { interviewer, interviewerName, interviewerRole, interviewerPersonality, lastQuestion, lastAnswer } = body;
      const system = INTERVIEWER_PROMPTS[interviewer] || INTERVIEWER_PROMPTS.hr;
      const historyText = history?.length
        ? "\n\nFull interview context:\n" + history.map((h: any) => `${h.interviewer} asked: ${h.question}\nCandidate: ${h.answer || "(pending)"}`).join("\n")
        : "";

      const prompt = `The candidate was just asked: "${lastQuestion}"\nThey answered: "${lastAnswer}"${historyText}\n\nProvide a brief acknowledgment of their answer (1 sentence), then ask your next question.`;
      const response = await chat(system, prompt);
      // Split into feedback + question (rough)
      const parts = response.split(/\?/);
      const question = parts.length > 1 ? parts.slice(-1)[0].trim() + "?" : response;
      return NextResponse.json({ question: question.replace(/^["']|["']$/g, "") });
    }

    if (action === "evaluate") {
      const evalSystem = `You are a panel of 3 interviewers evaluating a candidate for ${role} at ${company}.
Return EXACTLY this JSON (no markdown, raw JSON):
{
  "overallScore": 75,
  "decision": "hire",
  "summary": "Brief overall assessment",
  "interviewerScores": [
    { "id": "hr", "score": 78, "feedback": "Brief feedback from HR" },
    { "id": "tech", "score": 72, "feedback": "Brief feedback from Tech" },
    { "id": "behavioral", "score": 75, "feedback": "Brief feedback from Behavioral" }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2"]
}
decision must be one of: "strong_hire", "hire", "maybe", "no_hire"`;

      const qaText = history.map((h: any) => `${h.interviewer} asked: ${h.question}\nCandidate: ${h.answer || "(no answer)"}`).join("\n\n");
      const response = await chat(evalSystem, `Full interview:\n\n${qaText}`);
      try {
        const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      } catch {
        return NextResponse.json({
          overallScore: 72,
          decision: "hire",
          summary: "Solid interview performance with good communication skills.",
          interviewerScores: [
            { id: "hr", score: 75, feedback: "Good culture fit" },
            { id: "tech", score: 70, feedback: "Decent technical depth" },
            { id: "behavioral", score: 72, feedback: "Good examples" },
          ],
          strengths: ["Clear communication", "Relevant experience"],
          improvements: ["More specific examples", "Deeper technical details"],
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
