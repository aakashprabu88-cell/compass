import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SKILL_KEYWORDS = [
  "python","java","javascript","typescript","react","node.js","angular","vue","html","css",
  "sql","mysql","postgresql","mongodb","redis","graphql","rest api","spring boot","django","flask",
  "aws","azure","gcp","docker","kubernetes","ci/cd","terraform","linux","git",
  "machine learning","deep learning","tensorflow","pytorch","nlp","data analysis","statistics",
  "excel","power bi","tableau","data visualization",
  "figma","design thinking","user research","prototyping","ui/ux","visual design",
  "c","c++","c#","go","rust","ruby","php","swift","kotlin",
  "selenium","testing","qa","automation","jira",
  "seo","google ads","social media","content strategy","analytics","digital marketing",
  "project management","agile","scrum","leadership","communication","problem solving",
  "network security","ethical hacking","siem","incident response","penetration testing",
  "financial modeling","accounting","tally","taxation",
  "embedded systems","pcb design","iot","raspberry pi","arduino",
  "autocad","solidworks","cad","mechanical design",
  "nursing","patient care","pharmacology","medical",
  "teaching","curriculum design","lesson planning",
  "writing","technical documentation","copywriting",
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = SKILL_KEYWORDS.filter(skill => lower.includes(skill));
  return [...new Set(found)];
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resume || null);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const textContent = formData.get("text") as string || "";
    const experience = formData.get("experience") as string || "";
    const education = formData.get("education") as string || "";
    const skillsInput = formData.get("skills") as string || "";

    let allText = textContent;

    // If file uploaded, read it
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      allText += " " + buffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, " ");
    }

    // Add manual skills input
    if (skillsInput) {
      allText += " " + skillsInput;
    }

    const extractedSkills = extractSkills(allText);

    // Also add any comma-separated skills the user typed
    if (skillsInput) {
      const manualSkills = skillsInput.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      manualSkills.forEach(s => {
        if (!extractedSkills.includes(s)) extractedSkills.push(s);
      });
    }

    const summary = extractedSkills.length > 0
      ? `Detected ${extractedSkills.length} skills from your resume. We'll use these to match and auto-apply to the best jobs for you.`
      : "No specific skills detected. Try uploading a different file or entering skills manually.";

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file?.name || "manual-entry",
        extractedSkills: JSON.stringify(extractedSkills),
        experience,
        education,
        summary,
      },
    });

    return NextResponse.json({ resume, skills: extractedSkills, summary });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
