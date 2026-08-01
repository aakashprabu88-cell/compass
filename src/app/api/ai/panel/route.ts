import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { chat, extractJSON, getUserProfile, profileToContext } from "@/lib/ai";
import { prisma } from "@/lib/db";

const INTERVIEWER_PERSONAS: Record<string, { name: string; role: string; system: string }> = {
  hr: {
    name: "Priya Sharma",
    role: "HR Manager",
    system: `You are Priya Sharma, an HR Manager at a top Indian tech company (think: TCS, Infosys, Zoho, Freshworks, Google India). You are warm but probing.

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
  manager: {
    name: "Rahul Verma",
    role: "Hiring Manager",
    system: `You are Rahul Verma, the Hiring Manager / Engineering Director at a top Indian company (or the senior business leader for non-tech roles). You are strategic, blunt but fair, and you decide the final outcome.

YOUR STYLE:
- Business impact: "How will you add value in your first 90 days?"
- Vision and ownership: "Where do you want to be in 5 years, and how does this role fit?"
- Big-picture scenarios: "If you joined tomorrow, what's the first problem you'd solve?"
- Leadership potential: "Tell me about a time you took ownership beyond your job description"
- Pressure and resilience: "How do you handle a situation where everything is failing?"
- Closing questions: "Do you have any questions for us?"

RULES:
- Ask ONE question at a time
- Think like a senior leader deciding hire/no-hire
- Push on ownership, results, and growth mindset
- Reference the candidate's specific background and skills
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
  design: {
    name: "Kavya Iyer",
    role: "Design Lead",
    system: `You are Kavya Iyer, a Design Lead at a top product company (think: Flipkart, Zoho, Freshworks). You care about user empathy, design thinking, and craft.

YOUR STYLE:
- Design thinking: "Walk me through how you'd redesign [feature] for [users]"
- User empathy: "How do you decide what a user actually needs vs. what they ask for?"
- Portfolio depth: "Tell me about a project you're proud of and the trade-offs you made"
- Critique and iteration: "How do you handle design feedback you disagree with?"
- Collaboration: "How do you work with engineers and product managers?"

RULES:
- Ask ONE question at a time
- Push for process, reasoning, and trade-offs — not just final visuals
- Reference the candidate's skills and projects
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
  data: {
    name: "Rohit Nair",
    role: "Data Science Lead",
    system: `You are Rohit Nair, a Data Science Lead at a top Indian company (think: Flipkart, PhonePe, Paytm, or a big analytics team). You value rigor, metrics, and honest modeling.

YOUR STYLE:
- Data reasoning: "How would you approach measuring [metric]?"
- Modeling: "Walk me through how you'd build a model for [problem] — from data to deployment"
- Statistics: "What does a p-value really tell you? When would you choose XGBoost over linear regression?"
- Business impact: "How do you quantify the business value of a model?"
- Trade-offs: "Bias vs. variance, speed vs. accuracy — how do you decide?"

RULES:
- Ask ONE question at a time
- Push for concrete methodology, metrics, and honest caveats
- Reference the candidate's skills and projects
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
  business: {
    name: "Meera Krishnan",
    role: "Business Lead",
    system: `You are Meera Krishnan, a Business/Revenue Lead at a top Indian company (think: Swiggy, Zomato, Meesho, or an enterprise firm). You care about commercial instinct and execution.

YOUR STYLE:
- Business cases: "How would you grow [metric] in a tier-2 city?"
- Customer thinking: "Who is the customer and what problem are we really solving?"
- Analytics: "What numbers would you track to know this worked?"
- Communication: "How would you explain this to a client who doesn't care about tech?"
- Execution: "Walk me through a time you delivered under a tight deadline"

RULES:
- Ask ONE question at a time
- Push for numbers, structure, and real-world pragmatism
- Reference the candidate's background
- After the candidate answers, acknowledge briefly (1 sentence) then ask next question`,
  },
};

const QUESTIONS_PER_INTERVIEWER = 4;

function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

async function getAskedQuestions(userId: string): Promise<{ list: string[]; normalized: Set<string> }> {
  const asked = await prisma.panelQuestion.findMany({
    where: { userId },
    orderBy: { askedAt: "desc" },
    take: 40,
    select: { question: true },
  });
  const list = asked.map(a => a.question).filter(Boolean);
  const normalized = new Set(list.map(normalizeQuestion).filter(Boolean));
  return { list, normalized };
}

async function saveQuestion(userId: string, question: string) {
  const q = question?.trim();
  if (!q) return;
  try {
    await prisma.panelQuestion.create({ data: { userId, question: q } });
  } catch (e) {
    console.error("panel save question failed", e);
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  if (!checkRateLimit(`panel:${user.id}`, 90, 60000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { action, role, company, history } = body;

    const profile = await getUserProfile(user.id);
    const profileContext = profile ? profileToContext(profile) : "";

    const { list: askedList, normalized: askedNormalized } = await getAskedQuestions(user.id);
    const askedContext = askedList.length > 0
      ? `\n\nQUESTIONS ALREADY ASKED TO THIS CANDIDATE IN PREVIOUS SESSIONS (You MUST NOT repeat, rephrase, or ask anything similar to these — pick a fresh angle):\n${askedList.join("\n")}`
      : "";

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
        { role: "user" as const, content: `You are conducting interview question #${(questionNumber || 0) + 1} (out of ${QUESTIONS_PER_INTERVIEWER} total from you) for ${role} at ${company}.${historyText}${askedContext}\n\nAsk your next question now. It must be a NEW question you have never asked this candidate before.` },
      ];

      const question = await chat(messages, { temperature: 0.8, maxTokens: 300 });
      let cleanQuestion = question
        .replace(/^["']|["']$/g, "")
        .replace(/^Question:\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();

      if (askedNormalized.has(normalizeQuestion(cleanQuestion))) {
        const retry = await chat(messages, { temperature: 0.9, maxTokens: 300 });
        cleanQuestion = retry
          .replace(/^["']|["']$/g, "")
          .replace(/^Question:\s*/i, "")
          .replace(/\*\*/g, "")
          .trim();
      }

      await saveQuestion(user.id, cleanQuestion);

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
        { role: "user" as const, content: `The candidate was just asked: "${lastQuestion}"\nThey answered: "${lastAnswer}"${historyText}${askedContext}

Now do TWO things:
1. EVALUATE their answer to "${lastQuestion}" — score 1-10 (7.5 is average, 9+ is exceptional). Be specific: reference exactly what they said. Note STAR structure, specificity, numbers, and depth.
2. Ask your NEXT question for ${role} at ${company}. It must build on the conversation and be NEW — never repeat or rephrase a question from the ALREADY ASKED list.

Return ONLY valid JSON (no markdown):
{
  "score": 7.5,
  "feedback": "2 sentences referencing exactly what the candidate said",
  "strengths": ["specific strength with example", "another"],
  "improvements": ["specific improvement with example", "another"],
  "modelAnswer": "A concise strong answer to their question (2-4 sentences, Indian interview style)",
  "nextQuestion": "the next question"
}` },
      ];

      const response = await chat(messages, { temperature: 0.7, maxTokens: 700 });
      const parsed = extractJSON(response) || {};

      let question = String(parsed.nextQuestion || "").trim();
      if (!question || askedNormalized.has(normalizeQuestion(question))) {
        const retry = await chat(messages, { temperature: 0.85, maxTokens: 700 });
        const parsedRetry = extractJSON(retry) || {};
        question = String(parsedRetry.nextQuestion || parsed.nextQuestion || "Can you tell me more about that?").trim();
      }

      await saveQuestion(user.id, question);

      return NextResponse.json({
        question,
        interviewerName: persona.name,
        interviewerRole: persona.role,
        evaluation: {
          score: typeof parsed.score === "number" ? parsed.score : 6,
          feedback: parsed.feedback || "The answer could use more specificity. Add concrete examples with numbers.",
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Attempted a complete answer"],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Add quantified results (e.g., 'improved by 30%')", "Use STAR: Situation → Task → Action → Result"],
          modelAnswer: parsed.modelAnswer || "A strong answer starts with a clear 1-line thesis, adds a specific example with numbers, and ends with the outcome you delivered.",
        },
      });
    }

    if (action === "evaluate") {
      const evalSystem = `You are the hiring panel chair at a top Indian tech company, delivering the final verdict for a candidate for ${role} at ${company}.

The panel evaluated the candidate independently:
- Priya Sharma (HR): culture fit, motivation, communication, career goals
- Arjun Mehta (Tech Lead) / domain lead: technical depth, problem-solving, domain thinking
- Sneha Patel (Behavioral): STAR method usage, self-awareness, leadership examples
- Rahul Verma (Hiring Manager): ownership, business impact, growth potential, final decision

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
3. Technical/domain depth: did they demonstrate real understanding?
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
    { "id": "behavioral", "score": 75, "feedback": "Specific behavioral feedback" },
    { "id": "manager", "score": 74, "feedback": "Specific hiring-manager feedback" }
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
      const parsed = extractJSON(response);

      if (parsed?.interviewerScores && parsed.overallScore) {
        return NextResponse.json(parsed);
      }

      return NextResponse.json({
        overallScore: 70,
        decision: "hire",
        summary: `The candidate showed ${profile ? "relevant skills in " + profile.skills.slice(0, 3).join(", ") : "potential"} but could improve answer specificity with more quantified examples.`,
        interviewerScores: [
          { id: "hr", score: 72, feedback: "Good communication and motivation clarity" },
          { id: "tech", score: 68, feedback: "Demonstrated foundational knowledge but needs more depth" },
          { id: "behavioral", score: 70, feedback: "Some good examples but could use more STAR structure" },
          { id: "manager", score: 71, feedback: "Shows ownership potential but needs clearer career direction" },
        ],
        strengths: ["Clear communication", `Relevant foundation${profile ? " in " + profile.skills.slice(0, 2).join(" and ") : ""}`],
        improvements: ["Add specific metrics to examples", "Use STAR format for behavioral questions", "Drill deeper into technical details"],
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
