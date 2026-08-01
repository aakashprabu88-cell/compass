import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);

    if (!checkRateLimit(`register:ip:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many accounts created from this network. Try again later." }, { status: 429 });
    }

    const { email, password, name } = await req.json();

    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string" || !email || !password || !name) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (name.length > 80 || email.length > 254 || password.length < 8 || password.length > 72) {
      return NextResponse.json({ error: "Invalid name, email, or password (password must be 8–72 characters)" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    const token = await signToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    response.cookies.set("compass_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
