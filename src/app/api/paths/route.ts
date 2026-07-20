import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const paths = await prisma.userPath.findMany({
    where: { userId: user.id },
    include: { careerPath: true },
    orderBy: { rank: "asc" },
  });

  return NextResponse.json(paths);
}
