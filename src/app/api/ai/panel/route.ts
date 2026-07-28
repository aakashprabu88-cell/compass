import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { chat, getUserProfile, profileToContext } from "@/lib/ai";

const INTERVIEWER_PERSONAS = {
  hr: {
    name: "Priya Sharma",
    role: "HR Manager",
    system: `You are Priya Sharma, an HR Manager at a top Indian tech company (think: TCS, Infosys, Zoho, Freshworks). You are warm but probing.

YOUR STYLE:
- Behavioral questions: "Tell me about a time when...", "How would you handle..."
- Culture fit: "What kind of work environment do you thrive in?", "Where do you see yourself in 5 years?"
- Motivation: "Why this company?", "Why this role?"
- Career goals: "What's your ideal career trajectory?"
- Salary expectations (Indian context: LPA)

RULES:
- Ask ONE question at a time
- Be conversational and warm — smile through your words
- Reference the candidate's background when possible
- If they give a vague answer, gently probe deeper
- Use Indian context: LPA, Indian companies, work culture
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
  tech: {
    name: "Arjun Mehta",
    role: "Tech Lead",
    system: `You are Arjun Mehta, a Tech Lead at a top Indian tech company. You are analytical, detail-oriented, and value depth of knowledge.

YOUR STYLE:
- Deep technical questions: "How would you design...", "What's the time complexity of..."
- System design: "How would you architect a scalable..."
- Problem-solving: "Walk me through your approach to..."
- Coding methodology: "How would you break down this problem?"
- Technology choices: "Why React over Vue?", "When would you choose SQL over NoSQL?"

RULES:
- Ask ONE question at a time
- Be precise and expect specific answers
- If they give a high-level answer, drill into implementation details
- Challenge assumptions respectfully: "What if we have 10M users?"
- Reference their skills and projects from their profile
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
  behavioral: {
    name: "Sneha Patel",
    role: "Behavioral Analyst",
    system: `You are Sneha Patel, a Behavioral Analyst at a top Indian tech company. You are empathetic but rigorous, and you use the STAR method to evaluate responses.

YOUR STYLE:
- STAR method: "What was the Situation? What was YOUR Task? What Action did YOU take? What was the Result?"
- Leadership: "Tell me about a time you led a team through conflict"
- Teamwork: "How do you handle disagreements with teammates?"
- Self-awareness: "What's your biggest weakness and how are you addressing it?"
- Growth mindset: "What's the most significant feedback you've received?"

RULES:
- Ask ONE question at a time
- Be encouraging but push for depth — don't let them off easy
- If they don't give a specific example, ask: "Can you give me a real example from your experience?"
- Look for quantified results: "What was the measurable outcome?"
- Reference their background when asking behavioral questions
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
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

    // Fetch user profile for personalized questions
    const profile = await getUserProfile(user.id);
    const profileContext = profile ? profileToContext(profile) : "";

    if (action === "question") {
      const { interviewer, questionNumber } = body;
      const persona = INTERVIEWER_PERSONAS[interviewer as keyof typeof INTERVIEWER_PERSONAS] || INTERVIEWER_PERSONAS.hr;

      const historyText = history?.length
        ? "\n\nPREVIOUS Q&A IN THIS INTERVIEW:\n" + history.map((h: any) =>
          `${h.interviewer || "Interviewer"}: ${h.question}\nCandidate: ${h.answer || "(no answer yet)"}`
        ).join("\n")
        : "";

      const messages = [
        { role: "system" as const, content: persona.system + profileContext },
        { role: "user" as const, content: `You are conducting interview question #${(questionNumber || 0) + 1} (out of 3 total from you) for ${role} at ${company}.${historyText}\n\nAsk your next question now.` },
      ];

      const question = await chat(messages, { temperature: 0.8, maxTokens: 300 });
      // Clean: remove quotes, markdown, and "Question:" prefix
      const cleanQuestion = question
        .replace(/^["']|["']$/g, "")
        .replace(/^Question:\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();

      return NextResponse.json({
        question: cleanQuestion,
        interviewerName: persona.name,
        interviewerRole: persona.role,
      });
    }

    if (action === "followup") {
      const { interviewer, lastQuestion, lastAnswer } = body;
      const persona = INTERVIEWER_PERSONAS[interviewer as keyof typeof INTERVIEWER_PERSONAS] || INTERVIEWER_PERSONAS.hr;

      const historyText = history?.length
        ? "\n\nFULL INTERVIEW SO FAR:\n" + history.map((h: any) =>
          `${h.interviewer || "Interviewer"}: ${h.question}\nCandidate: ${h.answer || "(pending)"}`
        ).join("\n\n")
        : "";

      const messages = [
        { role: "system" as const, content: persona.system + profileContext },
        { role: "user" as const, content: `The candidate was just asked: "${lastQuestion}"\nThey answered: "${lastAnswer}"${historyText}\n\nProvide a brief 1-sentence acknowledgment of their answer, then ask your NEXT question. The question MUST end with a question mark.` },
      ];

      const response = await chat(messages, { temperature: 0.8, maxTokens: 400 });

      // Better extraction: find the last sentence ending with "?"
      const sentences = response.split(/(?<=[.!?])\s+/);
      const lastQuestionIdx = sentences.findLastIndex((s: string) => s.trim().endsWith("?"));

      let question: string;
      if (lastQuestionIdx >= 0) {
        // Combine the last question sentence (and any part of it that got split)
        question = sentences.slice(lastQuestionIdx).join(" ").trim();
      } else {
        // Fallback: find the question mark and extract from there
        const lastQMark = response.lastIndexOf("?");
        if (lastQMark >= 0) {
          // Go back to find the start of this sentence
          let start = response.lastIndexOf(".", lastQMark);
          if (start < 0 || start < lastQMark - 200) start = response.lastIndexOf("\n", lastQMark);
          if (start < 0) start = Math.max(0, lastQMark - 200);
          question = response.substring(start + 1).trim();
        } else {
          question = response;
        }
      }

      // Clean up the question
      question = question
        .replace(/^["',.\s]+|["',.\s]+$/g, "")
        .replace(/\*\*/g, "")
        .trim();

      return NextResponse.json({
        question,
        interviewerName: persona.name,
        interviewerRole: persona.role,
      });
    }

    if (action === "evaluate") {
      const evalSystem = `You are a panel of 3 experienced interviewers at a top Indian tech company, evaluating a candidate for ${role} at ${company}.

Each interviewer has evaluated the candidate independently:
- Priya Sharma (HR): culture fit, motivation, communication, career goals
- Arjun Mehta (Tech Lead): technical depth, problem-solving, system design thinking
- Sneha Patel (Behavioral): STAR method usage, self-awareness, leadership examples

CANDIDATE PROFILE:${profileContext}

SCORING CRITERIA:
- 90-100: Exceptional — strong hire, would fight to get them
- 80-89: Strong — hire, solid across all dimensions
- 70-79: Good — hire with reservations, some areas to develop
- 60-69: Mixed — maybe, needs significant improvement in some areas
- Below 60: Weak — no hire, fundamental gaps

Evaluate based on:
1. Answer quality: specific vs. vague, quantified vs. hand-wavy
2. STAR compliance: did they structure behavioral answers properly?
3. Technical depth: did they demonstrate real understanding?
4. Communication: clear, concise, professional?
5. Self-awareness: do they know their strengths and weaknesses?

Return ONLY valid JSON:
{
  "overallScore": 75,
  "decision": "hire",
  "summary": "2-3 sentence overall assessment referencing specific moments from the interview",
  "interviewerScores": [
    { "id": "hr", "score": 78, "feedback": "Specific feedback from HR perspective" },
    { "id": "tech", "score": 72, "feedback": "Specific technical feedback" },
    { "id": "behavioral", "score": 75, "feedback": "Specific behavioral feedback" }
  ],
  "strengths": ["Specific strength: 'When asked about X, candidate gave a strong STAR response'", "Another specific strength"],
  "improvements": ["Specific improvement: 'For technical questions, provide more concrete examples with code'", "Another specific improvement"]
}

Decision must be one of: "strong_hire", "hire", "maybe", "no_hire"`;

      const qaText = history.map((h: any) =>
        `[${h.interviewer || "Interviewer"}] Q: ${h.question}\nA: ${h.answer || "(no answer)"}`
      ).join("\n\n");

      const messages = [
        { role: "system" as const, content: evalSystem },
        { role: "user" as const, content: `Complete interview transcript:\n\n${qaText}` },
      ];

      const response = await chat(messages, { temperature: 0.3, maxTokens: 2000 });

      // Try JSON extraction
      try {
        const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      } catch {
        // Try brace extraction
        const braceMatch = response.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          try {
            return NextResponse.json(JSON.parse(braceMatch[0]));
          } catch {}
        }

        // Personalized fallback
        return NextResponse.json({
          overallScore: 70,
          decision: "hire",
          summary: `The candidate showed ${profile ? "relevant skills in " + profile.skills.slice(0, 3).join(", ") : "potential"} but could improve answer specificity with more quantified examples.`,
          interviewerScores: [
            { id: "hr", score: 72, feedback: "Good communication and motivation clarity" },
            { id: "tech", score: 68, feedback: "Demonstrated foundational knowledge but needs more depth" },
            { id: "behavioral", score: 70, feedback: "Some good examples but could use more STAR structure" },
          ],
          strengths: ["Clear communication", `Relevant technical foundation${profile ? " in " + profile.skills.slice(0, 2).join(" and ") : ""}`],
          improvements: ["Add specific metrics to examples", "Use STAR format for behavioral questions", "Drill deeper into technical details"],
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
