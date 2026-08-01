import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/api-auth";
import { getCareerDetails } from "@/lib/email-ai";

const DEFAULT_DETAILS = {
  location: "", phone: "", github: "", linkedin: "", portfolio: "",
  targetRole: "", employmentType: "internship",
  projects: [], certifications: [], achievements: [], preferredStyle: "formal",
};

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const details = await getCareerDetails(user.id);
  return NextResponse.json({ details, isComplete: Boolean(details.github || details.linkedin || details.portfolio) || details.projects.length > 0 });
}

export async function PUT(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const d = body.details || {};

  const projects = Array.isArray(d.projects) ? d.projects.map((p: any) => ({
    name: String(p?.name || "").trim(),
    tech: String(p?.tech || "").trim(),
    description: String(p?.description || "").trim(),
    link: String(p?.link || "").trim(),
  })).filter((p: { name: string }) => !!p.name) : [];

  const certifications = Array.isArray(d.certifications) ? d.certifications.map((c: any) => ({
    name: String(c?.name || "").trim(),
    issuer: String(c?.issuer || "").trim(),
    year: String(c?.year || "").trim(),
  })).filter((c: { name: string }) => !!c.name) : [];

  const achievements = Array.isArray(d.achievements) ? d.achievements.map((a: any) => String(a).trim()).filter(Boolean) : [];

  const sanitized = {
    location: String(d.location || "").slice(0, 120),
    phone: String(d.phone || "").slice(0, 30),
    github: String(d.github || "").slice(0, 300),
    linkedin: String(d.linkedin || "").slice(0, 300),
    portfolio: String(d.portfolio || "").slice(0, 300),
    targetRole: String(d.targetRole || "").slice(0, 160),
    employmentType: d.employmentType === "fulltime" ? "fulltime" : "internship",
    projects: JSON.stringify(projects),
    certifications: JSON.stringify(certifications),
    achievements: JSON.stringify(achievements),
    preferredStyle: ["formal", "friendly", "technical", "startup", "executive"].includes(d.preferredStyle) ? d.preferredStyle : "formal",
  };

  await prisma.careerDetails.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...sanitized },
    update: sanitized,
  });

  return NextResponse.json({ ok: true, details: await getCareerDetails(user.id) });
}
