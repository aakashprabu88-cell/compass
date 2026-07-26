import { NextResponse } from "next/server";
import { enrichCompany } from "@/lib/verify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: "Provide a company name" }, { status: 400 });
    const result = await enrichCompany(body.name, body.domain);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
