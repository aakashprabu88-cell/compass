import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const gaps = await prisma.skillGap.findMany({
      where: { userId: user.id },
      orderBy: { gap: "desc" },
    });

    return NextResponse.json(gaps);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
