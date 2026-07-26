import { NextResponse } from "next/server";
import { verifyEmail } from "@/lib/verify";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const result = await verifyEmail(email);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
