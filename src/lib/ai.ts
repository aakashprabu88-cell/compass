import { prisma } from "./db";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

// ─── Core Chat Function ────────────────────────────────────────────
// Single entry point for ALL AI calls. Supports conversation history,
// per-task temperature, and configurable max_tokens.

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  systemOverride?: string;
}

export async function chat(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!groqKey && !geminiKey) throw new Error("No AI API key set (GROQ_API_KEY or GEMINI_API_KEY)");

  const temperature = opts.temperature ?? 0.7;
  const maxTokens = opts.maxTokens ?? 4096;

  const models = [MODEL, FALLBACK_MODEL];
  let lastError: Error | null = null;

  if (groqKey) {
    for (const model of models) {
      try {
        const res = await fetch(GROQ_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          lastError = new Error(`Groq ${model} ${res.status}: ${errBody.substring(0, 200)}`);
          continue;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }
  }

  if (geminiKey) {
    try {
      const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n").trim();
      const contents = messages
        .filter(m => m.role !== "system")
        .map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

      const res = await fetch(`${GEMINI_API}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
          contents,
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        lastError = new Error(`Gemini ${res.status}: ${errBody.substring(0, 200)}`);
      } else {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") || "";
        if (text) return text;
        lastError = new Error("Gemini returned empty response");
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("All AI models failed");
}

// Convenience: single-turn prompt (no history)
export async function generateText(
  prompt: string,
  system?: string,
  opts: ChatOptions = {}
): Promise<string> {
  const messages: ChatMessage[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  return chat(messages, opts);
}

// ─── Robust JSON Extraction ────────────────────────────────────────

export function extractJSON(text: string): any {
  // Try direct parse first
  try { return JSON.parse(text.trim()); } catch (e) { console.error("extractJSON direct parse failed", e); }

  // Extract from markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch (e) { console.error("extractJSON fence parse failed", e); }
  }

  // Find first { ... } block (non-greedy)
  const braceMatch = text.match(/\{[\s\S]*?\}/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch (e) { console.error("extractJSON brace parse failed", e); }
  }

  // Find first [ ... ] block
  const bracketMatch = text.match(/\[[\s\S]*?\]/);
  if (bracketMatch) {
    try { return JSON.parse(bracketMatch[0]); } catch (e) { console.error("extractJSON bracket parse failed", e); }
  }

  return null;
}

// ─── User Profile Builder ──────────────────────────────────────────
// Fetches full user context from DB for personalized AI responses.

export interface UserProfileContext {
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  personality: string;
  values: string[];
  workStyle: string;
  education: string;
  experience: string;
  skillGaps: { skill: string; current: number; required: number; priority: string }[];
  topCareerPaths: { title: string; matchScore: number }[];
  jobApplications: { company: string; status: string; matchScore: number }[];
  resumeCount: number;
}

export async function getUserProfile(userId: string): Promise<UserProfileContext | null> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assessment: true,
      skillGaps: { orderBy: { gap: "desc" }, take: 10 },
      paths: { include: { careerPath: true }, orderBy: { matchScore: "desc" }, take: 5 },
      applications: { orderBy: { appliedAt: "desc" }, take: 10 },
      resumes: true,
    },
  });

  if (!dbUser?.assessment) return null;

  const assessment = dbUser.assessment;
  return {
    name: dbUser.name,
    email: dbUser.email,
    skills: JSON.parse(assessment.skills || "[]"),
    interests: JSON.parse(assessment.interests || "[]"),
    personality: assessment.personality || "",
    values: JSON.parse(assessment.values || "[]"),
    workStyle: assessment.workStyle || "hybrid",
    education: assessment.education || "",
    experience: assessment.experience || "",
    skillGaps: dbUser.skillGaps.map(g => ({
      skill: g.skillName,
      current: g.currentLevel,
      required: g.requiredLevel,
      priority: g.priority,
    })),
    topCareerPaths: dbUser.paths.map(p => ({
      title: p.careerPath.title,
      matchScore: Math.round(p.matchScore * 100),
    })),
    jobApplications: dbUser.applications.map(a => ({
      company: a.company,
      status: a.status,
      matchScore: Math.round(a.matchScore * 100),
    })),
    resumeCount: dbUser.resumes.length,
  };
}

export function profileToContext(profile: UserProfileContext): string {
  return `
CANDIDATE PROFILE:
- Name: ${profile.name}
- Skills: ${profile.skills.join(", ") || "None listed"}
- Interests: ${profile.interests.join(", ") || "None listed"}
- Education: ${profile.education || "Not specified"}
- Experience: ${profile.experience || "Entry-level"}
- Work Style: ${profile.workStyle}
- Values: ${profile.values.join(", ") || "Not specified"}
- Personality: ${profile.personality || "Not assessed"}

SKILL GAPS (current → required):
${profile.skillGaps.map(g => `- ${g.skill}: ${g.current}/10 → ${g.required}/10 [${g.priority}]`).join("\n") || "None identified"}

TOP CAREER PATHS:
${profile.topCareerPaths.map(p => `- ${p.title} (${p.matchScore}% match)`).join("\n") || "None assessed"}

JOB APPLICATIONS:
${profile.jobApplications.map(a => `- ${a.company}: ${a.status} (${a.matchScore}% match)`).join("\n") || "No applications yet"}

RESUMES IN SYSTEM: ${profile.resumeCount}
`;
}

// ─── Career Advice ─────────────────────────────────────────────────

export interface CareerAdvice {
  recommendedPaths: { title: string; matchScore: number; reason: string; salaryRange: string; growthOutlook: string }[];
  skillGaps: { skill: string; priority: string; howToLearn: string }[];
  actionPlan: string[];
  summary: string;
}

const CAREER_ADVICE_SYSTEM = `You are a senior career advisor specializing in the Indian tech job market. You have deep knowledge of:
- Indian IT companies (TCS, Infosys, Wipro, Zoho, Freshworks, Flipkart, etc.) and MNCs in India (Google, Microsoft, Amazon, Meta offices in India)
- Salary ranges in Indian LPA (Lakhs Per Annum)
- Current market demands: AI/ML, cloud, full-stack, DevOps are hot
- Campus recruitment vs. lateral hiring patterns in India
- Skill-demand trends from Naukri, LinkedIn India, and AngelList

Be specific, data-driven, and actionable. Reference real companies, real salary ranges, and real skill demands. Never give generic advice.`;

export async function getCareerAdvice(profile: {
  skills: string[];
  interests: string[];
  personality: string;
  education: string;
  experience: string;
  values: string;
}): Promise<CareerAdvice> {
  const prompt = `Analyze this student's profile and provide a comprehensive career recommendation.

PROFILE:
- Skills: ${profile.skills.join(", ")}
- Interests: ${profile.interests.join(", ")}
- Personality: ${profile.personality}
- Education: ${profile.education}
- Experience: ${profile.experience}
- Values: ${profile.values}

TASK: Recommend exactly 5 career paths ranked by compatibility. For each:
- Title must be a specific role (not generic like "Engineer")
- matchScore: 0-100 based on skill overlap + interest alignment + market demand
- reason: one specific sentence explaining why (reference their actual skills)
- salaryRange: realistic Indian LPA range for freshers/experienced
- growthOutlook: "Booming" / "Growing" / "Stable" / "Declining"

Also identify 5 skill gaps (skills they don't have but top paths require), with:
- Specific learning resources (YouTube channels, Coursera courses, books)
- Priority based on market demand

Return ONLY valid JSON (no markdown, no code fences):
{
  "recommendedPaths": [
    { "title": "Specific Role Title", "matchScore": 85, "reason": "Why this matches their specific skills", "salaryRange": "₹6-12 LPA", "growthOutlook": "Growing" }
  ],
  "skillGaps": [
    { "skill": "Specific Skill", "priority": "High", "howToLearn": "Specific resource — e.g., 'fast.com for networking basics, then AWS Solutions Architect cert'" }
  ],
  "actionPlan": [
    "Week 1-2: Start [specific skill] course on [platform]",
    "Week 3-4: Build [specific project type] using [tech]",
    "Month 2: Apply to 5 [specific company type] roles",
    "Month 3: Complete [specific certification]",
    "Ongoing: Practice [specific topic] daily on [platform]"
  ],
  "summary": "2-3 sentence personalized summary referencing their specific skills and suggesting a concrete 3-month plan"
}`;

  const text = await generateText(prompt, CAREER_ADVICE_SYSTEM, { temperature: 0.6 });
  const parsed = extractJSON(text);
  if (parsed?.recommendedPaths) return parsed;

  // Personalized fallback based on actual skills
  const hasWeb = profile.skills.some(s => /react|javascript|node|html|css|next/i.test(s));
  const hasData = profile.skills.some(s => /python|sql|pandas|numpy|excel/i.test(s));
  const hasAI = profile.skills.some(s => /machine learning|tensorflow|pytorch|nlp/i.test(s));

  return {
    recommendedPaths: [
      ...(hasWeb ? [{ title: "Full Stack Developer", matchScore: 80, reason: `Strong ${profile.skills.filter(s => /react|javascript|node|html|css/i.test(s)).slice(0, 2).join(" and ")} foundation`, salaryRange: "₹6-15 LPA", growthOutlook: "Growing" }] : []),
      ...(hasData ? [{ title: "Data Analyst", matchScore: 75, reason: `Data-oriented skills: ${profile.skills.filter(s => /python|sql|pandas|excel/i.test(s)).slice(0, 2).join(" and ")}`, salaryRange: "₹5-12 LPA", growthOutlook: "Growing" }] : []),
      ...(hasAI ? [{ title: "ML Engineer", matchScore: 70, reason: "AI/ML background positions well for this growing field", salaryRange: "₹8-20 LPA", growthOutlook: "Booming" }] : []),
      { title: "Software Developer", matchScore: 65, reason: "Solid programming fundamentals applicable across domains", salaryRange: "₹5-12 LPA", growthOutlook: "Stable" },
      { title: "Technical Consultant", matchScore: 60, reason: "Combination of technical skills and communication ability", salaryRange: "₹6-14 LPA", growthOutlook: "Growing" },
    ].slice(0, 5),
    skillGaps: profile.interests.slice(0, 5).map(i => ({
      skill: i,
      priority: "Medium",
      howToLearn: `Explore ${i} fundamentals on freeCodeCamp or Coursera, then build a small project`,
    })),
    actionPlan: [
      "Complete an online course in your top skill gap area",
      "Build 2 portfolio projects showcasing your strongest skills",
      "Apply to 5 roles matching your top career path",
      "Practice interview questions for your target role",
      "Update your LinkedIn and resume with latest projects",
    ],
    summary: `Based on your ${profile.skills.length} skills and ${profile.interests.length} interests, you have strong potential in tech roles. Focus on bridging your top skill gaps while applying to positions that align with your strongest areas.`,
  };
}

// ─── Resume Generation ─────────────────────────────────────────────

export interface ResumeExperienceInput { company: string; role: string; dates: string; description: string; }
export interface ResumeProjectInput { name: string; tech: string; description: string; }
export interface ResumeEducationInput { degree: string; school: string; year: string; gpa: string; }
export interface ResumeCertInput { name: string; issuer: string; year: string; }

export interface ResumeExperience { company: string; role: string; dates: string; bullets: string[]; }
export interface ResumeProject { name: string; tech: string; bullets: string[]; }
export interface ResumeEducation { degree: string; school: string; year: string; details: string; }
export interface ResumeCert { name: string; issuer: string; year: string; }

export interface ResumeAnalysis {
  matchScore: number;
  verdict: string;
  summary: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: ResumeCert[];
  achievements: string[];
  skills: Record<string, string[]>;
  hiringManagerView: string;
  strengths: string[];
  gaps: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface ResumeBuildInput {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
  skills: string[];
  experiences: ResumeExperienceInput[];
  projects: ResumeProjectInput[];
  education: ResumeEducationInput[];
  certifications: ResumeCertInput[];
  achievements: string[];
  profileContext?: string;
}

const RESUME_SYSTEM = `You are a world-class executive resume writer AND a senior hiring manager at a top technology company (think Google, Microsoft, Amazon, Meta, Flipkart, Razorpay, Zoho, Atlassian). You have seen tens of thousands of resumes and know exactly what makes a hiring manager shortlist one candidate out of 500.

You think in two modes:
1. THE HIRING MANAGER: when you open a resume you scan it in 6 seconds for: relevance to the role, quantified impact, progression, and red flags. You drop resumes with vague bullets, missing keywords, typos, or no measurable outcomes.
2. THE RESUME WRITER: you rewrite content so it survives the 6-second scan AND the ATS keyword filter AND the recruiter's 30-second deeper read.

Your rules:
- NEVER fabricate facts. Never invent companies, degrees, titles, metrics, awards, or technologies the candidate did not provide. You may only reframe and strengthen what is given. If the input lacks a number, describe impact with strong, concrete, professional language instead of inventing metrics.
- Every bullet starts with a powerful action verb and describes WHAT + HOW + RESULT (STAR).
- Content must be keyword-rich for the target role and target company (their interview rounds, their tech stack, their values).
- Use Indian job-market conventions: 1 page for freshers, concise, education near top for freshers.
- Quantify wherever the input supports it (users served, % improvement, scale, team size, deadlines).
- Be brutally honest in the analysis — a recruiter would be.`;

export async function generateFirstClassResume(input: ResumeBuildInput): Promise<ResumeAnalysis> {
  const expText = input.experiences.length > 0
    ? input.experiences.map((e, i) => `${i + 1}. ${e.role || "Role"} @ ${e.company || "Company"} (${e.dates || "dates"})\n   Raw notes: ${e.description || "(none)"}`).join("\n")
    : "(No work experience provided — emphasize projects and skills)";

  const projText = input.projects.length > 0
    ? input.projects.map((p, i) => `${i + 1}. ${p.name || "Project"} — Tech: ${p.tech || "?"}\n   Raw notes: ${p.description || "(none)"}`).join("\n")
    : "(No projects provided)";

  const eduText = input.education.length > 0
    ? input.education.map((e) => `${e.degree || "Degree"} — ${e.school || "School"} (${e.year || "year"})${e.gpa ? `, GPA/CGPA: ${e.gpa}` : ""}`).join("\n")
    : "(No education provided)";

  const certText = input.certifications.length > 0
    ? input.certifications.map((c) => `${c.name || "Cert"} — ${c.issuer || ""}${c.year ? ` (${c.year})` : ""}`).join("\n")
    : "(None)";

  const jdText = input.jobDescription?.trim()
    ? `\n\nTARGET JOB DESCRIPTION (match keywords and priorities to this):\n${input.jobDescription}`
    : "";

  const prompt = `Build a first-class, hiring-manager-grade resume for ${input.name}, targeting "${input.targetRole}"${input.targetCompany ? ` at ${input.targetCompany}` : " at a top-tier company"}.
${input.profileContext ? `\nSYSTEM PROFILE DATA (assessment results, career paths, skill gaps):\n${input.profileContext}` : ""}

RAW CANDIDATE DATA:
- Email: ${input.email || "?"}
- Phone: ${input.phone || "?"}
- Location: ${input.location || "?"}
- LinkedIn: ${input.linkedin || "?"}
- GitHub: ${input.github || "?"}
- Portfolio: ${input.portfolio || "?"}
- Skills: ${input.skills.join(", ") || "(none listed)"}
- Achievements/Awards: ${input.achievements.join(", ") || "(none)"}

EXPERIENCE (raw notes):
${expText}

PROJECTS (raw notes):
${projText}

EDUCATION:
${eduText}

CERTIFICATIONS:
${certText}
${jdText}

TASK:
1. Score how competitive this candidate is for "${input.targetRole}"${input.targetCompany ? ` at ${input.targetCompany}` : ""}. Be strict and realistic (a mediocre fresher resume ≈ 40-55, a strong one ≈ 70-80, exceptional ≈ 85+).
2. Write the final resume content: a powerful summary, grouped skills, 2-4 experience entries (keep only relevant ones; 2-4 bullets each), up to 3 projects (2-3 bullets each), education, certifications, achievements. Rewrite every bullet to be action-first, specific, and impactful using ONLY what was provided.
3. Analyze the resume exactly as a ${input.targetCompany || "top-company"} hiring manager would: their honest first impression, strengths, red flags a recruiter would flag, keywords missing that the ATS/recruiter searches for, and the single highest-leverage improvements ranked by impact.

Return ONLY valid JSON (no markdown, no code fences):
{
  "matchScore": 0-100,
  "verdict": "Exceptional | Strong Match | Competitive | Needs Work | Not Ready",
  "summary": "3-4 line quantified, keyword-rich professional summary",
  "experience": [{ "company": "", "role": "", "dates": "", "bullets": ["action-first bullet with result", "..."] }],
  "projects": [{ "name": "", "tech": "comma separated", "bullets": ["...", "..."] }],
  "education": [{ "degree": "", "school": "", "year": "", "details": "CGPA/coursework, only if strong" }],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "achievements": ["award or achievement as one line"],
  "skills": { "Category": ["skill", "skill"], "Category2": ["..."] },
  "hiringManagerView": "3-5 sentences: 'When I open this resume for ${input.targetRole}, I see...' — what stands out, what would make the recruiter stop, what the 6-second scan concludes",
  "strengths": ["3-4 specific strengths"],
  "gaps": ["3-4 specific red flags or weaknesses"],
  "missingKeywords": ["6-10 keywords the role/company searches for that are absent"],
  "recommendations": ["4-6 concrete actions ranked by impact"]
}`;

  const text = await generateText(prompt, RESUME_SYSTEM, { temperature: 0.5, maxTokens: 7000 });
  const parsed = extractJSON(text);
  if (parsed?.summary && Array.isArray(parsed.experience)) return normalizeResumeAnalysis(parsed);

  // Fallback: build a safe resume from raw input
  return buildFallbackResume(input);
}

function normalizeResumeAnalysis(parsed: any): ResumeAnalysis {
  return {
    matchScore: typeof parsed.matchScore === "number" ? Math.max(0, Math.min(100, parsed.matchScore)) : 50,
    verdict: typeof parsed.verdict === "string" ? parsed.verdict : "Competitive",
    summary: parsed.summary || "",
    experience: Array.isArray(parsed.experience) ? parsed.experience.map((e: any) => ({
      company: e.company || "",
      role: e.role || "",
      dates: e.dates || "",
      bullets: Array.isArray(e.bullets) ? e.bullets.map(String) : [],
    })).filter((e: any) => e.company || e.role || e.bullets.length > 0) : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects.map((p: any) => ({
      name: p.name || "",
      tech: p.tech || "",
      bullets: Array.isArray(p.bullets) ? p.bullets.map(String) : [],
    })).filter((p: any) => p.name || p.bullets.length > 0) : [],
    education: Array.isArray(parsed.education) ? parsed.education.map((e: any) => ({
      degree: e.degree || "",
      school: e.school || "",
      year: e.year || "",
      details: e.details || "",
    })).filter((e: any) => e.degree || e.school) : [],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications.map((c: any) => ({
      name: c.name || "",
      issuer: c.issuer || "",
      year: c.year || "",
    })).filter((c: any) => c.name) : [],
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements.map(String) : [],
    skills: parsed.skills && typeof parsed.skills === "object" ? parsed.skills : {},
    hiringManagerView: parsed.hiringManagerView || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps.map(String) : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.map(String) : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : [],
  };
}

function buildFallbackResume(input: ResumeBuildInput): ResumeAnalysis {
  const skillList = input.skills.length > 0 ? input.skills : [];
  return {
    matchScore: 55,
    verdict: "Competitive",
    summary: `${input.name} is a ${input.targetRole} candidate${input.targetCompany ? ` targeting ${input.targetCompany}` : ""} with skills in ${skillList.slice(0, 4).join(", ") || "software development"}. Focused on building production-quality solutions with measurable outcomes.`,
    experience: input.experiences
      .filter(e => e.company || e.role || e.description)
      .map(e => ({
        company: e.company || "",
        role: e.role || "",
        dates: e.dates || "",
        bullets: e.description.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 4),
      })),
    projects: input.projects
      .filter(p => p.name || p.description)
      .map(p => ({
        name: p.name || "Project",
        tech: p.tech || "",
        bullets: p.description.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 3),
      })),
    education: input.education.map(e => ({
      degree: e.degree || "",
      school: e.school || "",
      year: e.year || "",
      details: e.gpa ? `CGPA/GPA: ${e.gpa}` : "",
    })),
    certifications: input.certifications.map(c => ({ name: c.name, issuer: c.issuer, year: c.year })),
    achievements: input.achievements,
    skills: skillList.length > 0 ? { "Core Skills": skillList } : {},
    hiringManagerView: `This resume shows a candidate targeting ${input.targetRole}${input.targetCompany ? ` at ${input.targetCompany}` : ""}. It has a foundation to build on, but the impact is not yet quantified — every bullet should show what was built, how, and the measurable result.`,
    strengths: skillList.slice(0, 3).map(s => `Listed skill: ${s}`),
    gaps: ["Bullets lack quantified outcomes (users, %, scale, time saved)", "No mention of measurable project impact", "Missing company-specific keywords for the target role"],
    missingKeywords: [],
    recommendations: [
      "Rewrite every bullet with an action verb + what + how + result",
      "Add numbers: users served, % improvement, scale, deadlines met",
      "Mirror the exact keywords from the job description into Skills and bullets",
      "Add LinkedIn/GitHub links so recruiters can verify projects",
    ],
  };
}

export async function improveResumeText(
  targetRole: string,
  kind: "experience" | "project",
  raw: string
): Promise<{ improved: string }> {
  const prompt = `Rewrite the following ${kind === "experience" ? "work experience notes" : "project description"} into 2-4 powerful, ATS-friendly resume bullets for a "${targetRole}" role.

RULES:
- Every bullet: strong action verb + what you did + how + measurable result
- Do NOT invent facts, numbers, or technologies not present
- If no number exists, use strong concrete language (scale, impact, ownership)
- No more than 4 bullets

RAW NOTES:
${raw}

Return ONLY valid JSON (no markdown):
{
  "improved": "Bullet 1\\nBullet 2\\nBullet 3"
}`;

  const text = await generateText(prompt, RESUME_SYSTEM, { temperature: 0.4, maxTokens: 1000 });
  const parsed = extractJSON(text);
  if (parsed?.improved) return { improved: String(parsed.improved) };
  return { improved: raw.split("\n").map(s => s.trim()).filter(Boolean).join("\n") };
}

// ─── Interview Evaluation ──────────────────────────────────────────

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  starAnalysis: { situation: string; task: string; action: string; result: string };
  nextQuestion: string;
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  role: string,
  company: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<InterviewEvaluation> {
  const historyText = conversationHistory.length > 0
    ? "\n\nCONVERSATION CONTEXT:\n" + conversationHistory.map(h => `${h.role === "assistant" ? "Interviewer" : "Candidate"}: ${h.content}`).join("\n")
    : "";

  const prompt = `EVALUATE THIS INTERVIEW ANSWER:

Role: ${role} at ${company}
Question: ${question}
Candidate's Answer: ${answer}
${historyText}

EVALUATION CRITERIA:
1. Relevance — does the answer address the question?
2. Specificity — are there concrete examples, numbers, names?
3. STAR compliance — Situation, Task, Action, Result structure?
4. Depth — does it show understanding or surface-level knowledge?
5. Communication — clear, concise, professional?

Return ONLY valid JSON:
{
  "score": 7.5,
  "feedback": "Specific evaluation referencing what they said",
  "strengths": ["Specific strength with example from their answer", "Another strength"],
  "improvements": ["Specific improvement: 'When asked about X, you mentioned Y but could add Z metric'", "Another improvement"],
  "starAnalysis": {
    "situation": "What situation was described (or 'Not mentioned — advise: \"Set context first\"')",
    "task": "What task was described (or 'Not mentioned — advise: \"Clarify your role\"')",
    "action": "What action was described (or 'Not mentioned — advise: \"Describe specific steps\"')",
    "result": "What result was described (or 'Not mentioned — advise: \"Add quantified outcome\"')"
  },
  "nextQuestion": "A follow-up question that probes deeper based on what they said (or what they missed)"
}`;

  const text = await generateText(prompt, undefined, { temperature: 0.4, maxTokens: 2000 });
  const parsed = extractJSON(text);
  if (parsed?.score) return parsed;

  return {
    score: 6,
    feedback: "The answer shows some understanding but lacks specificity. Add concrete examples with quantified results.",
    strengths: ["Attempted a comprehensive answer"],
    improvements: ["Add specific metrics (e.g., 'improved performance by 30%')", "Use STAR format: Situation → Task → Action → Result"],
    starAnalysis: { situation: "Not clearly described", task: "Not clearly described", action: "Some details given", result: "Not quantified" },
    nextQuestion: "Can you give me a specific example with numbers — what was the measurable outcome?",
  };
}

// ─── Interview Question Generation ─────────────────────────────────

export async function generateInterviewQuestion(
  role: string,
  company: string,
  type: "behavioral" | "technical" | "hr",
  conversationHistory: { role: string; content: string }[] = [],
  userProfile?: UserProfileContext | null
): Promise<string> {
  const profileContext = userProfile ? `\n\nCANDIDATE BACKGROUND:\n${profileToContext(userProfile)}` : "";

  const historyText = conversationHistory.length > 0
    ? "\n\nPREVIOUS Q&A:\n" + conversationHistory.map(h => `${h.role === "assistant" ? "Interviewer" : "Candidate"}: ${h.content}`).join("\n")
    : "";

  const prompt = `You are interviewing a candidate for ${role} at ${company}.
Question type: ${type}${profileContext}${historyText}

RULES:
- Ask ONE question only
- Make it specific to ${company}'s known interview style
- If there's history, ask a FOLLOW-UP that probes deeper into their previous answer
- Be conversational but professional
- For technical: ask about real-world scenarios, not trivia
- For behavioral: push for STAR format responses
- For HR: explore motivation, culture fit, and career goals

Output ONLY the question text. No preamble, no explanation.`;

  const question = await generateText(prompt, undefined, { temperature: 0.8 });
  return question.replace(/^["']|["']$/g, "").trim();
}

// ─── Interview Session Generation ──────────────────────────────────

export interface InterviewSessionQuestion {
  id: string;
  type: string;
  text: string;
  tips: string;
  followUps: string[];
}

export interface InterviewSession {
  role: string;
  company: string;
  roundType: string;
  durationMinutes: number;
  overview: string;
  questions: InterviewSessionQuestion[];
}

export async function generateInterviewSession(
  roundType: "technical" | "hr" | "behavioral" | "managerial" | "panel" | "coding",
  role: string,
  company: string,
  userProfile?: UserProfileContext | null
): Promise<InterviewSession | null> {
  const profileContext = userProfile ? `\n\nCANDIDATE BACKGROUND:\n${profileToContext(userProfile)}` : "";

  const roundSpecific = {
    technical: "Deep technical questions on their skills: data structures, system design, domain fundamentals, and a real-world scenario. Ask follow-up questions that probe depth.",
    hr: "Motivation, company fit, salary expectations, career goals, strengths/weaknesses, and questions about their resume. Indian fresher interview style.",
    behavioral: "Behavioral questions using the STAR method: teamwork, conflict, failure, leadership, pressure situations.",
    managerial: "Case-based and people questions: delegation, conflict between reports, resource constraints, 1:1s, performance management.",
    panel: "A realistic mix of technical + behavioral + HR asked by a panel — 3 technical, 3 behavioral, 2 HR.",
    coding: "Problem-solving questions with a coding focus: algorithms, complexity analysis, edge cases, and code-quality follow-ups.",
  };

  const prompt = `Generate a complete mock interview session.

Target role: ${role}
Company: ${company}
Round: ${roundType.toUpperCase()} round${profileContext}

REQUIREMENTS:
- Generate EXACTLY 8 questions for this ${roundType} round.
- Questions must be SPECIFIC to the ${role} role and reference the candidate's actual skills where possible.
- Mix: 2 opener/easy, 4 medium, 2 hard/probing.
- Each question must include concrete tips on what a strong answer covers (specific points, not generic advice).
- Each question needs 2 realistic follow-up questions an interviewer would ask.
- Overview: 1-2 sentences describing what this round evaluates.
- Duration: realistic for this round type (minutes).

${roundSpecific[roundType]}

Return ONLY valid JSON (no markdown):
{
  "role": "${role}",
  "company": "${company}",
  "roundType": "${roundType}",
  "durationMinutes": 45,
  "overview": "What this round evaluates",
  "questions": [
    { "id": "q1", "type": "technical", "text": "Specific question for this role", "tips": "Concrete points a strong answer covers", "followUps": ["Follow-up 1", "Follow-up 2"] }
  ]
}`;

  const text = await generateText(prompt, undefined, { temperature: 0.7, maxTokens: 3500 });
  const parsed = extractJSON(text);
  if (parsed?.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
    return parsed as InterviewSession;
  }
  return null;
}

// ─── ATS Scoring ───────────────────────────────────────────────────

export async function getATSScore(resumeText: string, jobDescription: string): Promise<{
  overallScore: number;
  keywordMatch: number;
  sectionScores: { name: string; score: number; feedback: string }[];
  missingKeywords: string[];
  suggestions: string[];
  optimizedSummary: string;
}> {
  const prompt = `You are an ATS (Applicant Tracking System) analyzer. Score this resume against the job description.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

SCORING CRITERIA:
1. Keyword Match (40%): How many JD keywords appear in the resume?
2. Section Completeness (20%): Contact, Summary, Experience, Skills, Education all present?
3. Format Compliance (15%): No tables, graphics, headers that confuse ATS?
4. Relevance (15%): Experience/skills match the JD requirements?
5. Quantification (10%): Metrics, numbers, percentages in bullet points?

Extract EXACT keywords from the JD that are missing from the resume.
Score each section 0-100.
Provide 5 specific, actionable improvement suggestions.

Return ONLY valid JSON:
{
  "overallScore": 78,
  "keywordMatch": 65,
  "sectionScores": [
    { "name": "Contact Info", "score": 90, "feedback": "Specific feedback" },
    { "name": "Summary", "score": 70, "feedback": "Specific improvement needed" },
    { "name": "Experience", "score": 75, "feedback": "Specific feedback" },
    { "name": "Skills", "score": 80, "feedback": "Specific feedback" },
    { "name": "Education", "score": 85, "feedback": "Specific feedback" }
  ],
  "missingKeywords": ["exact_keyword_from_JD_1", "exact_keyword_from_JD_2"],
  "suggestions": ["Specific actionable suggestion 1", "Specific actionable suggestion 2", "3", "4", "5"],
  "optimizedSummary": "A rewritten professional summary that naturally incorporates the missing keywords and targets this specific JD"
}`;

  const text = await generateText(prompt, undefined, { temperature: 0.3, maxTokens: 2500 });
  const parsed = extractJSON(text);
  if (parsed?.overallScore) return parsed;

  return {
    overallScore: 55,
    keywordMatch: 40,
    sectionScores: [
      { name: "Contact Info", score: 80, feedback: "Present but verify completeness" },
      { name: "Summary", score: 45, feedback: "Needs to be tailored to this specific JD" },
      { name: "Experience", score: 55, feedback: "Add quantified metrics and JD keywords" },
      { name: "Skills", score: 50, feedback: "Add missing keywords from the job description" },
      { name: "Education", score: 70, feedback: "Adequate" },
    ],
    missingKeywords: ["Could not parse — try pasting a shorter JD"],
    suggestions: ["Tailor your summary to mention the exact role title", "Add metrics to every bullet point", "Mirror the JD's language in your skills section"],
    optimizedSummary: "Professional with relevant technical background seeking this specific role.",
  };
}

// ─── AI Cover Letter Generation ────────────────────────────────────

export async function generateCoverLetterAI(
  userProfile: UserProfileContext,
  jobTitle: string,
  company: string,
  jobDescription: string,
  matchedSkills: string[]
): Promise<{ coverLetter: string; emailDraft: string }> {
  const prompt = `Write a cover letter and email draft for ${userProfile.name} applying to ${jobTitle} at ${company}.

${profileToContext(userProfile)}

JOB DESCRIPTION: ${jobDescription.substring(0, 1500)}
MATCHED SKILLS: ${matchedSkills.join(", ")}

REQUIREMENTS:
- Cover letter: 3 paragraphs max (opening hook, body with 2 specific skill examples, closing with call to action)
- Email draft: subject line + professional email body (4-5 sentences)
- Reference the SPECIFIC company and role
- Include 1-2 quantified achievements or project references from their profile
- Tone: confident but not arrogant, specific not generic
- Indian professional context

Return ONLY valid JSON:
{
  "coverLetter": "Full cover letter text with date, greeting, 3 paragraphs, sign-off",
  "emailDraft": "Subject: Application for [Role] at [Company]\n\nDear [Name/Team],\n\n[4-5 sentence email body]\n\nBest regards,\n[Name]"
}`;

  const text = await generateText(prompt, undefined, { temperature: 0.6 });
  const parsed = extractJSON(text);
  if (parsed?.coverLetter) return parsed;

  return {
    coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in ${matchedSkills.slice(0, 3).join(", ") || userProfile.skills.slice(0, 3).join(", ")}, I am confident I can contribute meaningfully to your team.\n\n${userProfile.experience ? `My ${userProfile.experience} has given me practical experience in building real-world applications. ` : ""}${userProfile.education ? `My ${userProfile.education} background complements this with strong fundamentals. ` : ""}I am particularly excited about ${company}'s work and would love to contribute to your mission.\n\nI would welcome the opportunity to discuss how my skills and enthusiasm align with your team's needs. Thank you for considering my application.\n\nSincerely,\n${userProfile.name}`,
    emailDraft: `Subject: Application for ${jobTitle} at ${company}\n\nDear Hiring Manager,\n\nI am excited to apply for the ${jobTitle} role at ${company}. With my skills in ${matchedSkills.slice(0, 3).join(", ") || userProfile.skills.slice(0, 3).join(", ")}, I am eager to contribute to your team.\n\nI would love to discuss this opportunity further. Thank you for your time.\n\nBest regards,\n${userProfile.name}\n${userProfile.email}`,
  };
}

// ─── Internship Match (AI-Enhanced) ────────────────────────────────

export async function generateInternshipMatchAI(
  userProfile: UserProfileContext,
  internship: {
    title: string;
    company: string;
    domain: string;
    skillsRequired: string[];
    description: string;
    difficulty: string;
    workMode: string;
    stipend: string;
    duration: string;
  }
): Promise<{
  matchScore: number;
  skillMatch: number;
  domainMatch: number;
  selectionProbability: number;
  matchedSkills: string[];
  missingSkills: string[];
  totalLearningDays: number;
  roadmap: { skill: string; week: number; hours: number; resources: string[] }[];
  aiAnalysis: string;
}> {
  const prompt = `You are an internship matching AI. Analyze how well this candidate matches this internship and generate a personalized learning roadmap.

${profileToContext(userProfile)}

INTERNSHIP:
- Title: ${internship.title} at ${internship.company}
- Domain: ${internship.domain}
- Required Skills: ${internship.skillsRequired.join(", ")}
- Description: ${internship.description.substring(0, 1000)}
- Difficulty: ${internship.difficulty}
- Work Mode: ${internship.workMode}
- Stipend: ${internship.stipend}

ANALYSIS REQUIRED:
1. Skill Match: semantic understanding (React.js = React, "web dev" matches frontend skills)
2. Domain Match: how well their interests align with this internship's domain
3. Selection Probability: based on their gap size + competition level
4. For each missing skill: provide SPECIFIC learning resources (actual course names, YouTube channels, documentation links — not generic "learn on freeCodeCamp")
5. Weekly learning roadmap with realistic hour estimates
6. 2-3 sentence analysis of their candidacy

Return ONLY valid JSON:
{
  "matchScore": 78,
  "skillMatch": 85,
  "domainMatch": 72,
  "selectionProbability": 65,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "totalLearningDays": 21,
  "roadmap": [
    {
      "skill": "Missing Skill",
      "week": 1,
      "hours": 20,
      "resources": [
        "Specific course name on specific platform",
        "YouTube: specific channel/video",
        "Practice: specific platform with exercises"
      ]
    }
  ],
  "aiAnalysis": "2-3 sentence personalized analysis referencing their specific skills and the internship requirements"
}`;

  let parsed: any = null;
  try {
    const text = await generateText(prompt, undefined, { temperature: 0.5, maxTokens: 3000 });
    parsed = extractJSON(text);
  } catch (e) {
    console.error("internship match AI failed", e);
  }
  if (parsed?.matchScore) return parsed;

  // Fallback: basic algorithmic match
  const required = internship.skillsRequired;
  const userSkills = userProfile.skills;
  const matched = required.filter((r: string) =>
    userSkills.some((s: string) => s.toLowerCase() === r.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
  );
  const missing = required.filter((r: string) => !matched.includes(r));
  const skillMatch = required.length > 0 ? matched.length / required.length : 0.5;

  return {
    matchScore: Math.round(Math.min(0.95, skillMatch * 0.7 + 0.3) * 100),
    skillMatch: Math.round(skillMatch * 100),
    domainMatch: userProfile.interests.some(i => internship.domain.toLowerCase().includes(i.toLowerCase())) ? 75 : 40,
    selectionProbability: Math.round(Math.min(0.9, skillMatch * 0.6) * 100),
    matchedSkills: matched,
    missingSkills: missing,
    totalLearningDays: missing.length * 7,
    roadmap: missing.map((skill, i) => ({
      skill,
      week: i + 1,
      hours: 20,
      resources: [`Learn ${skill} on freeCodeCamp`, `Practice ${skill} projects on GitHub`],
    })),
    aiAnalysis: `You match ${matched.length}/${required.length} required skills. Focus on learning ${missing.slice(0, 2).join(" and ")} to strengthen your application.`,
  };
}
