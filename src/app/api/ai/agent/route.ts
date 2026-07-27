import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

const AGENT_SYSTEM = `You are an AI Career Agent for a student/job seeker. You are proactive, data-driven, and action-oriented.

Your role:
- Monitor the user's career progress (applications, interviews, skills)
- Suggest specific, prioritized actions based on their data
- Give honest feedback on their job search strategy
- Recommend skills to learn, companies to target, and timelines
- Track their goals and hold them accountable

Rules:
- Be direct and specific (not generic advice)
- Use Indian context: LPA, Indian companies, Indian job market
- Suggest 2-3 concrete actions whenever possible
- If they ask about something specific, give a focused answer
- Keep responses to 3-4 sentences max
- Return JSON with actions when appropriate: {"response": "...", "actions": [{"type": "apply|skill|interview|resume|insight", "title": "Action title", "description": "Brief description", "priority": "high|medium|low"}]}`;

async function chat(messages: { role: string; content: string }[], system: string): Promise<string> {
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
            ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch { continue; }
  }
  throw new Error("AI unavailable");
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  if (!checkRateLimit(`agent:${user.id}`, 20, 60000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  try {
    const { message, context } = await req.json();

    const contextStr = context?.actions?.length
      ? `\n\nUser's current action items:\n${context.actions.map((a: any) => `- [${a.priority}] ${a.title}: ${a.description}`).join("\n")}`
      : "";

    const response = await chat(
      [{ role: "user", content: message }],
      AGENT_SYSTEM + contextStr
    );

    // Try to parse actions from response
    let actions;
    try {
      const jsonMatch = response.match(/\{[\s\S]*"actions"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        actions = parsed.actions;
      }
    } catch {}

    return NextResponse.json({ response, actions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
