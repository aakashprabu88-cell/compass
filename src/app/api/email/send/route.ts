import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail, isEmailConfigured, buildProfessionalEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const emails = await prisma.sentEmail.findMany({
      where: { userId: user.id },
      orderBy: { sentAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ emails });
  } catch (e) {
    console.error("GET /api/email/send", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface Recipient {
  toEmail: string;
  toName: string;
  company: string;
  role: string;
  location: string;
  applyUrl: string;
  subject?: string;
  body?: string;
  bodyHtml?: string;
  style?: string;
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(`email-send:${user.id}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many emails sent. Try again in a minute." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const recipients: Recipient[] = Array.isArray(body.recipients) ? body.recipients : [];
    const confirmed = body.confirmed === true;
    const fromName = typeof body.fromName === "string" ? body.fromName : "";
    const fromEmail = typeof body.fromEmail === "string" ? body.fromEmail : user.email;
    const customSubject = typeof body.subject === "string" ? body.subject.trim() : "";
    const customBody = typeof body.body === "string" ? body.body : "";
    const customBodyHtml = typeof body.bodyHtml === "string" ? body.bodyHtml : "";

    if (!confirmed) {
      return NextResponse.json({ error: "Confirmation required. Set confirmed: true before sending." }, { status: 400 });
    }
    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
    }
    if (recipients.length > 50) {
      return NextResponse.json({ error: "Too many recipients (max 50 per batch)" }, { status: 400 });
    }
    if (!isEmailConfigured()) {
      return NextResponse.json({
        error: "Email sending is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optional SMTP_FROM) to .env to enable automatic sending.",
        needsSetup: true,
      }, { status: 400 });
    }

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const userPaths = await prisma.userPath.findMany({
      where: { userId: user.id },
      include: { careerPath: true },
      orderBy: { matchScore: "desc" },
      take: 3,
    });

    const profile = {
      name: fromName || user.name,
      email: fromEmail,
      skills: assessment ? JSON.parse(assessment.skills || "[]") : [],
      interests: assessment ? JSON.parse(assessment.interests || "[]") : [],
      education: assessment?.education || "",
      experience: assessment?.experience || "",
      personality: assessment?.personality || "",
      topCareers: userPaths.map(up => up.careerPath.title),
    };

    const sent: Array<{ company: string; toEmail: string; ok: boolean; error?: string }> = [];
    let okCount = 0;

    for (const r of recipients) {
      const built = buildProfessionalEmail({
        profile,
        company: r.company,
        role: r.role,
        location: r.location,
      });
      const subject = r.subject || customSubject || built.subject;
      const body = r.body || customBody || built.body;
      const bodyHtml = r.bodyHtml || customBodyHtml || "";

      const result = await sendEmail({
        to: r.toEmail,
        subject,
        body,
      });

      await prisma.sentEmail.create({
        data: {
          userId: user.id,
          toEmail: r.toEmail,
          toName: r.toName || r.company,
          company: r.company,
          role: r.role,
          subject,
          body,
          bodyHtml,
          style: r.style || "formal",
          status: result.success ? "sent" : "failed",
        },
      });

      if (result.success) okCount++;
      sent.push({ company: r.company, toEmail: r.toEmail, ok: result.success, error: result.error });
    }

    return NextResponse.json({ sent: okCount, failed: sent.length - okCount, details: sent });
  } catch (e: any) {
    console.error("POST /api/email/send", e);
    return NextResponse.json({ error: e?.message || "Failed to send emails" }, { status: 500 });
  }
}
