import nodemailer from "nodemailer";

export interface EmailProfile {
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  education: string;
  experience: string;
  personality: string;
  topCareers: string[];
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getEmailConfigStatus(): {
  configured: boolean;
  host?: string;
  fromEmail?: string;
} {
  return {
    configured: isEmailConfigured(),
    host: process.env.SMTP_HOST || undefined,
    fromEmail: process.env.SMTP_FROM || undefined,
  };
}

async function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  body: string;
  html?: string;
  from?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    return { success: false, error: "SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env" };
  }

  const transport = await getTransport();
  const from = opts.from || process.env.SMTP_FROM || `Compass <${process.env.SMTP_USER}>`;

  try {
    await transport.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.body,
      ...(opts.html ? { html: opts.html } : {}),
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || "Failed to send email" };
  }
}

// Make contentEditable output email-client-safe: strip editor-only attributes and
// Tailwind classes, then add minimal inline styles that render in Gmail/Outlook.
export function sanitizeEmailHtml(raw: string): string {
  let html = (raw || "").trim();
  if (!html) return "";
  html = html.replace(/\s+(contenteditable|spellcheck|autocorrect|autocapitalize|data-[a-z0-9-]+|role|aria-[a-z-]+)="[^"]*"/gi, "");
  html = html.replace(/\s+(contenteditable|spellcheck|autocorrect|autocapitalize)(?=\s|>)/gi, "");
  html = html.replace(/\s+class="[^"]*"/gi, "");
  html = html.replace(/<div(?![^>]*style=)/gi, '<div style="margin:0 0 12px"');
  html = html.replace(/<p(?![^>]*style=)/gi, '<p style="margin:0 0 12px"');
  html = html.replace(/<li(?![^>]*style=)/gi, '<li style="margin:0 0 6px"');
  return `<div style="font-family:Segoe UI,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#1f2937">${html}</div>`;
}

const BLACKLISTED_COMPANIES = new Set([
  "unknown", "confidential", "recruiter", "not available", "na", "private",
  "anonymous", "staffing", "manpower", "randstad", "teamlease", "quess", "ibm client innovation",
  "adzuna", "peak hire solutions", "peak hire", "betterhire", "hr services", "hirecraft",
]);

const STAFFING_PATTERN = /(^|\s)(staff|recruit|hiring|hire|manpower|outsourc|talent|consult|temps?|workforce)\w*/i;
const GENERIC_PATTERN = /(^|\s)(solutions|services|consultancy|consultants|agency|enterprises?|technologies?)\s*$/i;

export function isRealCompany(name: string): boolean {
  const n = (name || "").trim().toLowerCase();
  if (!n || n.length < 2) return false;
  if (BLACKLISTED_COMPANIES.has(n)) return false;
  if (STAFFING_PATTERN.test(n)) return false;
  if (GENERIC_PATTERN.test(n) && n.length < 20) return false;
  if (/^[^a-z0-9]*$/.test(n)) return false;
  return true;
}

export interface CompanyContact {
  company: string;
  domain: string;
  toEmail: string;
  role: string;
  location: string;
  applyUrl: string;
  source: string;
  isDerived: boolean;
}

function normalizeCompanyName(name: string): string {
  return (name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export function deriveDomain(company: string, applyUrl: string): string {
  const fallback = normalizeCompanyName(company) || "company";
  try {
    if (applyUrl && applyUrl !== "#") {
      const host = new URL(applyUrl).hostname;
      if (host.toLowerCase().includes("adzuna")) {
        return `${fallback}.com`;
      }
      const parts = host.split(".");
      if (parts.length >= 2) {
        if (/^(www|jobs|careers|in|india|api)\.$/i.test(parts[0] + ".")) {
          return parts.slice(1).join(".");
        }
        return parts.slice(0, 2).join(".");
      }
    }
  } catch {}
  return `${fallback}.com`;
}

export function deriveCompanyContact(raw: {
  company: string;
  role: string;
  location: string;
  applyUrl: string;
}): CompanyContact | null {
  if (!isRealCompany(raw.company)) return null;
  const domain = deriveDomain(raw.company, raw.applyUrl);
  return {
    company: raw.company.trim(),
    domain,
    toEmail: `careers@${domain}`,
    role: raw.role || "internship",
    location: raw.location || "",
    applyUrl: raw.applyUrl || "",
    source: "adzuna",
    isDerived: true,
  };
}

function firstTruthy(values: string[]): string {
  return values.find(v => v && v.trim().length > 1)?.trim() || "";
}

export function buildProfessionalEmail(input: {
  profile: EmailProfile;
  company: string;
  role: string;
  location?: string;
}): { subject: string; body: string } {
  const { profile, company, role, location } = input;
  const name = firstTruthy([profile.name, "I"]);
  const firstName = name.split(" ")[0] || name;
  const skills = (profile.skills || []).filter(s => s && s.trim().length > 1);
  const topSkills = skills.slice(0, 4);
  const education = firstTruthy([profile.education]);
  const experience = firstTruthy([profile.experience]);
  const career = firstTruthy([profile.topCareers?.[0]]);
  const interest = firstTruthy([profile.interests?.[0]]);

  const subject = `Application: ${role} at ${company} — ${name}`;

  const lines: string[] = [];
  lines.push(`Dear Hiring Manager,`);
  lines.push("");
  lines.push(`I am writing to express my strong interest in the ${role} position${location ? ` at your ${location} team` : ""} at ${company}. ${career ? `As someone focused on a career in ${career}, ` : ""}I believe this opportunity is an ideal match for my skills and ambitions.`);
  lines.push("");

  if (topSkills.length > 0) {
    lines.push(`I bring hands-on experience with ${topSkills.slice(0, 3).join(", ")}${topSkills.length > 3 ? `, and ${topSkills[3]}` : ""}. ${education ? `My background in ${education} ` : "My coursework and personal projects "}have given me both the technical foundation and the discipline to contribute from day one.`);
  } else if (education) {
    lines.push(`My background in ${education} has given me a strong technical foundation, and I am eager to apply what I have learned to real problems at ${company}.`);
  } else {
    lines.push(`I am a motivated learner who thrives on building things, and I am eager to bring that energy to ${company}.`);
  }
  lines.push("");

  const evidence = firstTruthy([
    experience ? `I have ${experience} of hands-on experience` : "",
    interest ? `I am deeply interested in ${interest}` : "",
    "I am known for quickly learning new tools and delivering quality work",
  ]);
  lines.push(`${evidence}. I enjoy working in fast-paced, collaborative environments and am comfortable taking ownership of tasks from start to finish.`);
  lines.push("");

  lines.push(`I have attached my resume for your consideration and would welcome the opportunity to discuss how I can contribute to ${company}'s goals. I am available for an interview at your earliest convenience.`);
  lines.push("");
  lines.push(`Thank you for your time and consideration.`);
  lines.push("");
  lines.push(`Best regards,`);
  lines.push(name);
  if (profile.email) lines.push(profile.email);

  return { subject, body: lines.join("\n") };
}
