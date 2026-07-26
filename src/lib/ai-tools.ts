import { JobListing } from "./jobs";

// === ATS Score ===
export function calculateATS(userSkills: string[], userExp: string, job: JobListing): { score: number; breakdown: { category: string; score: number; max: number; detail: string }[]; tips: string[] } {
  const jobSkillsLower = job.requiredSkills.map(s => s.toLowerCase());
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const matched = (jobRequired: string) => userSkillsLower.some(us => us.includes(jobRequired) || jobRequired.includes(us));

  const skillMatch = jobSkillsLower.filter(js => matched(js)).length;
  const skillScore = Math.round((skillMatch / Math.max(jobSkillsLower.length, 1)) * 40);

  const expYears = parseInt(userExp) || 0;
  const needed = job.experience.includes("5") ? 5 : job.experience.includes("3") ? 3 : job.experience.includes("2") ? 2 : 0;
  const expScore = expYears >= needed ? 20 : Math.round((expYears / Math.max(needed, 1)) * 20);

  const descText = job.description.toLowerCase();
  const descMatches = userSkillsLower.filter(s => descText.includes(s)).length;
  const descScore = Math.round((descMatches / Math.max(userSkillsLower.length, 1)) * 20);

  const hasRelevantEducation = job.education.toLowerCase().includes("any") || true;
  const eduScore = hasRelevantEducation ? 10 : 5;

  const freshnessBonus = job.postedDaysAgo <= 3 ? 10 : job.postedDaysAgo <= 7 ? 5 : 0;
  const urgentBonus = job.urgent ? 5 : 0;
  const otherScore = Math.min(freshnessBonus + urgentBonus, 10);

  const score = Math.min(skillScore + expScore + descScore + eduScore + otherScore, 100);

  const tips: string[] = [];
  if (skillScore < 30) tips.push(`Add these skills to your resume: ${job.requiredSkills.filter(s => !matched(s.toLowerCase())).join(", ")}`);
  if (expScore < 15) tips.push(`Highlight relevant experience — this role needs ${job.experience}`);
  if (score < 50) tips.push(`Tailor your resume keywords to match the job description`);
  if (score >= 70) tips.push(`Strong match — apply immediately, this job fits your profile well`);
  if (job.urgent) tips.push(`Urgent hiring — mention your availability for immediate start`);
  tips.push(`Use the exact job title "${job.title}" in your resume summary`);

  return {
    score,
    breakdown: [
      { category: "Skills Match", score: skillScore, max: 40, detail: `${skillMatch}/${jobSkillsLower.length} required skills matched` },
      { category: "Experience", score: expScore, max: 20, detail: `${expYears} years vs ${job.experience} needed` },
      { category: "Keyword Match", score: descScore, max: 20, detail: `${descMatches} keywords found in your profile` },
      { category: "Education", score: eduScore, max: 10, detail: `Education requirement: ${job.education}` },
      { category: "Timing", score: otherScore, max: 10, detail: job.postedDaysAgo <= 3 ? "Recently posted — apply now!" : `Posted ${job.postedDaysAgo} days ago` },
    ],
    tips,
  };
}

// === Interview Questions from JD ===
export function generateInterviewQuestions(job: JobListing, userSkills: string[]): { category: string; questions: { q: string; ideal: string; tip: string }[] }[] {
  const categories: { category: string; questions: { q: string; ideal: string; tip: string }[] }[] = [];

  const techQuestions: { q: string; ideal: string; tip: string }[] = [];
  job.requiredSkills.forEach(skill => {
    techQuestions.push({
      q: `Describe your experience with ${skill}. How have you used it in past projects?`,
      ideal: `Strong answers reference specific projects, quantify impact (e.g., "improved performance by 30%"), and mention challenges overcome.`,
      tip: userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? "This is in your skills — give a concrete example" : "Consider learning this before the interview",
    });
  });
  if (techQuestions.length > 0) categories.push({ category: "Technical / Skills", questions: techQuestions.slice(0, 5) });

  categories.push({
    category: "Behavioral",
    questions: [
      { q: `Tell me about a time you had to work under pressure to meet a deadline.`, ideal: `Use STAR method: Situation, Task, Action, Result. Quantify outcomes.`, tip: "Prepare 3 STAR stories before the interview" },
      { q: `How do you handle disagreements with teammates?`, ideal: `Show empathy, communication skills, and focus on outcomes over being right.`, tip: "Give a real example where you resolved a conflict" },
      { q: `Why do you want to work at ${job.company}?`, ideal: `Reference specific company values, products, or recent achievements. Show genuine interest.`, tip: `Research ${job.company}'s recent news and mission statement` },
    ],
  });

  categories.push({
    category: "Role-Specific",
    questions: [
      { q: `How would you approach your first 90 days in this ${job.title} role?`, ideal: `Mention learning the codebase/team, quick wins, then long-term improvements.`, tip: "Show you've thought about the role, not just the company" },
      { q: `What's the biggest challenge you see in ${job.industries[0] || "this industry"} right now?`, ideal: `Demonstrate industry knowledge with current trends and data points.`, tip: `Read up on ${job.industries[0] || "the industry"} trends this week` },
      { q: `Describe a project you're most proud of. What made it successful?`, ideal: `Be specific about YOUR contribution, the technical decisions, and measurable results.`, tip: "Pick a project that relates to this role's requirements" },
    ],
  });

  return categories;
}

