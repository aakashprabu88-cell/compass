import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, onboarded: true, createdAt: true },
    });

    return NextResponse.json(dbUser);
  } catch (e) {
    console.error("GET /api/auth/me", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { name } = await req.json();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/auth/me", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
