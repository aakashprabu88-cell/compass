import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUserProfile, evaluateInterviewAnswer } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question, answer, role, company, history } = await request.json();
    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const profile = await getUserProfile(user.id);
    const evaluation = await evaluateInterviewAnswer(
      question,
      answer,
      role || profile?.topCareerPaths[0]?.title || "the target role",
      company || "a leading Indian company",
      Array.isArray(history) ? history : []
    );

    return NextResponse.json(evaluation);
  } catch (e) {
    console.error("POST /api/interview/evaluate", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
