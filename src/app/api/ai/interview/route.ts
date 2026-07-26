import { NextRequest, NextResponse } from "next/server";
import { evaluateInterviewAnswer, generateInterviewQuestion } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, question, answer, role, company, type, conversationHistory } = body;

    if (action === "evaluate") {
      if (!question || !answer) {
        return NextResponse.json({ error: "question and answer required" }, { status: 400 });
      }
      const evaluation = await evaluateInterviewAnswer(
        question,
        answer,
        role || "Software Engineer",
        company || "Tech Company",
        conversationHistory || []
      );
      return NextResponse.json(evaluation);
    }

    if (action === "question") {
      const q = await generateInterviewQuestion(
        role || "Software Engineer",
        company || "Tech Company",
        type || "behavioral",
        conversationHistory || []
      );
      return NextResponse.json({ question: q });
    }

    return NextResponse.json({ error: "action must be 'evaluate' or 'question'" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI service unavailable" }, { status: 500 });
  }
}
