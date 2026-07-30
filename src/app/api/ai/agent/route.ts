import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { chat, getUserProfile, profileToContext } from "@/lib/ai";

const AGENT_SYSTEM = `You are "Compass", an AI Career Agent embedded in a career platform. You have FULL ACCESS to the user's profile data shown below. Use it.

CAPABILITIES:
- Analyze their skills, gaps, applications, and career trajectory
- Recommend specific actions (apply to X company, learn Y skill, practice Z)
- Evaluate their job search strategy and give honest feedback
- Suggest timelines and milestones
- Track their goals and hold them accountable

RULES:
1. ALWAYS reference their specific data — never give generic advice
2. Be direct and honest — if their resume needs work, say so
3. Use Indian context: LPA, Indian companies (TCS, Infosys, Zoho, Freshworks, Flipkart, etc.)
4. Suggest 2-3 concrete, actionable steps whenever possible
5. Keep responses to 3-5 sentences — concise but specific
6. If they ask about something outside career advice, redirect gently

RESPONSE FORMAT:
Return a JSON object with "response" (your advice text) and optionally "actions" (specific steps):
{"response": "...", "actions": [{"type": "apply|skill|interview|resume|insight", "title": "Action title", "description": "Brief description", "priority": "high|medium|low"}]}

Only include actions when you have specific, actionable suggestions. Not every response needs actions.`;

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  if (!checkRateLimit(`agent:${user.id}`, 20, 60000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  try {
    const { message, context, history } = await req.json();

    // Fetch full user profile from DB
    const profile = await getUserProfile(user.id);

    // Build system prompt with user context
    const profileStr = profile ? profileToContext(profile) : "\n[No profile data available — user may need to complete assessment]\n";

    const contextStr = context?.actions?.length
      ? `\nCURRENT ACTION ITEMS:\n${context.actions.map((a: any) => `- [${a.priority}] ${a.title}: ${a.description}`).join("\n")}`
      : "";

    const system = AGENT_SYSTEM + profileStr + contextStr;

    // Build message history for conversation memory
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: system },
    ];

    // Add conversation history (last 10 messages for context window)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    const response = await chat(messages, { temperature: 0.7, maxTokens: 2048 });

    // Parse actions from response
    let actions;
    try {
      // Try to find JSON block in the response
      const jsonMatch = response.match(/\{[\s\S]*"actions"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        actions = parsed.actions;
      }
    } catch (e) { console.error("agent parse actions failed", e); }

    // Clean the response text (remove JSON if present)
    let cleanResponse = response;
    try {
      const jsonStart = response.indexOf('{"response"');
      if (jsonStart >= 0) {
        const parsed = JSON.parse(response.substring(jsonStart));
        cleanResponse = parsed.response || response;
        if (!actions && parsed.actions) actions = parsed.actions;
      }
    } catch (e) { console.error("agent clean response failed", e); }

    return NextResponse.json({ response: cleanResponse, actions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