// === Salary Prediction ===
const SALARY_RANGES: Record<string, { min: number; max: number; median: number }> = {
  "software engineer": { min: 4, max: 25, median: 8 },
  "data scientist": { min: 6, max: 30, median: 12 },
  "devops engineer": { min: 6, max: 25, median: 11 },
  "product manager": { min: 8, max: 35, median: 15 },
  "ui/ux designer": { min: 4, max: 18, median: 8 },
  "cybersecurity analyst": { min: 5, max: 20, median: 9 },
  "cloud architect": { min: 10, max: 40, median: 18 },
  "ai/ml engineer": { min: 8, max: 35, median: 15 },
  "business analyst": { min: 4, max: 15, median: 7 },
  "project manager": { min: 6, max: 22, median: 10 },
  "financial analyst": { min: 4, max: 15, median: 7 },
  "full stack developer": { min: 5, max: 22, median: 10 },
  "default": { min: 3, max: 15, median: 6 },
};

const CITY_MULTIPLIER: Record<string, number> = {
  "chennai": 1.0, "coimbatore": 0.9, "madurai": 0.8, "bangalore": 1.3,
  "hyderabad": 1.15, "pune": 1.2, "mumbai": 1.35, "delhi": 1.25,
  "noida": 1.2, "gurgaon": 1.3, "remote": 1.1, "default": 1.0,
};

export function predictSalary(job: JobListing, expYears: number): { predicted: { min: number; max: number; median: number }; confidence: string; tips: string[] } {
  const titleKey = Object.keys(SALARY_RANGES).find(k => job.title.toLowerCase().includes(k)) || "default";
  const base = SALARY_RANGES[titleKey];
  const cityKey = job.city?.toLowerCase() || "default";
  const multiplier = CITY_MULTIPLIER[cityKey] || CITY_MULTIPLIER["default"];

  const expMultiplier = expYears >= 5 ? 1.8 : expYears >= 3 ? 1.3 : expYears >= 1 ? 1.0 : 0.7;

  const min = Math.round(base.min * multiplier * expMultiplier);
  const max = Math.round(base.max * multiplier * expMultiplier);
  const median = Math.round(base.median * multiplier * expMultiplier);

  const confidence = job.salaryMin > 0 && job.salaryMax > 0 ? "high (from job listing)" : "medium (predicted from role/location)";

  const actualMin = job.salaryMin > 0 ? job.salaryMin : min;
  const actualMax = job.salaryMax > 0 ? job.salaryMax : max;
  const actualMedian = Math.round((actualMin + actualMax) / 2);

  const tips = [
    `Salary range for ${job.title} in ${job.city || "this location"}: ₹${actualMin}–${actualMax} LPA`,
    `Aim for ₹${actualMedian} LPA as your target — it's at the midpoint`,
    expYears < 2 ? "With less experience, focus on learning opportunities and growth over base salary" : "Leverage your experience to negotiate at the higher end",
    `At ${job.company}, negotiate 10–15% above the offered amount — most companies have room`,
    "Always negotiate. 73% of employers expect it and most offers have room for 10–20% more",
    "If salary is fixed, negotiate for benefits: remote work, learning budget, extra leave, signing bonus",
  ];

  return { predicted: { min: actualMin, max: actualMax, median: actualMedian }, confidence, tips };
}

// === Mock Interview ===
export interface MockQuestion { id: string; question: string; type: "technical" | "behavioral" | "situational" | "role_specific"; difficulty: "easy" | "medium" | "hard"; category: string; expectedPoints: string[]; idealAnswerLength: number; }
export interface MockFeedback { score: number; breakdown: { label: string; score: number; max: number }[]; strengths: string[]; improvements: string[]; suggestedAnswer: string; }

