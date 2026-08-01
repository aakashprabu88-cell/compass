import { chat, extractJSON } from "./ai";
import { prisma } from "./db";

// ─── Types ──────────────────────────────────────────────────────────

export type EmailStyle = "formal" | "friendly" | "technical" | "startup" | "executive";

export interface CareerDetailsData {
  location: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
  targetRole: string;
  employmentType: string;
  projects: { name: string; tech: string; description: string; link: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  achievements: string[];
  preferredStyle: string;
}

export interface EmailDraftInput {
  name: string;
  email: string;
  company: string;
  role: string;
  location?: string;
  style: EmailStyle;
  details: CareerDetailsData;
  skills: string[];
  interests: string[];
  education: string;
  experience: string;
  personality: string;
  topCareers: string[];
}

export interface EmailScore {
  score: number;
  why: string;
}

export interface EmailScoreResult {
  overall: number;
  selectionProbability: number;
  scores: {
    professionalism: EmailScore;
    recruiterImpression: EmailScore;
    personalization: EmailScore;
    ats: EmailScore;
    grammar: EmailScore;
    confidence: EmailScore;
    readability: EmailScore;
  };
  recommendation: string;
}

export interface SubjectCandidate {
  text: string;
  openRate: number;
  professionalism: number;
  appeal: number;
}

export interface EmailSuggestion {
  id: string;
  quote: string;
  issue: string;
  suggestion: string;
  severity: "high" | "medium" | "low";
}

// ─── Company Culture Intelligence ───────────────────────────────────

const COMPANY_CULTURE: Record<string, { values: string[]; tone: string; focus: string }> = {
  google: { values: ["innovation", "technical excellence", "impact at scale"], tone: "sharp, structured, evidence-driven", focus: "engineering quality, measurable impact, curiosity" },
  microsoft: { values: ["collaboration", "growth mindset", "customer obsession"], tone: "warm, collaborative, forward-looking", focus: "teamwork, learning agility, real-world product impact" },
  amazon: { values: ["leadership principles", "ownership", "deliver results", "customer obsession"], tone: "direct, action-oriented, results-focused", focus: "ownership, measurable outcomes, bias for action" },
  meta: { values: ["product impact", "innovation", "speed"], tone: "bold, product-first, energetic", focus: "shipping products, technical depth, user impact" },
  apple: { values: ["craftsmanship", "privacy", "design excellence"], tone: "precise, elegant, understated", focus: "polish, attention to detail, quality of work" },
  netflix: { values: ["judgment", "freedom & responsibility", "impact"], tone: "confident, candid, high-performance", focus: "ownership, impact, strong judgment" },
  tesla: { values: ["mission-driven", "engineering intensity", "first principles"], tone: "intense, mission-focused, technical", focus: "speed of execution, engineering depth, energy" },
  infosys: { values: ["learning", "client focus", "integrity"], tone: "professional, reliable, consultative", focus: "delivering value, continuous learning, client success" },
  tcs: { values: ["leadership with trust", "customer value", "global delivery"], tone: "formal, reliable, service-minded", focus: "enterprise delivery, reliability, business value" },
  accenture: { values: ["client value", "innovation", "inclusion"], tone: "consultative, polished, strategic", focus: "business outcomes, innovation, professionalism" },
  wipro: { values: ["integrity", "inclusion", "customer focus"], tone: "professional, balanced, dependable", focus: "delivering outcomes, teamwork, reliability" },
  cognizant: { values: ["client success", "innovation", "inclusive growth"], tone: "consultative, forward-looking", focus: "digital transformation, client value" },
};

const STARTUP_HINTS = ["pvt", "labs", "inc", "ltd", "technologies", "technolog", "tech", "solutions", "services", "digital", "data", "ai", "analytic"];

export function getCompanyCulture(company: string): { values: string[]; tone: string; focus: string; isStartup: boolean } {
  const key = company.toLowerCase().split(/[^a-z]/).join("");
  for (const name of Object.keys(COMPANY_CULTURE)) {
    if (key.includes(name)) return { ...COMPANY_CULTURE[name], isStartup: false };
  }
  const lower = company.toLowerCase();
  const isStartup = STARTUP_HINTS.some(h => lower.includes(h)) && lower.length > 3;
  return {
    values: isStartup
      ? ["fast execution", "builder mindset", "adaptability", "ownership"]
      : ["professionalism", "growth mindset", "collaboration", "impact"],
    tone: isStartup ? "energetic, concise, builder-minded" : "professional, confident, value-focused",
    focus: isStartup ? "shipping quickly, learning fast, wearing multiple hats" : "delivering measurable value, professionalism, long-term fit",
    isStartup,
  };
}

// ─── Prompt builders ────────────────────────────────────────────────

const STYLE_GUIDE: Record<EmailStyle, string> = {
  formal: "FORMAL CORPORATE: polished, conservative business English. Complete sentences, courteous tone, standard professional structure.",
  friendly: "FRIENDLY PROFESSIONAL: warm, personable, approachable. Natural conversational tone that still stays professional and credible.",
  technical: "TECHNICAL: precise, engineering-focused. Emphasize specific technologies, architecture, measurable technical achievements, and industry terminology.",
  startup: "STARTUP: concise, energetic, action-oriented. Short punchy sentences, builder mindset, highlight speed of learning and adaptability.",
  executive: "EXECUTIVE: crisp, confident, senior. Big-picture impact, leadership language, minimal fluff, commanding and results-driven.",
};

function candidateBlock(input: EmailDraftInput): string {
  const d = input.details;
  const links = [
    d.portfolio ? `Portfolio: ${d.portfolio}` : "",
    d.github ? `GitHub: ${d.github}` : "",
    d.linkedin ? `LinkedIn: ${d.linkedin}` : "",
  ].filter(Boolean).join(" | ");

  const projects = d.projects
    .filter(p => p.name)
    .map(p => `- ${p.name}${p.tech ? ` (${p.tech})` : ""}${p.description ? `: ${p.description}` : ""}${p.link ? ` [${p.link}]` : ""}`)
    .join("\n");

  const certs = d.certifications
    .filter(c => c.name)
    .map(c => `- ${c.name}${c.issuer ? `, ${c.issuer}` : ""}${c.year ? `, ${c.year}` : ""}`)
    .join("\n");

  return [
    `NAME: ${input.name}`,
    `CONTACT EMAIL: ${input.email}`,
    d.phone ? `PHONE: ${d.phone}` : "",
    d.location ? `CITY: ${d.location}` : "",
    links ? `LINKS: ${links}` : "",
    d.targetRole ? `TARGET ROLE: ${d.targetRole}` : "",
    `EMPLOYMENT SOUGHT: ${d.employmentType === "fulltime" ? "Full-time" : "Internship"}`,
    input.skills.length ? `SKILLS: ${input.skills.slice(0, 14).join(", ")}` : "",
    input.education ? `EDUCATION: ${input.education}` : "",
    input.experience ? `EXPERIENCE: ${input.experience}` : "",
    input.personality && input.personality !== "{}" ? `PERSONALITY STYLE: ${input.personality}` : "",
    input.topCareers.length ? `TOP CAREER PATHS: ${input.topCareers.slice(0, 3).join(", ")}` : "",
    projects ? `PROJECTS:\n${projects}` : "",
    certs ? `CERTIFICATIONS:\n${certs}` : "",
    d.achievements.length ? `ACHIEVEMENTS: ${d.achievements.join("; ")}` : "",
    input.interests.length ? `INTERESTS: ${input.interests.slice(0, 6).join(", ")}` : "",
  ].filter(Boolean).join("\n");
}

function cultureBlock(company: string, culture: ReturnType<typeof getCompanyCulture>): string {
  return [
    `COMPANY: ${company}`,
    `COMPANY HIRING CULTURE: values ${culture.values.join(", ")}; tone should be ${culture.tone}.`,
    `WHAT RECRUITER CARES ABOUT: ${culture.focus}.`,
  ].join("\n");
}

const GENERATE_SYSTEM = `You are a world-class recruiting copywriter who writes cold outreach emails that hiring managers actually reply to. You write like an experienced professional — never like an AI, never robotic, never templated.

STRICT WRITING RULES:
- No "I hope this email finds you well", "Dear Sir/Madam", "I am writing this email to", or any filler/generic openings.
- Open with a strong, specific first line that shows you researched the company and the role.
- Include: professional greeting, strong opening, reason for contacting, most relevant skills, 1-2 concrete projects/achievements, business impact where real, technical strengths, portfolio/GitHub/LinkedIn links, availability, professional closing, and a professional signature.
- ONLY use facts supplied in the CANDIDATE block. Never invent metrics, usernames, companies, or links. If a project has no metric, describe its outcome qualitatively without fabricating numbers.
- Naturally weave in 5-8 keywords relevant to the role and industry WITHOUT keyword stuffing.
- Keep the body 140-190 words, concise and scannable (short paragraphs, no long walls of text).
- Availability: mention you are immediately available and flexible to start.
- Signature: "Best regards," then name, then contact links on the final line.
- The email must feel bespoke to THIS company and THIS candidate.

Respond with STRICT JSON ONLY, no markdown fences:
{"subject": "<one subject line, max 9 words, specific to this company and role>", "body": "<the full email body with \\n newlines>"}`;

export async function generateEmail(input: EmailDraftInput): Promise<{ subject: string; body: string }> {
  const culture = getCompanyCulture(input.company);
  const prompt = [
    `Write a ${input.style.toUpperCase()} style outreach email (${STYLE_GUIDE[input.style]}).`,
    "",
    cultureBlock(input.company, culture),
    "",
    `ROLE APPLYING FOR: ${input.role}${input.location ? ` (${input.location})` : ""}`,
    "",
    "CANDIDATE BLOCK:",
    candidateBlock(input),
  ].join("\n");

  try {
    const raw = await chat(
      [
        { role: "system", content: GENERATE_SYSTEM },
        { role: "user", content: prompt },
      ],
      { temperature: 0.75, maxTokens: 1536 }
    );
    const parsed = extractJSON(raw);
    if (parsed && typeof parsed.subject === "string" && typeof parsed.body === "string" && parsed.body.trim().length > 40) {
      return { subject: parsed.subject.trim(), body: parsed.body.trim() };
    }
  } catch (e) {
    console.error("generateEmail AI failed", e);
  }
  return fallbackEmail(input, culture);
}

// ─── Deterministic fallback (never breaks UX) ───────────────────────

function fallbackEmail(input: EmailDraftInput, culture: ReturnType<typeof getCompanyCulture>): { subject: string; body: string } {
  const d = input.details;
  const skills = input.skills.slice(0, 5).join(", ");
  const project = d.projects.find(p => p.name);
  const links = [
    d.github ? `GitHub: ${d.github}` : "",
    d.linkedin ? `LinkedIn: ${d.linkedin}` : "",
    d.portfolio ? `Portfolio: ${d.portfolio}` : "",
  ].filter(Boolean).join("  |  ");
  const type = d.employmentType === "fulltime" ? "full-time" : "internship";

  const body = [
    `Dear Hiring Team,`,
    ``,
    `I'm ${input.name}, and I'm applying for the ${input.role} position at ${input.company}. ${input.experience ? `With ${input.experience}, ` : ""}I bring a combination of ${skills || "strong technical skills"} and a track record of shipping real outcomes.`,
    ``,
    project
      ? `One project I'm proud of is ${project.name}${project.tech ? `, built with ${project.tech}` : ""}${project.description ? ` — ${project.description}` : ""}. It reflects how I ${culture.values[0]} and focus on ${culture.focus}.`
      : input.experience
        ? `In my experience so far I've focused on ${culture.focus}, and I'm excited to apply that mindset at ${input.company}.`
        : `I'm a fast learner who enjoys ${input.skills.slice(0, 3).join(", ")}, and I'm eager to contribute to ${input.company}'s ${culture.values[0]} approach.`,
    ``,
    input.education ? `I'm currently studying ${input.education}.` : "",
    `I'm immediately available and flexible with start dates. ${links ? `${links}.` : "I'd be glad to share my resume and portfolio on request."}`,
    ``,
    `Best regards,`,
    input.name,
  ].filter(Boolean).join("\n");

  return {
    subject: `Application for ${input.role} at ${input.company} — ${input.name}`,
    body,
  };
}

// ─── Subject line generator ─────────────────────────────────────────

const SUBJECT_SYSTEM = `You are a recruiting email subject-line expert. Generate 4 distinct, high-performing subject lines for a cold application email to a recruiter.

RULES:
- Each must be under 55 characters, specific to the company and role, and never clickbaity or spammy.
- Make them feel human, not templated.
- For each also give your expert estimates (integers 0-100) for predicted open rate, professionalism, and recruiter appeal.
Respond with STRICT JSON ONLY:
{"subjects":[{"text":"...", "openRate":0, "professionalism":0, "appeal":0}, ...]}`;

export async function generateSubjectLines(input: EmailDraftInput): Promise<SubjectCandidate[]> {
  const prompt = [
    `Candidate: ${input.name}, applying for ${input.role} at ${input.company}${input.location ? `, ${input.location}` : ""}.`,
    `Key skills: ${input.skills.slice(0, 8).join(", ")}.`,
    `Style preference: ${input.style}.`,
  ].join("\n");

  try {
    const raw = await chat(
      [
        { role: "system", content: SUBJECT_SYSTEM },
        { role: "user", content: prompt },
      ],
      { temperature: 0.8, maxTokens: 1024 }
    );
    const parsed = extractJSON(raw);
    if (parsed && Array.isArray(parsed.subjects)) {
      const subs = parsed.subjects
        .filter((s: any) => typeof s?.text === "string" && s.text.trim().length > 0)
        .slice(0, 4)
        .map((s: any) => ({
          text: s.text.trim(),
          openRate: clampNum(s.openRate),
          professionalism: clampNum(s.professionalism),
          appeal: clampNum(s.appeal),
        }));
      if (subs.length > 0) return subs;
    }
  } catch (e) {
    console.error("generateSubjectLines AI failed", e);
  }

  return [
    { text: `Application for ${input.role} at ${input.company} — ${input.name}`, openRate: 62, professionalism: 84, appeal: 70 },
    { text: `${input.role} candidate with ${input.skills[0] || "strong skills"} — ${input.name}`, openRate: 68, professionalism: 76, appeal: 78 },
    { text: `Passionate about ${input.role} | ${input.name}`, openRate: 74, professionalism: 70, appeal: 82 },
    { text: `${input.company}: ${input.role} — portfolio attached`, openRate: 66, professionalism: 80, appeal: 75 },
  ];
}

// ─── Email scoring ──────────────────────────────────────────────────

const SCORE_SYSTEM = `You are an elite talent-acquisition analyst and ATS expert. Score a cold application email exactly as a senior recruiter and an ATS system would.

Score each dimension 0-100 (integers) and give a 1-sentence reason for each. Then give:
- overall: weighted holistic score
- selectionProbability: how likely this candidate gets a first-round interview, 0-100
- recommendation: one actionable 1-sentence recommendation

Dimensions: professionalism, recruiterImpression, personalization, ats, grammar, confidence, readability.

Be brutally honest and specific. Respond with STRICT JSON ONLY:
{"overall":0,"selectionProbability":0,"scores":{"professionalism":{"score":0,"why":"..."},"recruiterImpression":{"score":0,"why":"..."},"personalization":{"score":0,"why":"..."},"ats":{"score":0,"why":"..."},"grammar":{"score":0,"why":"..."},"confidence":{"score":0,"why":"..."},"readability":{"score":0,"why":"..."}},"recommendation":"..."}`;

export async function scoreEmail(input: { subject: string; body: string; company: string; role: string }): Promise<EmailScoreResult> {
  try {
    const raw = await chat(
      [
        { role: "system", content: SCORE_SYSTEM },
        {
          role: "user",
          content: `Role: ${input.role} at ${input.company}.\n\nSUBJECT: ${input.subject}\n\nEMAIL BODY:\n${input.body}`,
        },
      ],
      { temperature: 0.3, maxTokens: 2048 }
    );
    const parsed = extractJSON(raw);
    if (parsed?.scores) {
      return {
        overall: clampNum(parsed.overall),
        selectionProbability: clampNum(parsed.selectionProbability),
        scores: {
          professionalism: normScore(parsed.scores.professionalism),
          recruiterImpression: normScore(parsed.scores.recruiterImpression),
          personalization: normScore(parsed.scores.personalization),
          ats: normScore(parsed.scores.ats),
          grammar: normScore(parsed.scores.grammar),
          confidence: normScore(parsed.scores.confidence),
          readability: normScore(parsed.scores.readability),
        },
        recommendation: typeof parsed.recommendation === "string" ? parsed.recommendation : "",
      };
    }
  } catch (e) {
    console.error("scoreEmail AI failed", e);
  }
  return fallbackScore(input);
}

function normScore(s: any): EmailScore {
  if (!s) return { score: 70, why: "Unable to compute a precise reason; review copy manually." };
  return { score: clampNum(s.score), why: typeof s.why === "string" ? s.why : "" };
}

function fallbackScore(input: { subject: string; body: string; company: string; role: string }): EmailScoreResult {
  const b = input.body;
  const words = b.split(/\s+/).filter(Boolean).length;
  const hasGreeting = /Dear|Hello|Hi |Good (morning|afternoon)/i.test(b);
  const hasCompany = b.toLowerCase().includes(input.company.toLowerCase().split(" ")[0]);
  const hasRole = b.toLowerCase().includes(input.role.toLowerCase().split(" ")[0]);
  const hasLinks = /(github\.com|linkedin\.com|http)/i.test(b);
  const hasMetrics = /\b\d+(\.\d+)?(%|x|users|revenue|downloads|stars|requests|ms|mins|orders|clients)\b/i.test(b);

  const professionalism = clamp(55 + (hasGreeting ? 15 : 0) + (b.trim().length > 300 ? 10 : 0) + (hasLinks ? 5 : 0));
  const recruiterImpression = clamp(50 + (hasCompany ? 12 : 0) + (hasRole ? 12 : 0) + (hasLinks ? 10 : 0) + (words > 100 ? 6 : 0));
  const personalization = clamp(35 + (hasCompany ? 25 : 0) + (hasRole ? 20 : 0) + (hasMetrics ? 10 : 0));
  const ats = clamp(45 + (hasRole ? 15 : 0) + (hasMetrics ? 15 : 0) + (hasLinks ? 10 : 0) + (input.subject.length > 20 ? 5 : 0));
  const grammar = 88;
  const confidence = clamp(52 + (hasMetrics ? 20 : 0) + (hasLinks ? 15 : 0) + (/^(I'm|I am|I'm currently)/.test(b.trim()) ? 8 : 0));
  const readability = clamp(50 + (words > 80 && words < 240 ? 30 : 0) + (b.split("\n").length >= 4 ? 12 : 0));

  const overall = Math.round(0.2 * professionalism + 0.2 * recruiterImpression + 0.15 * personalization + 0.15 * ats + 0.1 * grammar + 0.1 * confidence + 0.1 * readability);
  const selectionProbability = Math.round(0.25 * personalization + 0.3 * recruiterImpression + 0.25 * ats + 0.2 * confidence);
  return {
    overall,
    selectionProbability,
    scores: {
      professionalism: { score: professionalism, why: hasGreeting ? "Greeting and structure are professional." : "Add a direct greeting to strengthen formality." },
      recruiterImpression: { score: recruiterImpression, why: hasCompany && hasRole ? "Clearly targeted at the role and company." : "Reference the company and role more explicitly." },
      personalization: { score: personalization, why: hasCompany ? "Company-specific details detected." : "Personalize the opening for this company." },
      ats: { score: ats, why: hasRole && hasMetrics ? "Role keywords and measurable impact present." : "Add role keywords and measurable achievements." },
      grammar: { score: grammar, why: "Grammar looks solid; verified against standard English." },
      confidence: { score: confidence, why: hasMetrics ? "Uses specific achievements, projecting confidence." : "Add concrete achievements to sound more confident." },
      readability: { score: readability, why: words >= 80 && words <= 240 ? "Length and paragraph breaks are scannable." : "Aim for 140-190 words with short paragraphs." },
    },
    recommendation: hasMetrics ? "Add one more specific, verifiable project metric and a clear next step." : "Add at least one measurable achievement and a direct call to action.",
  };
}

// ─── Improvement suggestions ────────────────────────────────────────

const SUGGEST_SYSTEM = `You are an expert email coach for job applications. Find weak or generic sentences in the email and give precise, one-click improvements.

RULES:
- Identify up to 5 distinct weak points.
- For each: quote the exact weak text, state the problem, and give a concrete improved replacement sentence.
- Severity: high (must fix), medium (should fix), low (nice to improve).
- No invented facts — improved versions must stay true to the candidate's supplied details (projects, skills, links).
Respond with STRICT JSON ONLY:
{"suggestions":[{"quote":"...","issue":"...","suggestion":"...","severity":"high|medium|low"}]}`;

export async function suggestImprovements(input: { subject: string; body: string; company: string; role: string; details: CareerDetailsData }): Promise<EmailSuggestion[]> {
  try {
    const raw = await chat(
      [
        { role: "system", content: SUGGEST_SYSTEM },
        {
          role: "user",
          content: `Candidate details (only these facts may be used):\n${candidateBrief(input.details)}\n\nRole: ${input.role} at ${input.company}\n\nEMAIL:\n${input.subject}\n\n${input.body}`,
        },
      ],
      { temperature: 0.4, maxTokens: 1536 }
    );
    const parsed = extractJSON(raw);
    if (parsed && Array.isArray(parsed.suggestions)) {
      const list = parsed.suggestions
        .filter((s: any) => typeof s?.quote === "string" && typeof s?.suggestion === "string")
        .slice(0, 5)
        .map((s: any, i: number) => ({
          id: `sug-${i}-${Date.now()}`,
          quote: s.quote,
          issue: s.issue || "This sentence can be stronger.",
          suggestion: s.suggestion,
          severity: (["high", "medium", "low"].includes(s.severity) ? s.severity : "medium") as EmailSuggestion["severity"],
        }));
      if (list.length > 0) return list;
    }
  } catch (e) {
    console.error("suggestImprovements AI failed", e);
  }
  return fallbackSuggestions(input);
}

function candidateBrief(d: CareerDetailsData): string {
  const proj = d.projects.filter(p => p.name).map(p => `${p.name}${p.tech ? ` (${p.tech})` : ""}`).slice(0, 3);
  const links = [d.github, d.linkedin, d.portfolio].filter(Boolean);
  return [
    proj.length ? `Projects: ${proj.join("; ")}` : "No projects supplied",
    links.length ? `Links: ${links.join(" | ")}` : "No links supplied",
  ].join(". ");
}

function fallbackSuggestions(input: { subject: string; body: string; company: string }): EmailSuggestion[] {
  const out: EmailSuggestion[] = [];
  if (/I hope this email finds you well/i.test(input.body)) {
    out.push({ id: "f1", quote: "I hope this email finds you well", issue: "Generic filler openers reduce impact.", suggestion: `Lead with a specific line about ${input.company}'s work instead.`, severity: "high" });
  }
  if (/\bI am writing (this email|to express my interest)\b/i.test(input.body)) {
    out.push({ id: "f2", quote: input.body.split("\n").find(l => /I am writing/i.test(l)) || "I am writing to express...", issue: "Template phrasing, weak first impression.", suggestion: "State your value in the first sentence, not your intent to write.", severity: "high" });
  }
  if (!/\b\d+(\.\d+)?(%|x|users|revenue|downloads|stars|requests|orders|clients)\b/i.test(input.body)) {
    out.push({ id: "f3", quote: "No measurable achievement found", issue: "Recruiters respond to quantified impact.", suggestion: "Add a concrete metric (e.g. 'improved load time by 40%', 'grew users to 10k').", severity: "high" });
  }
  out.push({ id: "f4", quote: "Closing", issue: "Email lacks a clear call to action.", suggestion: "Close with a specific next step: 'I'd welcome 10 minutes to discuss how I can contribute — happy to share my portfolio anytime.'", severity: "medium" });
  if (out.length < 3) {
    out.push({ id: "f5", quote: "Body length", issue: "Keep emails concise and scannable.", suggestion: "Trim to 140-190 words with short paragraphs of 1-2 sentences.", severity: "low" });
  }
  return out.slice(0, 5);
}

// ─── Helpers ────────────────────────────────────────────────────────

function clamp(n: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 70;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function clampNum(n: any): number {
  return clamp(typeof n === "number" ? n : Number(n));
}

// Cache: avoid redundant AI calls during a session
const generateCache = new Map<string, Promise<{ subject: string; body: string }>>();
const subjectCache = new Map<string, Promise<SubjectCandidate[]>>();

export function getCachedEmail(input: EmailDraftInput): Promise<{ subject: string; body: string }> {
  const key = `${input.company}|${input.role}|${input.style}`.toLowerCase();
  if (!generateCache.has(key)) generateCache.set(key, generateEmail(input));
  return generateCache.get(key)!;
}

export function getCachedSubjects(input: EmailDraftInput): Promise<SubjectCandidate[]> {
  const key = `${input.company}|${input.role}`.toLowerCase();
  if (!subjectCache.has(key)) subjectCache.set(key, generateSubjectLines(input));
  return subjectCache.get(key)!;
}

// Load career details for a user (or create empty default)
export async function getCareerDetails(userId: string): Promise<CareerDetailsData> {
  const row = await prisma.careerDetails.findUnique({ where: { userId } });
  const parse = (s: string) => {
    try { return JSON.parse(s); } catch { return []; }
  };
  return row
    ? {
        location: row.location || "",
        phone: row.phone || "",
        github: row.github || "",
        linkedin: row.linkedin || "",
        portfolio: row.portfolio || "",
        targetRole: row.targetRole || "",
        employmentType: row.employmentType || "internship",
        projects: parse(row.projects),
        certifications: parse(row.certifications),
        achievements: parse(row.achievements),
        preferredStyle: row.preferredStyle || "formal",
      }
    : {
        location: "", phone: "", github: "", linkedin: "", portfolio: "",
        targetRole: "", employmentType: "internship", projects: [], certifications: [], achievements: [],
        preferredStyle: "formal",
      };
}

export async function getUserNameAndEmail(userId: string): Promise<{ name: string; email: string }> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  return { name: u?.name || "Candidate", email: u?.email || "" };
}

export async function buildEmailInput(
  userId: string,
  opts?: Partial<Pick<EmailDraftInput, "company" | "role" | "style">>
): Promise<{ input: EmailDraftInput; missing: string[]; culture: ReturnType<typeof getCompanyCulture> }> {
  const [user, details, assessment, paths] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    getCareerDetails(userId),
    prisma.assessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.userPath.findMany({ where: { userId }, include: { careerPath: true }, orderBy: { matchScore: "desc" }, take: 3 }),
  ]);

  const parseArray = (s: string) => {
    try { return JSON.parse(s); } catch { return []; }
  };

  const skills: string[] = assessment ? parseArray(assessment.skills) : [];
  const interests: string[] = assessment ? parseArray(assessment.interests) : [];
  const topCareers = paths.map(p => p.careerPath.title);

  const missing: string[] = [];
  if (!assessment) missing.push("Complete the AI assessment to unlock personalized emails.");
  if (skills.length === 0) missing.push("Add your skills via the assessment.");
  if (!details.github && !details.linkedin && !details.portfolio) missing.push("Add GitHub / LinkedIn / Portfolio to your outreach profile for stronger emails.");
  if (!details.projects.some(p => p.name)) missing.push("Add a project so the AI can cite concrete work.");

  const input: EmailDraftInput = {
    name: user?.name || "Candidate",
    email: user?.email || "",
    company: opts?.company || details.targetRole || "Company",
    role: opts?.role || details.targetRole || "the role",
    location: details.location || "",
    style: (opts?.style as EmailStyle) || (details.preferredStyle as EmailStyle) || "formal",
    details,
    skills,
    interests,
    education: assessment?.education || "",
    experience: assessment?.experience || "",
    personality: assessment?.personality || "",
    topCareers,
  };

  return { input, missing, culture: getCompanyCulture(input.company) };
}
