import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { COMPANY_DATABASE, searchCompanies } from "@/lib/companies";
import { enrichCompany, getCompanyLogo } from "@/lib/verify";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const industry = searchParams.get("industry") || "";
    const verify = searchParams.get("verify") === "true";

    const companies = query || industry
      ? searchCompanies(query, industry)
      : COMPANY_DATABASE;

    if (verify) {
      const enriched = await Promise.all(
        companies.map(async (company: any) => {
          const domain = company.website?.replace("https://", "").replace("http://", "").split("/")[0] || "";
          const verification = domain ? await enrichCompany(company.name, domain) : null;
          return {
            ...company,
            realLogo: domain ? getCompanyLogo(domain) : null,
            verified: verification?.isVerified || false,
            hasWebsite: verification?.hasWebsite || false,
            hasMxRecords: verification?.hasMxRecords || false,
          };
        })
      );
      return NextResponse.json(enriched);
    }

    return NextResponse.json(companies);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