const TECHNICAL_BANK: Omit<MockQuestion, "id">[] = [
  { question: "Explain the difference between SQL and NoSQL databases. When would you use each?", type: "technical", difficulty: "easy", category: "databases", expectedPoints: ["sql is relational with fixed schema", "nosql is flexible/document-based", "sql for complex queries and joins", "nosql for scale and unstructured data"], idealAnswerLength: 120 },
  { question: "How does HTTP differ from HTTPS? What happens during a TLS handshake?", type: "technical", difficulty: "medium", category: "web", expectedPoints: ["https adds encryption via tls", "certificate verification", "symmetric key exchange", "protects data in transit"], idealAnswerLength: 150 },
  { question: "Explain REST API design principles. What makes an API well-designed?", type: "technical", difficulty: "medium", category: "apis", expectedPoints: ["stateless requests", "proper http methods get post put delete", "consistent url structure", "meaningful status codes"], idealAnswerLength: 150 },
  { question: "What is the difference between a stack and a queue? Give a real-world use case for each.", type: "technical", difficulty: "easy", category: "data_structures", expectedPoints: ["stack is lifo last in first out", "queue is fifo first in first out", "stack for undo or function calls", "queue for task scheduling or bfs"], idealAnswerLength: 100 },
  { question: "Explain what a race condition is and how you would prevent it in a web application.", type: "technical", difficulty: "hard", category: "concurrency", expectedPoints: ["two processes accessing shared state", "leads to unpredictable results", "prevention via locks or mutex", "database transactions and idempotency"], idealAnswerLength: 150 },
  { question: "What is the difference between authentication and authorization? How do JWT tokens work?", type: "technical", difficulty: "medium", category: "security", expectedPoints: ["authentication verifies identity", "authorization grants permissions", "jwt contains encoded claims", "signed with secret key"], idealAnswerLength: 130 },
  { question: "Explain how you would design a URL shortener like bit.ly. What are the key components?", type: "technical", difficulty: "hard", category: "system_design", expectedPoints: ["unique short code generation", "database mapping short to long url", "redirect handling with caching", "analytics and click tracking"], idealAnswerLength: 200 },
  { question: "What is the difference between optimistic and pessimistic concurrency control?", type: "technical", difficulty: "hard", category: "databases", expectedPoints: ["optimistic assumes no conflicts", "pessimistic locks resources upfront", "optimistic uses version numbers", "choose based on conflict frequency"], idealAnswerLength: 130 },
  { question: "Explain the concept of dependency injection. Why is it useful in large applications?", type: "technical", difficulty: "medium", category: "architecture", expectedPoints: ["passing dependencies rather than creating", "loose coupling between components", "easier testing and mocking", "follows inversion of control principle"], idealAnswerLength: 120 },
  { question: "What is a microservices architecture? What are its advantages and challenges?", type: "technical", difficulty: "hard", category: "system_design", expectedPoints: ["small independent services", "communicate via api or message queue", "independent deployment and scaling", "challenges include data consistency and latency"], idealAnswerLength: 170 },
  { question: "How does garbage collection work in Java or Python? What are generational collections?", type: "technical", difficulty: "hard", category: "programming", expectedPoints: ["automatic memory management", "mark and sweep or reference counting", "generational divides objects by age", "young generation collected more frequently"], idealAnswerLength: 150 },
  { question: "Explain what CSS specificity is. How do you resolve conflicts when multiple rules apply?", type: "technical", difficulty: "easy", category: "web", expectedPoints: ["specificity determines which rule wins", "inline > id > class > element", "!important overrides everything", "use specificity calculator or restructure"], idealAnswerLength: 100 },
  { question: "What is a closure in JavaScript? Give a practical example.", type: "technical", difficulty: "medium", category: "programming", expectedPoints: ["function that remembers its outer scope", "accesses variables after outer function returns", "useful for data privacy and callbacks", "example like counter or event handler"], idealAnswerLength: 110 },
  { question: "How would you optimize a slow database query? Walk through your approach.", type: "technical", difficulty: "medium", category: "databases", expectedPoints: ["explain plan to identify bottlenecks", "add proper indexes", "avoid select star and n plus one", "consider denormalization for reads"], idealAnswerLength: 140 },
  { question: "Explain the CAP theorem. What tradeoffs does it describe?", type: "technical", difficulty: "hard", category: "system_design", expectedPoints: ["consistency availability partition tolerance", "can only guarantee two of three", "network partitions are inevitable", "choose based on application needs"], idealAnswerLength: 120 },
  { question: "What is the difference between horizontal and vertical scaling? When would you choose each?", type: "technical", difficulty: "medium", category: "architecture", expectedPoints: ["vertical adds resources to one machine", "horizontal adds more machines", "vertical simpler but has limits", "horizontal better for high availability"], idealAnswerLength: 110 },
  { question: "Explain how React's virtual DOM works. Why is it faster than direct DOM manipulation?", type: "technical", difficulty: "medium", category: "web", expectedPoints: ["virtual dom is lightweight copy", "diffing algorithm compares changes", "batched updates minimize reflows", "only affected nodes are re-rendered"], idealAnswerLength: 130 },
  { question: "What is a deadlock? How do you prevent it in a multi-threaded application?", type: "technical", difficulty: "hard", category: "concurrency", expectedPoints: ["two threads waiting for each other", "four conditions mutual exclusion hold wait", "prevention via lock ordering or timeouts", "detect and recover or avoid altogether"], idealAnswerLength: 150 },
  { question: "Explain the difference between TCP and UDP. When would you use each?", type: "technical", difficulty: "easy", category: "networking", expectedPoints: ["tcp is reliable ordered delivery", "udp is fast but no guarantee", "tcp for http files and email", "udp for video streaming and gaming"], idealAnswerLength: 100 },
  { question: "How do you handle errors in a production application? Describe your error handling strategy.", type: "technical", difficulty: "medium", category: "architecture", expectedPoints: ["try catch at appropriate boundaries", "logging with context and stack traces", "user friendly error messages", "monitoring and alerting on errors"], idealAnswerLength: 140 },
];

