const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

const SYSTEM_DEFAULT = "You are a helpful AI career advisor. Be concise, specific, and actionable. Use Indian context (LPA for salary, Indian companies). Respond in plain text, no markdown headers.";

async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const key = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI API key not set");

  const models = [MODEL, FALLBACK_MODEL];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const res = await fetch(GROQ_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction || SYSTEM_DEFAULT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2048,
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

export interface CareerAdvice {
  recommendedPaths: { title: string; matchScore: number; reason: string; salaryRange: string; growthOutlook: string }[];
  skillGaps: { skill: string; priority: string; howToLearn: string }[];
  actionPlan: string[];
  summary: string;
}

export async function getCareerAdvice(profile: {
  skills: string[];
  interests: string[];
  personality: string;
  education: string;
  experience: string;
  values: string;
}): Promise<CareerAdvice> {
  const prompt = `Analyze this student profile and recommend career paths.

Profile:
- Skills: ${profile.skills.join(", ")}
- Interests: ${profile.interests.join(", ")}
- Personality: ${profile.personality}
- Education: ${profile.education}
- Experience: ${profile.experience}
- Values: ${profile.values}

Return EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{
  "recommendedPaths": [
    { "title": "Career Title", "matchScore": 85, "reason": "Why this matches", "salaryRange": "₹X-Y LPA", "growthOutlook": "High/Medium/Low" }
  ],
  "skillGaps": [
    { "skill": "Skill Name", "priority": "High/Medium/Low", "howToLearn": "Specific resource or approach" }
  ],
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "summary": "2-3 sentence personalized career summary"
}

Include exactly 5 recommendedPaths and 5 skillGaps.`;

  const text = await generateText(prompt);
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      recommendedPaths: [
        { title: "Software Engineer", matchScore: 75, reason: "Strong technical foundation", salaryRange: "₹6-15 LPA", growthOutlook: "High" },
        { title: "Data Analyst", matchScore: 70, reason: "Analytical mindset", salaryRange: "₹5-12 LPA", growthOutlook: "High" },
      ],
      skillGaps: [{ skill: "Communication", priority: "High", howToLearn: "Practice presentations" }],
      actionPlan: ["Build portfolio projects", "Apply to 5 jobs daily"],
      summary: "Based on your profile, you have strong potential in tech roles.",
    };
  }
}

export interface ResumeBullet {
  section: string;
  content: string;
}

export async function generateResumeBullets(profile: {
  name: string;
  skills: string[];
  projects: string[];
  experience: string;
  education: string;
  targetRole: string;
}): Promise<{ bullets: ResumeBullet[]; summary: string; atsTips: string[] }> {
  const prompt = `Generate a professional resume for this person targeting "${profile.targetRole}".

Name: ${profile.name}
Skills: ${profile.skills.join(", ")}
Projects: ${profile.projects.join("; ")}
Experience: ${profile.experience}
Education: ${profile.education}
Target: ${profile.targetRole}

Return EXACTLY this JSON (no markdown, raw JSON):
{
  "bullets": [
    { "section": "Experience/Project/Education/Skills/Certifications", "content": "Achievement bullet with quantified impact" }
  ],
  "summary": "Professional summary in 2-3 sentences",
  "atsTips": ["Tip 1 to improve ATS score", "Tip 2", "Tip 3"]
}

Generate 10-12 strong bullet points. Use action verbs. Quantify achievements. Follow STAR format.`;

  const text = await generateText(prompt);
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      bullets: [{ section: "Summary", content: "Experienced professional with strong technical skills." }],
      summary: "Professional with diverse technical background.",
      atsTips: ["Add more quantified achievements"],
    };
  }
}

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
    ? "\n\nConversation so far:\n" + conversationHistory.map(h => `${h.role}: ${h.content}`).join("\n")
    : "";

  const prompt = `You are an AI interview coach evaluating a candidate's answer for a ${role} position at ${company}.

Question: ${question}
Candidate's Answer: ${answer}
${historyText}

Evaluate the answer and return EXACTLY this JSON (no markdown, raw JSON):
{
  "score": 7.5,
  "feedback": "Overall evaluation in 2-3 sentences",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "starAnalysis": {
    "situation": "What situation was described (or 'Not mentioned')",
    "task": "What task was described (or 'Not mentioned')",
    "action": "What action was described (or 'Not mentioned')",
    "result": "What result was described (or 'Not mentioned')"
  },
  "nextQuestion": "A follow-up question based on their answer"
}

Score from 1-10. Be constructive but honest. If the answer is vague, say so.`;

  const text = await generateText(prompt);
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 6,
      feedback: "The answer shows some understanding but could be more specific.",
      strengths: ["Attempted to answer comprehensively"],
      improvements: ["Add specific examples with numbers", "Use STAR format"],
      starAnalysis: { situation: "Not clearly mentioned", task: "Not clearly mentioned", action: "Some details provided", result: "Not mentioned" },
      nextQuestion: "Can you give me a specific example with quantified results?",
    };
  }
}

export async function generateInterviewQuestion(
  role: string,
  company: string,
  type: "behavioral" | "technical" | "hr",
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  const historyText = conversationHistory.length > 0
    ? "\n\nPrevious Q&A:\n" + conversationHistory.map(h => `${h.role}: ${h.content}`).join("\n")
    : "";

  const prompt = `You are an interviewer at ${company} for a ${role} position.
Type: ${type} question${historyText}

Ask ONE interview question. Be specific to ${company} and ${role}. 
If there's conversation history, ask a FOLLOW-UP based on their previous answers.
Just output the question text, nothing else. One sentence or two max.`;

  return await generateText(prompt);
}

export async function getATSScore(resumeText: string, jobDescription: string): Promise<{
  overallScore: number;
  keywordMatch: number;
  sectionScores: { name: string; score: number; feedback: string }[];
  missingKeywords: string[];
  suggestions: string[];
  optimizedSummary: string;
}> {
  const prompt = `Analyze this resume against the job description for ATS (Applicant Tracking System) compatibility.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return EXACTLY this JSON (no markdown, raw JSON):
{
  "overallScore": 78,
  "keywordMatch": 65,
  "sectionScores": [
    { "name": "Contact Info", "score": 90, "feedback": "Good" },
    { "name": "Summary", "score": 70, "feedback": "Make it more role-specific" },
    { "name": "Experience", "score": 75, "feedback": "Add more metrics" },
    { "name": "Skills", "score": 80, "feedback": "Good match" },
    { "name": "Education", "score": 85, "feedback": "Strong" }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4", "Suggestion 5"],
  "optimizedSummary": "An improved professional summary tailored to this job"
}

Score from 0-100. Be specific about missing keywords from the job description.`;

  const text = await generateText(prompt);
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overallScore: 60,
      keywordMatch: 50,
      sectionScores: [
        { name: "Contact Info", score: 80, feedback: "Present" },
        { name: "Summary", score: 50, feedback: "Needs customization" },
        { name: "Experience", score: 60, feedback: "Add metrics" },
        { name: "Skills", score: 55, feedback: "Add more relevant skills" },
        { name: "Education", score: 70, feedback: "Adequate" },
      ],
      missingKeywords: ["keywords could not be extracted"],
      suggestions: ["Customize resume for this specific role", "Add quantified achievements"],
      optimizedSummary: "Professional with relevant technical background seeking this role.",
    };
  }
}
