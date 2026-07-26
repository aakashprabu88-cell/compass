import { JobListing } from "./jobs";

interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  experience: string;
  education: string;
  personality: Record<string, string>;
  topCareers: string[];
}

function getMatchedSkills(userSkills: string[], jobSkills: string[]): string[] {
  return jobSkills.filter(js =>
    userSkills.some(us => us.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(us.toLowerCase()))
  );
}

function getExperienceYears(experience: string): number | null {
  const match = experience.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getOpeningLine(career: string): string {
  const lines: Record<string, string> = {
    "AI/Machine Learning Engineer": "I am excited to apply for this AI/ML Engineer position, bringing my passion for building intelligent systems that solve real-world problems.",
    "Software Engineer": "I am writing to express my strong interest in this Software Engineer role, where I can contribute to building robust, scalable applications.",
    "Data Scientist": "I am eager to bring my analytical mindset and data-driven approach to this Data Scientist position.",
    "UX/UI Designer": "I am thrilled to apply for this UX/UI Designer role, where my user-centered design philosophy aligns perfectly with creating impactful digital experiences.",
    "Product Manager": "I am excited about this Product Manager opportunity, combining my strategic thinking with a deep understanding of user needs.",
    "Cybersecurity Analyst": "I am passionate about protecting digital assets and am eager to contribute to this Cybersecurity Analyst role.",
    "Cybersecurity Engineer": "I am excited to bring my security architecture skills to this Cybersecurity Engineer position, building defenses against evolving threats.",
    "Digital Marketing Specialist": "I am eager to leverage my digital marketing expertise to drive growth and engagement in this specialist role.",
    "Financial Analyst": "I am writing to express my interest in this Financial Analyst position, where I can apply my analytical skills to drive informed business decisions.",
    "Healthcare Provider": "I am deeply committed to patient care and am excited about this Healthcare Provider opportunity.",
    "Teacher/Educator": "I am passionate about education and eager to inspire the next generation in this Teaching role.",
    "Research Scientist": "I am excited to contribute to advancing knowledge in this Research Scientist position.",
    "Project Manager": "I am eager to bring my organizational leadership and project delivery expertise to this Project Manager role.",
    "Content Creator": "I am excited to bring my creative vision and storytelling abilities to this Content Creator role.",
  };
  return lines[career] || `I am excited to apply for this position and confident that my skills and experience make me a strong candidate.`;
}

// ─── 8 unique email templates ───────────────────────────────────────
// Each template has a different structure, tone, and paragraph flow.
// The system randomly picks one per job so no two emails look the same.

function templateSkillsFirst(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const skillList = matched.length > 0 ? matched.slice(0, 3).join(", ") : user.skills.slice(0, 3).join(", ");
  const body: string[] = [];
  body.push(`The ${job.title} role at ${job.company} caught my attention because it directly aligns with my background in ${skillList}.`);
  if (years !== null && years > 0) {
    body.push(`I have spent ${years} year${years !== 1 ? "s" : ""} working with these technologies${user.education ? `, complemented by my ${user.education} education` : ""}, and I am confident I can contribute meaningfully from the start.`);
  } else if (user.education) {
    body.push(`As a ${user.education} graduate, I have built a solid foundation in these areas and am eager to apply them in a professional setting.`);
  } else {
    body.push(`I have been actively developing these skills through projects and self-directed learning, and I am ready to bring that energy to your team.`);
  }
  body.push(`I would love to discuss how my skills can help ${job.company} achieve its goals. I am available at your convenience for a conversation.`);
  return body.join("\n\n");
}

function templateCompanyFirst(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  body.push(`${job.company} stands out to me as a place where I can make a real impact, and the ${job.title} position is exactly the kind of challenge I am looking for.`);
  if (matched.length > 0) {
    body.push(`My experience with ${matched.slice(0, 2).join(" and ")}${matched.length > 2 ? ` and ${matched[matched.length - 1]}` : ""} maps directly to what this role requires.`);
  } else {
    body.push(`While my background is in ${user.skills.slice(0, 2).join(" and ")}, I am a fast learner and am confident I can pick up the specific tools your team uses.`);
  }
  if (years !== null && years > 0) {
    body.push(`Over ${years} year${years !== 1 ? "s" : ""} of hands-on work have taught me how to deliver results under tight deadlines while maintaining quality.`);
  }
  body.push(`I appreciate your time in reviewing my application and would welcome the chance to connect.`);
  return body.join("\n\n");
}

function templateExperienceFirst(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  if (years !== null && years > 0) {
    body.push(`With ${years}+ year${years !== 1 ? "s" : ""} of experience${user.education ? ` and a ${user.education} background` : ""}, I have developed the skills needed to thrive as a ${job.title} at ${job.company}.`);
  } else {
    body.push(`As an early-career professional${user.education ? ` with a ${user.education} degree` : ""}, I bring fresh perspectives and a strong desire to learn and grow.`);
  }
  if (matched.length > 0) {
    body.push(`Specifically, my proficiency in ${matched.slice(0, 3).join(", ")} gives me a strong foundation for this role.`);
  } else {
    body.push(`My core skills in ${user.skills.slice(0, 3).join(", ")} translate well to the requirements of this position.`);
  }
  body.push(`I am drawn to ${job.company}'s work${job.location ? ` in ${job.location}` : ""} and would be thrilled to contribute to your team. Please let me know if you would like to discuss my fit further.`);
  return body.join("\n\n");
}

function templateConcise(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  body.push(`I am applying for the ${job.title} position at ${job.company}.`);
  const skillMention = matched.length > 0 ? matched.slice(0, 2).join(" and ") : user.skills.slice(0, 2).join(" and ");
  if (years !== null && years > 0) {
    body.push(`${years}+ years working with ${skillMention} — ready to contribute from day one.`);
  } else {
    body.push(`Strong foundation in ${skillMention}${user.education ? `, backed by my ${user.education}` : ""}.`);
  }
  body.push(`I would appreciate the opportunity to speak with you about this role. Thank you for your consideration.`);
  return body.join("\n\n");
}

function templatePassionFirst(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  const passion = user.interests.length > 0 ? user.interests[0].toLowerCase() : "technology";
  body.push(`I have always been drawn to ${passion}, and the ${job.title} role at ${job.company} feels like a natural next step in my career.`);
  if (matched.length > 0) {
    body.push(`My hands-on experience with ${matched.slice(0, 3).join(", ")} has prepared me well for the demands of this position.`);
  } else {
    body.push(`While I am still building experience in some of the specific tools listed, my foundation in ${user.skills.slice(0, 2).join(" and ")} gives me the ability to ramp up quickly.`);
  }
  if (years !== null && years > 0) {
    body.push(`Over the past ${years} year${years !== 1 ? "s" : ""}, I have consistently delivered quality work in collaborative environments.`);
  } else if (user.education) {
    body.push(`My ${user.education} background has equipped me with both the theoretical knowledge and the discipline to succeed in this role.`);
  }
  body.push(`I would love the chance to discuss how my passion and skills can benefit ${job.company}. Thank you for your time.`);
  return body.join("\n\n");
}

function templateProblemSolver(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  body.push(`When I saw the ${job.title} opening at ${job.company}, I knew I had to reach out. This is the kind of problem-solving role I thrive in.`);
  if (matched.length > 0) {
    body.push(`I bring practical experience in ${matched.slice(0, 3).join(", ")}, which I have used to${years && years > 0 ? ` deliver results over ${years} year${years !== 1 ? "s" : ""}` : " complete meaningful projects"}.`);
  } else {
    body.push(`My background in ${user.skills.slice(0, 3).join(", ")} has given me a versatile toolkit that I am eager to apply here.`);
  }
  body.push(`${job.company}'s focus on${job.description ? " " + (job.description.split(".")[0]?.toLowerCase() || "innovation") : " delivering quality products"} resonates with me, and I am motivated to contribute to that mission.`);
  body.push(`I am available to discuss this opportunity at your convenience. Thank you for considering my application.`);
  return body.join("\n\n");
}

function templateDirect(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  body.push(`I am writing to express my interest in the ${job.title} position at ${job.company}${job.location ? ` (${job.location})` : ""}.`);
  if (matched.length > 0) {
    body.push(`My experience in ${matched.slice(0, 3).join(", ")} aligns well with your requirements.`);
  } else {
    body.push(`My skills in ${user.skills.slice(0, 3).join(", ")} provide a strong base for this role.`);
  }
  if (years !== null && years > 0) {
    body.push(`I have ${years} year${years !== 1 ? "s" : ""} of professional experience${user.education ? ` and a ${user.education} degree` : ""}, and I am confident I can add value to your team quickly.`);
  } else if (user.education) {
    body.push(`As a recent ${user.education} graduate, I bring energy, fresh ideas, and a willingness to learn.`);
  }
  body.push(`I look forward to the possibility of contributing to ${job.company}. Please feel free to reach out if you would like to discuss my application further.`);
  return body.join("\n\n");
}

function templateStoryTeller(user: UserProfile, job: JobListing, matched: string[], years: number | null): string {
  const body: string[] = [];
  const skill = matched.length > 0 ? matched[0] : user.skills[0] || "technology";
  body.push(`A few${years && years > 0 ? ` ${years}` : ""} year${years !== 1 ? "s" : ""} ago, I discovered my passion for ${skill} — and it has shaped my career direction ever since.`);
  body.push(`The ${job.title} role at ${job.company} is exactly the kind of opportunity where I can put that passion to work. ${matched.length > 0 ? `With my experience in ${matched.slice(0, 2).join(" and ")}, I am well-prepared to contribute.` : `My foundation in ${user.skills.slice(0, 2).join(" and ")} gives me the tools to succeed here.`}`);
  if (user.education) {
    body.push(`My ${user.education} background has given me the analytical framework to approach challenges methodically.`);
  }
  body.push(`I would welcome the opportunity to be part of ${job.company}'s team. Thank you for your time and consideration.`);
  return body.join("\n\n");
}

const TEMPLATES = [
  templateSkillsFirst,
  templateCompanyFirst,
  templateExperienceFirst,
  templateConcise,
  templatePassionFirst,
  templateProblemSolver,
  templateDirect,
  templateStoryTeller,
];

// ─── Cover letter (unchanged structure) ─────────────────────────────

function buildCoverLetterBody(user: UserProfile, job: JobListing & { matchScore?: number }): string {
  const matchedSkills = getMatchedSkills(user.skills, job.requiredSkills || []);
  const years = getExperienceYears(user.experience);

  const parts: string[] = [];

  const openingBase = getOpeningLine(job.title);
  if (matchedSkills.length > 0) {
    parts.push(`${openingBase} With my experience in ${matchedSkills.slice(0, 4).join(", ")}${matchedSkills.length > 4 ? ", among others" : ""}, I am confident I can make an immediate impact at ${job.company}.`);
  } else {
    parts.push(`${openingBase} My foundational skills in ${user.skills.slice(0, 3).join(", ")} give me a strong starting point to grow rapidly in this role.`);
  }

  const bodyParts: string[] = [];
  if (years !== null && years > 0) {
    bodyParts.push(`With ${years} year${years !== 1 ? "s" : ""} of hands-on experience, I have developed a deep understanding of the technical and collaborative demands of modern software development`);
  } else {
    bodyParts.push("I am a motivated professional eager to grow");
  }
  if (user.education) {
    bodyParts.push(`My academic background in ${user.education} has provided me with a solid theoretical foundation that complements my practical skills`);
  }
  if (bodyParts.length > 0) {
    parts.push(`${bodyParts.join(". ")}. At ${job.company}, I am particularly drawn to${job.description ? " the focus on " + (job.description.split(".")[0] || "innovative solutions") : " your mission to deliver impactful products"}, and I am eager to contribute my skills to advance these goals.`);
  }

  if (job.matchScore) {
    const pct = Math.round(job.matchScore * 100);
    if (pct >= 80) {
      parts.push(`With a ${pct}% profile match, I believe this role aligns closely with my career trajectory and strengths.`);
    } else if (pct >= 60) {
      parts.push(`My ${pct}% compatibility score reflects a strong alignment, and I am motivated to bridge any remaining skill gaps quickly.`);
    }
  }

  parts.push(`I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${job.company}'s continued success. I am available for an interview at your convenience and look forward to the possibility of joining your team.`);

  return parts.join("\n\n");
}

export function generateCoverLetter(
  user: UserProfile,
  job: JobListing & { matchScore?: number }
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const body = buildCoverLetterBody(user, job);

  return `Date: ${date}

Dear Hiring Manager,

${body}

Sincerely,
${user.name}

---
Skills: ${user.skills.slice(0, 5).join(", ")}
Education: ${user.education || "Not specified"}
Experience: ${user.experience || "Entry-level"}`;
}

// ─── Email draft — 8 unique templates, randomly selected ─────────────

export function generateEmailDraft(
  user: UserProfile,
  job: JobListing & { matchScore?: number }
): string {
  const matched = getMatchedSkills(user.skills, job.requiredSkills || []);
  const years = getExperienceYears(user.experience);

  // Pick a random template
  const template = pick(TEMPLATES);
  const body = template(user, job, matched, years);

  const greetings = ["Dear Hiring Manager,", "Hi there,", "Hello,", "Dear Team,"];
  const signoffs = ["Best regards,", "Thank you,", "Sincerely,", "Kind regards,"];

  return `Subject: Application for ${job.title} at ${job.company}

${pick(greetings)}

${body}

${pick(signoffs)}
${user.name}
${user.email}`;
}

export function generateBulkCoverLetters(
  user: UserProfile,
  jobs: (JobListing & { matchScore: number })[]
): Array<{ job: JobListing; coverLetter: string; emailDraft: string; matchScore: number }> {
  return jobs.map(job => ({
    job,
    coverLetter: generateCoverLetter(user, job),
    emailDraft: generateEmailDraft(user, job),
    matchScore: job.matchScore,
  }));
}
