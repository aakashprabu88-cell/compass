import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apps = await prisma.userInternship.findMany({
      where: { userId: user.id },
      include: { internship: true },
      orderBy: { createdAt: "desc" },
    });

    const pipeline = {
      saved: apps.filter(a => a.status === "saved"),
      applied: apps.filter(a => a.status === "applied"),
      shortlisted: apps.filter(a => a.status === "shortlisted"),
      assessment: apps.filter(a => a.status === "assessment"),
      interview: apps.filter(a => a.status === "interview"),
      rejected: apps.filter(a => a.status === "rejected"),
      offer: apps.filter(a => a.status === "offer"),
      accepted: apps.filter(a => a.status === "accepted"),
    };

    const stats = {
      total: apps.length,
      applied: apps.filter(a => ["applied", "shortlisted", "assessment", "interview"].includes(a.status)).length,
      interviewRate: apps.length > 0 ? Math.round(apps.filter(a => ["interview", "offer", "accepted"].includes(a.status)).length / apps.length * 100) : 0,
      offerRate: apps.length > 0 ? Math.round(apps.filter(a => ["offer", "accepted"].includes(a.status)).length / apps.length * 100) : 0,
    };

    return NextResponse.json({ pipeline, stats });
  } catch (e) {
    console.error("GET /api/internships/tracker", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
