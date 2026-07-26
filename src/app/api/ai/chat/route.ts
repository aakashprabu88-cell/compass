import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI service not configured" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION + (profileContext ? `\n\nUser profile context:\n${profileContext}` : ""),
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return NextResponse.json(
      { response },
      { headers: getRateLimitHeaders(rateKey, 30, 60000) }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
