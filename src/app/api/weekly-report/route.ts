import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreateWeeklyReport } from "@/lib/weekly-report";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const report = await getOrCreateWeeklyReport(user.id);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
