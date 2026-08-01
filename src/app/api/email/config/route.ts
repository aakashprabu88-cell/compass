import { NextResponse } from "next/server";
import { getEmailConfigStatus } from "@/lib/email";

export async function GET() {
  const status = getEmailConfigStatus();
  return NextResponse.json({
    ...status,
    provider: status.host?.includes("gmail") ? "gmail" : status.host ? "smtp" : null,
  });
}