const BEHAVIORAL_BANK: Omit<MockQuestion, "id">[] = [
  { question: "Tell me about a time you had to work under extreme pressure to meet a deadline. What did you do?", type: "behavioral", difficulty: "medium", category: "pressure", expectedPoints: ["specific situation with clear deadline", "actions you took to prioritize", "how you communicated with team", "result and what you learned"], idealAnswerLength: 150 },
  { question: "Describe a situation where you had a conflict with a teammate. How did you resolve it?", type: "behavioral", difficulty: "medium", category: "conflict", expectedPoints: ["understood the other perspective", "communicated directly and respectfully", "found a compromise or solution", "maintained the working relationship"], idealAnswerLength: 150 },
  { question: "Tell me about a project that failed or didn't go as planned. What happened and what did you learn?", type: "behavioral", difficulty: "hard", category: "failure", expectedPoints: ["honest about what went wrong", "took responsibility rather than blaming", "extracted specific lessons", "described how you applied those lessons"], idealAnswerLength: 170 },
  { question: "Give an example of when you had to learn something completely new in a short time. How did you approach it?", type: "behavioral", difficulty: "medium", category: "learning", expectedPoints: ["clear learning strategy", "used multiple resources", "practiced hands-on", "applied it to deliver results"], idealAnswerLength: 140 },
  { question: "Tell me about a time you went above and beyond what was expected of you.", type: "behavioral", difficulty: "easy", category: "initiative", expectedPoints: ["identified opportunity without being asked", "took extra steps to add value", "quantified the impact", "received recognition or positive outcome"], idealAnswerLength: 140 },
  { question: "Describe a time you had to give someone difficult feedback. How did you handle it?", type: "behavioral", difficulty: "hard", category: "communication", expectedPoints: ["was direct but empathetic", "focused on behavior not personality", "offered constructive suggestions", "result showed improvement"], idealAnswerLength: 140 },
  { question: "Tell me about a time you led a team or took charge of a situation without being asked.", type: "behavioral", difficulty: "medium", category: "leadership", expectedPoints: ["stepped up when needed", "organized people and resources", "made decisions under uncertainty", "achieved a positive outcome"], idealAnswerLength: 150 },
  { question: "Give an example of when you had to manage competing priorities. How did you decide what to focus on?", type: "behavioral", difficulty: "medium", category: "time_management", expectedPoints: ["assessed urgency and impact", "communicated trade-offs clearly", "delegated or postponed lower priority items", "delivered on the most important tasks"], idealAnswerLength: 140 },
  { question: "Tell me about a time you received critical feedback. How did you respond?", type: "behavioral", difficulty: "medium", category: "growth", expectedPoints: ["listened without being defensive", "reflected on the feedback honestly", "took concrete action to improve", "followed up to show progress"], idealAnswerLength: 130 },
  { question: "Describe a time you had to persuade someone to see things your way.", type: "behavioral", difficulty: "hard", category: "influence", expectedPoints: ["understood their concerns first", "presented data or evidence", "adapted your approach to their perspective", "reached agreement or alignment"], idealAnswerLength: 150 },
  { question: "Tell me about a time you made a decision with incomplete information. What was the outcome?", type: "behavioral", difficulty: "hard", category: "decision_making", expectedPoints: ["assessed available information quickly", "identified risks and mitigations", "made a clear decision and committed", "adjusted course when new info appeared"], idealAnswerLength: 150 },
  { question: "Give an example of when you worked with a diverse team. What did you learn?", type: "behavioral", difficulty: "easy", category: "teamwork", expectedPoints: ["valued different perspectives", "adapted communication style", "leveraged diverse strengths", "achieved better outcomes through collaboration"], idealAnswerLength: 130 },
  { question: "Tell me about a time you identified a problem before it became critical. What did you do?", type: "behavioral", difficulty: "medium", category: "initiative", expectedPoints: ["noticed early warning signs", "investigated the root cause", "proposed and implemented a fix", "prevented larger impact"], idealAnswerLength: 140 },
  { question: "Describe a time you had to adapt to a significant change at work or in a project.", type: "behavioral", difficulty: "medium", category: "adaptability", expectedPoints: ["acknowledged the change positively", "adjusted your approach quickly", "helped others adapt", "found opportunities in the change"], idealAnswerLength: 140 },
  { question: "Tell me about your greatest professional achievement. Why was it meaningful to you?", type: "behavioral", difficulty: "easy", category: "achievement", expectedPoints: ["clear description of the achievement", "your specific role and contribution", "measurable impact or outcome", "personal significance and growth"], idealAnswerLength: 150 },
];

