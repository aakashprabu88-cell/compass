import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

const SYSTEM_INSTRUCTION = `You are Compass, an AI career co-pilot for Indian students and job seekers. You are warm, encouraging, and practical.

Your role:
- Help users explore career paths, evaluate options, and make informed decisions
- Give specific, actionable advice (not generic platitudes)
- Use Indian context: LPA for salary, Indian companies, Indian education system
- Reference their profile data when available (skills, interests, personality)
- Be honest about tradeoffs — don't just tell them what they want to hear
- Suggest concrete next steps they can take today

Rules:
- Keep responses concise (3-5 sentences max unless asked for detail)
- Use plain text, no markdown headers
- If you don't know something, say so
- Never make up statistics or salary figures
- If asked about something outside career guidance, gently redirect`;

async function chatWithGroq(messages: { role: string; content: string }[], systemPrompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI API key not set");

  const models = [MODEL, FALLBACK_MODEL];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      ];

      const res = await fetch(GROQ_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        lastError = new Error(`Groq ${res.status}: ${errBody.substring(0, 200)}`);
        continue;
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All AI models failed");
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const rateKey = `ai:chat:${user.id}`;
  if (!checkRateLimit(rateKey, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { messages, profileContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const systemPrompt = SYSTEM_INSTRUCTION + (profileContext ? `\n\nUser profile context:\n${profileContext}` : "");
    const response = await chatWithGroq(messages, systemPrompt);

    return NextResponse.json(
      { response },
      { headers: getRateLimitHeaders(rateKey, 30, 60000) }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
