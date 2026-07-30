import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TOPIC_MAP: Record<string, string[]> = {
  Percentage: ["mathematics", "statistics", "data analysis", "data science"],
  "Profit & Loss": ["business", "finance", "accounting", "economics"],
  "Time & Work": ["project management", "operations", "production"],
  "Time Speed Distance": ["physics", "mechanical", "automotive", "logistics"],
  Probability: ["statistics", "data science", "machine learning", "mathematics"],
  "Number System": ["mathematics", "computer science", "data structures"],
  "Ratio & Proportion": ["finance", "business", "chemistry", "cooking"],
  Average: ["statistics", "data analysis", "data science"],
  Algebra: ["mathematics", "physics", "engineering", "computer science"],
  Geometry: ["design", "architecture", "civil", "graphics", "ui/ux"],
  Trigonometry: ["physics", "engineering", "navigation", "surveying"],
  Mensuration: ["civil", "architecture", "manufacturing", "construction"],
  "Data Interpretation": ["data science", "data analysis", "business intelligence"],
  "Data Sufficiency": ["logical reasoning", "critical thinking", "analytics"],
  Simplification: ["accounting", "finance", "engineering", "general"],
  "Pipes & Cisterns": ["civil", "mechanical", "hydrology", "infrastructure"],
};

function scoreFromSkills(skills: string[], topicName: string, topicIndex: number): number {
  const keywords = TOPIC_MAP[topicName] || [];
  const matches = skills.filter(s => {
    const sl = s.toLowerCase();
    return keywords.some(k => sl.includes(k));
  }).length;
  const base = 40 + Math.floor(Math.random() * 15);
  const bonus = Math.min(matches * 12, 35);
  const score = Math.min(base + bonus - topicIndex * 1.5, 98);
  return Math.max(Math.round(score), 20);
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("compass_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const jwt = await import("@/lib/auth").then(m => m.verifyToken(token));
    if (!jwt || !jwt.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const assessment = await prisma.assessment.findFirst({ where: { userId: jwt.id } });
    const skills: string[] = assessment ? JSON.parse(assessment.skills || "[]") : [];

    const topicNames = [
      "Percentage", "Profit & Loss", "Time & Work", "Time Speed Distance",
      "Probability", "Number System", "Ratio & Proportion", "Average",
      "Algebra", "Geometry", "Trigonometry", "Mensuration",
      "Data Interpretation", "Data Sufficiency", "Simplification", "Pipes & Cisterns",
    ];

    const scores = topicNames.map((topic, i) => ({
      topic,
      score: scoreFromSkills(skills, topic, i),
    }));

    const overall = Math.round(scores.reduce((s, t) => s + t.score, 0) / scores.length);

    const strong = scores.filter(t => t.score >= 75).map(t => t.topic);
    const weak = scores.filter(t => t.score < 60).map(t => t.topic);

    return NextResponse.json({ scores, overall, strong, weak });
  } catch (error) {
    console.error("Performance API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
