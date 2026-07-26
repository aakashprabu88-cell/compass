import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchJobs } from "@/lib/jobs";
import { parseJsonArray } from "@/lib/careers";
import { generateCoverLetter, generateEmailDraft } from "@/lib/cover-letters";
import { verifyEmail } from "@/lib/verify";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const applications = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobId, autoApply, applicantEmail, emailContent } = await request.json();

    // Get user's resume
    const resume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!resume && !autoApply) {
      return NextResponse.json({ error: "Upload a resume first" }, { status: 400 });
    }

    // Get assessment for matching
    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (autoApply) {
      // Auto-apply to all matching jobs
      const userSkills = resume
        ? [...parseJsonArray(resume.extractedSkills), ...(assessment ? parseJsonArray(assessment.skills) : [])]
        : assessment ? parseJsonArray(assessment.skills) : [];
      const userInterests = assessment ? parseJsonArray(assessment.interests) : [];

      const userPaths = await prisma.userPath.findMany({
        where: { userId: user.id },
        include: { careerPath: true },
        orderBy: { matchScore: "desc" },
        take: 5,
      });

      const topTitles = userPaths.map(up => up.careerPath.title);
      const matchedJobs = matchJobs(userSkills, userInterests, topTitles);

      // Apply to top matching jobs (score > 3)
      const topJobs = matchedJobs.filter(j => j.matchScore > 3).slice(0, 15);

      // Generate cover letters and email drafts
      const userProfile = {
        name: user.name,
        email: user.email,
        skills: userSkills,
        interests: userInterests,
        experience: resume?.experience || "",
        education: resume?.education || assessment?.education || "",
        personality: assessment ? JSON.parse(assessment.personality || "{}") : {},
        topCareers: topTitles,
      };

      const applications = [];
      for (const job of topJobs) {
        const existing = await prisma.jobApplication.findFirst({
          where: { userId: user.id, jobId: job.id },
        });
        if (existing) continue;

        const coverLetter = generateCoverLetter(userProfile, job);
        const emailDraft = generateEmailDraft(userProfile, job);

        const app = await prisma.jobApplication.create({
          data: {
            userId: user.id,
            resumeId: resume?.id || null,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            status: "applied",
            autoApplied: true,
            coverLetter,
            emailDraft,
            matchScore: job.matchScore,
          },
        });
        applications.push(app);
      }

      return NextResponse.json({
        success: true,
        applied: applications.length,
        jobs: topJobs.map(j => ({
          title: j.title,
          company: j.company,
          location: j.location,
          matchScore: j.matchScore,
          applyUrl: j.applyUrl,
        })),
      });
    } else {
      // Apply to a single job
      const existing = await prisma.jobApplication.findFirst({
        where: { userId: user.id, jobId },
      });

      if (existing) {
        return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });
      }

      // Email verification for single job applications
      let emailVerification = null;
      if (applicantEmail && typeof applicantEmail === "string") {
        emailVerification = await verifyEmail(applicantEmail);
        if (emailVerification.trustScore === "suspicious") {
          return NextResponse.json({
            error: "Email verification failed",
            verification: emailVerification,
          }, { status: 400 });
        }
      }

      // Get job details from database
      const { JOB_DATABASE } = await import("@/lib/jobs");
      const job = JOB_DATABASE.find(j => j.id === jobId);

      const userProfile = {
        name: user.name,
        email: user.email,
        skills: resume ? parseJsonArray(resume.extractedSkills) : [],
        interests: assessment ? parseJsonArray(assessment.interests) : [],
        experience: resume?.experience || "",
        education: resume?.education || assessment?.education || "",
        personality: assessment ? JSON.parse(assessment.personality || "{}") : [],
        topCareers: [],
      };

      const coverLetter = job ? generateCoverLetter(userProfile, job) : "";
      const finalEmailDraft = (typeof emailContent === "string" && emailContent.trim())
        ? emailContent.trim()
        : (job ? generateEmailDraft(userProfile, job) : "");

      const application = await prisma.jobApplication.create({
        data: {
          userId: user.id,
          resumeId: resume?.id || null,
          jobId,
          jobTitle: job?.title || "Custom Job",
          company: job?.company || "Company",
          location: job?.location || "Tamil Nadu",
          status: "applied",
          autoApplied: false,
          coverLetter,
          emailDraft: finalEmailDraft,
          matchScore: job ? (job as any).matchScore || 0 : 0,
          notes: emailVerification
            ? `Email verification: trust=${emailVerification.trustScore} | ${emailVerification.message}`
            : "",
        },
      });

      return NextResponse.json({
        success: true,
        application,
        emailVerification: emailVerification || undefined,
        warning: emailVerification && ["low", "medium"].includes(emailVerification.trustScore)
          ? emailVerification.message
          : undefined,
      });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, status, notes } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updated = await prisma.jobApplication.update({
      where: { id, userId: user.id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.jobApplication.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
