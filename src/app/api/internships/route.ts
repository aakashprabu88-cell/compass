import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const domain = searchParams.get("domain") || "";
    const workMode = searchParams.get("workMode") || "";
    const type = searchParams.get("type") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const company = searchParams.get("company") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sort") || "match";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (domain) where.domain = { contains: domain, mode: "insensitive" };
    if (workMode) where.workMode = workMode;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (company) where.company = { contains: company, mode: "insensitive" };
    if (category) where.category = category;

    const internships = await prisma.internship.findMany({
      where,
      orderBy: sortBy === "stipend" ? { stipendMax: "desc" } :
               sortBy === "deadline" ? { deadline: "asc" } :
               sortBy === "rating" ? { companyRating: "desc" } :
               { createdAt: "desc" },
      take: 50,
    });

    // Get user's saved/applied statuses
    const userApps = await prisma.userInternship.findMany({
      where: { userId: user.id },
      select: { internshipId: true, status: true, matchScore: true },
    });
    const appMap = new Map(userApps.map(a => [a.internshipId, { status: a.status, matchScore: a.matchScore }]));

    const enriched = internships.map(i => ({
      ...i,
      userStatus: appMap.get(i.id)?.status || null,
      userMatchScore: appMap.get(i.id)?.matchScore || null,
    }));

    return NextResponse.json(enriched);
  } catch (e) {
    console.error("GET /api/internships", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { internshipId, status } = await request.json();
    if (!internshipId) return NextResponse.json({ error: "internshipId required" }, { status: 400 });

    const existing = await prisma.userInternship.findUnique({
      where: { userId_internshipId: { userId: user.id, internshipId } },
    });

    if (existing) {
      const updated = await prisma.userInternship.update({
        where: { id: existing.id },
        data: { status: status || "applied", ...(status === "applied" ? { appliedAt: new Date() } : {}) },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.userInternship.create({
      data: {
        userId: user.id,
        internshipId,
        status: status || "saved",
        ...(status === "applied" ? { appliedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/internships", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
