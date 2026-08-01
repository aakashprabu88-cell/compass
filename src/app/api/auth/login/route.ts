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

    if (!checkRateLimit(`login:ip:${ip}`, 10, 5 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!checkRateLimit(`login:email:${email.toLowerCase()}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, onboarded: user.onboarded },
    });
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
