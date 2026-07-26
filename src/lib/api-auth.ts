import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function requireAuth(req: NextRequest) {
  const token = req.cookies.get("compass_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