const SITUATIONAL_BANK: Omit<MockQuestion, "id">[] = [
  { question: "If you joined a team and discovered the codebase had no tests and frequent bugs, what would you do?", type: "situational", difficulty: "medium", category: "quality", expectedPoints: ["assess the most critical areas first", "start with tests for high-risk paths", "advocate for testing culture gradually", "balance quick wins with long-term improvement"], idealAnswerLength: 140 },
  { question: "Your manager asks you to deliver a feature in a week, but you know it will take at least two. How do you handle this?", type: "situational", difficulty: "hard", category: "expectations", expectedPoints: ["communicate honestly with timeline", "break down the work to show scope", "propose alternatives or mvp", "negotiate realistic expectations"], idealAnswerLength: 140 },
  { question: "You realize midway through a project that the requirements are fundamentally wrong. What do you do?", type: "situational", difficulty: "hard", category: "problem_solving", expectedPoints: ["stop and assess the impact", "communicate to stakeholders immediately", "propose a revised approach", "document lessons learned"], idealAnswerLength: 140 },
  { question: "A junior developer on your team is struggling and afraid to ask for help. How would you approach this?", type: "situational", difficulty: "medium", category: "mentoring", expectedPoints: ["approach them with empathy", "create a safe space for questions", "pair program or share resources", "build their confidence over time"], idealAnswerLength: 130 },
  { question: "You're given a task you have never done before and no one else knows how to do it either. What's your approach?", type: "situational", difficulty: "medium", category: "problem_solving", expectedPoints: ["break the problem into smaller parts", "research documentation and examples", "experiment in a safe environment", "ask for help from broader community"], idealAnswerLength: 130 },
  { question: "You notice a senior colleague made a significant mistake in production code. How do you handle it?", type: "situational", difficulty: "hard", category: "communication", expectedPoints: ["prioritize fixing the issue first", "communicate privately and respectfully", "focus on the code not the person", "suggest process improvements to prevent recurrence"], idealAnswerLength: 140 },
  { question: "If you had to choose between meeting a deadline and shipping quality code, which would you choose and why?", type: "situational", difficulty: "medium", category: "tradeoffs", expectedPoints: ["neither extreme is ideal", "communicate trade-offs to stakeholders", "find a middle ground like mvp", "quality usually wins long term"], idealAnswerLength: 130 },
  { question: "Your team is adopting a new technology you personally believe is the wrong choice. How do you handle it?", type: "situational", difficulty: "hard", category: "teamwork", expectedPoints: ["voice your concerns with evidence", "respect the team's decision", "support the decision once made", "monitor and suggest adjustments"], idealAnswerLength: 140 },
  { question: "You have two important tasks due today and you can only finish one on time. How do you decide?", type: "situational", difficulty: "easy", category: "time_management", expectedPoints: ["assess impact and urgency of each", "communicate with stakeholders", "negotiate deadlines if possible", "deliver the highest impact task first"], idealAnswerLength: 120 },
  { question: "You're in a meeting where the team is debating two approaches. Neither is clearly better. How do you help decide?", type: "situational", difficulty: "medium", category: "decision_making", expectedPoints: ["summarize both approaches clearly", "identify decision criteria", "suggest a timeboxed evaluation", "build consensus rather than dictate"], idealAnswerLength: 130 },
];

const ROLE_SPECIFIC_BANK: Omit<MockQuestion, "id">[] = [
  { question: "Why do you want to work at this company specifically? What attracts you to our mission?", type: "role_specific", difficulty: "easy", category: "motivation", expectedPoints: ["specific knowledge about the company", "alignment with company values", "genuine enthusiasm not generic", "how your goals connect to theirs"], idealAnswerLength: 130 },
  { question: "Where do you see yourself in five years? How does this role fit into that vision?", type: "role_specific", difficulty: "medium", category: "career_goals", expectedPoints: ["realistic growth trajectory", "shows ambition within the company", "connecting role to long-term goals", "demonstrates commitment"], idealAnswerLength: 120 },
  { question: "What would you aim to accomplish in your first 90 days in this role?", type: "role_specific", difficulty: "medium", category: "onboarding", expectedPoints: ["listen and learn first", "build relationships with team", "identify quick wins", "contribute meaningfully by month three"], idealAnswerLength: 140 },
  { question: "What are your biggest strengths and how would they help you in this role?", type: "role_specific", difficulty: "easy", category: "self_awareness", expectedPoints: ["specific strengths not generic", "connected to role requirements", "backed by evidence or examples", "self-aware and honest"], idealAnswerLength: 120 },
  { question: "What is a weakness you are actively working to improve? How are you addressing it?", type: "role_specific", difficulty: "medium", category: "self_awareness", expectedPoints: ["genuine weakness not a disguised strength", "concrete improvement steps taken", "shows self-awareness and growth mindset", "progress made so far"], idealAnswerLength: 130 },
  { question: "How do you stay updated with industry trends and continue learning?", type: "role_specific", difficulty: "easy", category: "growth", expectedPoints: ["specific learning habits or routines", "mix of reading courses and practice", "applied learning to real projects", "stays curious and proactive"], idealAnswerLength: 110 },
  { question: "Describe your ideal work environment. What helps you do your best work?", type: "role_specific", difficulty: "easy", category: "culture_fit", expectedPoints: ["honest about preferences", "aligns with the company culture", "mentions collaboration or autonomy", "shows self-awareness"], idealAnswerLength: 110 },
  { question: "Tell me about a time you failed in a professional setting. What did you learn from it?", type: "role_specific", difficulty: "medium", category: "resilience", expectedPoints: ["honest about the failure", "took ownership of the outcome", "extracted specific lessons", "demonstrated growth afterward"], idealAnswerLength: 150 },
  { question: "How do you handle ambiguity when project requirements are unclear?", type: "role_specific", difficulty: "medium", category: "adaptability", expectedPoints: ["ask clarifying questions early", "make reasonable assumptions and document", "deliver incrementally for feedback", "stay flexible as requirements evolve"], idealAnswerLength: 130 },
  { question: "What questions do you have for us about the role or company?", type: "role_specific", difficulty: "easy", category: "engagement", expectedPoints: ["thoughtful questions about the role", "asks about team and culture", "questions about growth opportunities", "shows genuine curiosity and research"], idealAnswerLength: 80 },
  { question: "If we hired you and after six months you felt this role wasn't the right fit, what would you do?", type: "role_specific", difficulty: "hard", category: "integrity", expectedPoints: ["would communicate openly first", "explore internal adjustments", "consider what specifically doesn't fit", "prioritize honest dialogue"], idealAnswerLength: 120 },
  { question: "What unique perspective or value would you bring to our team that others might not?", type: "role_specific", difficulty: "medium", category: "differentiation", expectedPoints: ["specific unique skill or experience", "different way of thinking or approaching", "concrete example of unique contribution", "not just technical but also personal"], idealAnswerLength: 130 },
  { question: "How do you handle receiving ambiguous or incomplete instructions from a manager?", type: "role_specific", difficulty: "medium", category: "communication", expectedPoints: ["proactively seek clarification", "use judgment to fill gaps wisely", "communicate assumptions made", "deliver and iterate based on feedback"], idealAnswerLength: 120 },
  { question: "Tell me about a time you had to balance multiple stakeholders with different priorities.", type: "role_specific", difficulty: "hard", category: "stakeholder_mgmt", expectedPoints: ["understood each stakeholder needs", "prioritized based on impact", "communicated trade-offs clearly", "delivered on the most critical items"], idealAnswerLength: 150 },
  { question: "What motivates you to do your best work every day?", type: "role_specific", difficulty: "easy", category: "motivation", expectedPoints: ["genuine internal motivation", "connection to meaningful work", "desire to learn and grow", "enjoyment of collaboration"], idealAnswerLength: 100 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function generateMockQuestions(job: JobListing, userSkills: string[]): MockQuestion[] {
  const questions: MockQuestion[] = [];
  let id = 1;

  // 3 technical questions matching job skills
  const jobSkillsLower = job.requiredSkills.map(s => s.toLowerCase());
  const skillTechQuestions = TECHNICAL_BANK.filter(q =>
    jobSkillsLower.some(s => q.category.includes(s) || q.question.toLowerCase().includes(s))
  );
  const genericTech = shuffleArray(TECHNICAL_BANK).filter(q => !skillTechQuestions.includes(q));
  const techPool = [...shuffleArray(skillTechQuestions), ...shuffleArray(genericTech)];
  for (const q of techPool.slice(0, 3)) {
    questions.push({ ...q, id: `q${id++}` });
  }

  // 2 behavioral
  const behavPool = shuffleArray(BEHAVIORAL_BANK);
  for (const q of behavPool.slice(0, 2)) {
    questions.push({ ...q, id: `q${id++}` });
  }

  // 1 situational
  const sitPool = shuffleArray(SITUATIONAL_BANK);
  questions.push({ ...sitPool[0], id: `q${id++}` });

  // 2 role-specific
  const rolePool = shuffleArray(ROLE_SPECIFIC_BANK);
  for (const q of rolePool.slice(0, 2)) {
    questions.push({ ...q, id: `q${id++}` });
  }

  return questions;
}

export function evaluateAnswer(question: MockQuestion, answer: string): MockFeedback {
  const text = answer.toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const breakdown: { label: string; score: number; max: number }[] = [];

  // 1. Answer length (0-20)
  let lengthScore = 0;
  if (wordCount >= question.idealAnswerLength) lengthScore = 20;
  else if (wordCount >= question.idealAnswerLength * 0.7) lengthScore = 15;
  else if (wordCount >= question.idealAnswerLength * 0.4) lengthScore = 10;
  else if (wordCount >= 15) lengthScore = 5;
  breakdown.push({ label: "Answer Depth", score: lengthScore, max: 20 });

  // 2. STAR method for behavioral/situational (0-20)
  let starScore = 0;
  if (question.type === "behavioral" || question.type === "situational") {
    const starWords = ["when", "situation", "task", "i had to", "then", "result", "outcome", "because of this", "as a result"];
    const starHits = starWords.filter(w => text.includes(w)).length;
    starScore = Math.min(Math.round((starHits / 5) * 20), 20);
  } else {
    // For technical: structural indicators
    const structWords = ["first", "second", "also", "additionally", "for example", "such as", "specifically", "for instance"];
    const structHits = structWords.filter(w => text.includes(w)).length;
    starScore = Math.min(Math.round((structHits / 3) * 20), 20);
  }
  breakdown.push({ label: question.type === "behavioral" || question.type === "situational" ? "STAR Method" : "Structure", score: starScore, max: 20 });

  // 3. Expected points coverage (0-25)
  let pointHits = 0;
  for (const point of question.expectedPoints) {
    const pointWords = point.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (pointWords.some(pw => text.includes(pw))) pointHits++;
  }
  const pointScore = Math.round((pointHits / Math.max(question.expectedPoints.length, 1)) * 25);
  breakdown.push({ label: "Key Points", score: pointScore, max: 25 });

  // 4. Quantified impact (0-15)
  let quantScore = 0;
  const hasNumbers = /\d+/.test(answer);
  const hasPercent = /\d+%/.test(answer);
  const hasMetrics = text.includes("increased") || text.includes("reduced") || text.includes("improved") || text.includes("saved") || text.includes("achieved") || text.includes("delivered");
  if (hasNumbers) quantScore += 7;
  if (hasPercent) quantScore += 4;
  if (hasMetrics) quantScore += 4;
  quantScore = Math.min(quantScore, 15);
  breakdown.push({ label: "Quantified Impact", score: quantScore, max: 15 });

  // 5. Specific examples + personal ownership (0-20)
  let exampleScore = 0;
  const exampleWords = ["project", "example", "built", "led", "designed", "implemented", "shipped", "launched", "managed", "created"];
  const exampleHits = exampleWords.filter(w => text.includes(w)).length;
  exampleScore += Math.min(exampleHits * 3, 10);
  const ownershipWords = ["i ", "i was", "i led", "i built", "i decided", "i proposed", "i implemented", "my role"];
  const ownershipHits = ownershipWords.filter(w => text.includes(w)).length;
  exampleScore += Math.min(ownershipHits * 2, 10);
  exampleScore = Math.min(exampleScore, 20);
  breakdown.push({ label: "Specificity & Ownership", score: exampleScore, max: 20 });

  const totalScore = Math.min(breakdown.reduce((s, b) => s + b.score, 0), 100);

  // Generate strengths
  const strengths: string[] = [];
  if (lengthScore >= 15) strengths.push("Detailed and thorough response");
  else if (lengthScore >= 10) strengths.push("Good level of detail");
  if (starScore >= 15) strengths.push(question.type === "behavioral" || question.type === "situational" ? "Excellent use of STAR method" : "Well-structured answer");
  if (pointHits >= question.expectedPoints.length * 0.7) strengths.push("Covered most key points effectively");
  if (quantScore >= 10) strengths.push("Good use of numbers and metrics to quantify impact");
  if (exampleScore >= 15) strengths.push("Strong specific examples with personal ownership");
  else if (exampleScore >= 8) strengths.push("Showed relevant experience with examples");

  // Generate improvements
  const improvements: string[] = [];
  if (lengthScore < 10) improvements.push(`Aim for a more detailed response (target ${question.idealAnswerLength}+ words)`);
  if (starScore < 10) improvements.push(question.type === "behavioral" || question.type === "situational" ? "Use the STAR method: set the Situation, describe the Task, explain your Action, share the Result" : "Improve structure: use transitions like first, additionally, for example");
  if (pointHits < question.expectedPoints.length * 0.5) improvements.push("Address more key aspects of the question");
  if (quantScore < 7) improvements.push("Add specific numbers, percentages, or metrics to demonstrate impact");
  if (exampleScore < 8) improvements.push("Include a concrete project or example from your experience");
  if (wordCount < 20) improvements.push("Provide a more substantive answer — short responses miss key points");

  // Suggested answer
  const suggestedAnswer = question.type === "behavioral" || question.type === "situational"
    ? `Structure your answer using STAR: Describe the Situation and Task clearly. Explain the specific Action YOU took (use "I" statements). Share the measurable Result and what you learned. Key points to include: ${question.expectedPoints.slice(0, 2).join("; ")}.`
    : `Start with a clear definition or explanation. Then provide specific details and examples. Key aspects to cover: ${question.expectedPoints.slice(0, 2).join("; ")}. Use concrete technical details.`;

  return {
    score: totalScore,
    breakdown,
    strengths: strengths.length > 0 ? strengths : ["Good effort — keep practicing to improve"],
    improvements: improvements.length > 0 ? improvements : ["Solid answer — try adding more specific examples"],
    suggestedAnswer,
  };
}

// === Resume Customization ===
export function customizeResumeForJob(userProfile: { name: string; skills: string[]; experience: string; education: string }, job: JobListing): { summary: string; highlightedSkills: string[]; experienceTweaks: string[]; keywords: string[] } {
  const matchedSkills = job.requiredSkills.filter(rs =>
    userProfile.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(s.toLowerCase()))
  );
  const missingSkills = job.requiredSkills.filter(rs =>
    !userProfile.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(s.toLowerCase()))
  );

  return {
    summary: `Results-driven ${job.title} with expertise in ${matchedSkills.slice(0, 3).join(" and ") || "relevant technologies"}. ${userProfile.experience || "Entry-level professional"} seeking to contribute to ${job.company}'s team in ${job.location}.`,
    highlightedSkills: matchedSkills,
    experienceTweaks: [
      `Reframe projects to emphasize ${job.requiredSkills[0] || "relevant"} experience`,
      `Quantify achievements: "Reduced load time by 40%", "Deployed to 10K+ users"`,
      `Add ${missingSkills.slice(0, 2).join(" and ")} if you have any exposure to them`,
      `Use the exact title "${job.title}" in your resume heading`,
    ],
    keywords: job.requiredSkills,
  };
}
