const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
  "yopmail.com", "10minutemail.com", "trashmail.com", "fakeinbox.com",
  "sharklasers.com", "dispostable.com", "maildrop.cc", "temp-mail.org",
  "tempail.com", "tempr.email", "mohmal.com", "burnermail.io", "tmail.ws",
]);

const FREE_EMAIL_PROVIDERS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "protonmail.com", "proton.me", "zoho.com", "icloud.com", "mail.com",
  "rediffmail.com", "ymail.com", "live.com", "msn.com", "gmx.com",
]);

export interface EmailVerificationResult {
  email: string; domain: string; isValidFormat: boolean;
  isDisposable: boolean; isFreeProvider: boolean;
  domainExists: boolean; hasMxRecords: boolean;
  trustScore: "high" | "medium" | "low" | "suspicious";
  message: string;
}

async function checkMxRecords(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return (data.Answer || []).some((a: any) => a.type === 15);
  } catch { return false; }
}

async function checkDomainExists(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return (data.Answer || []).some((a: any) => a.type === 1);
  } catch { return false; }
}

export async function verifyEmail(email: string): Promise<EmailVerificationResult> {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  const isFreeProvider = FREE_EMAIL_PROVIDERS.has(domain);

  let domainExists = false;
  let hasMxRecords = false;
  if (isValidFormat && domain) {
    [domainExists, hasMxRecords] = await Promise.all([checkDomainExists(domain), checkMxRecords(domain)]);
  }

  let trustScore: EmailVerificationResult["trustScore"] = "high";
  let message = "";
  if (!isValidFormat) { trustScore = "suspicious"; message = "Invalid email format"; }
  else if (isDisposable) { trustScore = "suspicious"; message = "Disposable/temporary email — companies won't accept this."; }
  else if (!domainExists) { trustScore = "suspicious"; message = "Email domain does not exist."; }
  else if (!hasMxRecords) { trustScore = "low"; message = "Domain cannot receive emails (no MX records)."; }
  else if (isFreeProvider) { trustScore = "medium"; message = "Free email provider — use a professional/company email for applications."; }
  else { trustScore = "high"; message = "Email domain verified and can receive emails."; }

  return { email, domain, isValidFormat, isDisposable, isFreeProvider, domainExists, hasMxRecords, trustScore, message };
}

// === Company Verification ===

export interface CompanyVerification {
  name: string; domain: string; logo: string; website: string;
  isVerified: boolean; hasWebsite: boolean; hasMxRecords: boolean;
  industry: string; size: string; founded: number | null; description: string;
  socialLinks: { linkedin?: string };
}

export function getCompanyLogo(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

const KNOWN_COMPANIES: Record<string, { industry: string; size: string; founded: number | null; description: string }> = {
  "tcs.com": { industry: "IT Services", size: "500,000+", founded: 1968, description: "Tata Consultancy Services — India's largest IT services company" },
  "infosys.com": { industry: "IT Services", size: "300,000+", founded: 1981, description: "Global leader in next-generation digital services and consulting" },
  "zoho.com": { industry: "Software", size: "15,000+", founded: 1996, description: "Suite of online productivity tools and SaaS applications" },
  "freshworks.com": { industry: "Software", size: "5,000+", founded: 2010, description: "Cloud-based business software for customer service and IT" },
  "hcltech.com": { industry: "IT Services", size: "200,000+", founded: 1976, description: "Global technology company" },
  "cognizant.com": { industry: "IT Services", size: "350,000+", founded: 1994, description: "Professional services company transforming business" },
  "wipro.com": { industry: "IT Services", size: "230,000+", founded: 1945, description: "Multinational IT services company" },
  "apollohospitals.com": { industry: "Healthcare", size: "50,000+", founded: 1983, description: "Asia's largest and most trusted healthcare group" },
  "ltimindtree.com": { industry: "IT Services", size: "80,000+", founded: 1997, description: "Global technology consulting and digital solutions company" },
  "bosch.co.in": { industry: "Manufacturing", size: "40,000+", founded: 1886, description: "Global supplier of technology and services" },
  "google.com": { industry: "Technology", size: "180,000+", founded: 1998, description: "Multinational technology company" },
  "microsoft.com": { industry: "Technology", size: "220,000+", founded: 1975, description: "Multinational technology corporation" },
  "apple.com": { industry: "Technology", size: "160,000+", founded: 1976, description: "Multinational technology company" },
  "amazon.com": { industry: "E-Commerce", size: "1,500,000+", founded: 1994, description: "Multinational technology and e-commerce company" },
  "flipkart.com": { industry: "E-Commerce", size: "12,000+", founded: 2007, description: "India's leading e-commerce marketplace" },
  "razorpay.com": { industry: "Fintech", size: "5,000+", founded: 2014, description: "Full-stack financial services company" },
  "swiggy.com": { industry: "Food Tech", size: "6,000+", founded: 2014, description: "On-demand delivery platform" },
  "linkedin.com": { industry: "Technology", size: "20,000+", founded: 2003, description: "Business and employment-focused social media platform" },
  "ibm.com": { industry: "Technology", size: "280,000+", founded: 1911, description: "Multinational technology corporation" },
  "deloitte.com": { industry: "Consulting", size: "400,000+", founded: 1845, description: "Multinational professional services network" },
  "sail.co.in": { industry: "Manufacturing", size: "60,000+", founded: 1973, description: "Steel Authority of India Limited" },
  "tatamotors.com": { industry: "Automotive", size: "70,000+", founded: 1945, description: "Multinational automotive manufacturing company" },
  "toyota.com": { industry: "Automotive", size: "370,000+", founded: 1937, description: "Multinational automotive manufacturer" },
};

function generateDomain(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "").replace(/pvt|ltd|inc|corp|llc/g, "");
  return `${clean}.com`;
}

export async function enrichCompany(name: string, domain?: string): Promise<CompanyVerification> {
  const companyDomain = domain || generateDomain(name);
  const known = KNOWN_COMPANIES[companyDomain];

  if (known) {
    return {
      name, domain: companyDomain, logo: getCompanyLogo(companyDomain),
      website: `https://${companyDomain}`, isVerified: true, hasWebsite: true, hasMxRecords: true,
      industry: known.industry, size: known.size, founded: known.founded, description: known.description,
      socialLinks: { linkedin: `https://linkedin.com/company/${companyDomain.replace(".com", "")}` },
    };
  }

  const [hasA, hasMx] = await Promise.all([checkDomainExists(companyDomain), checkMxRecords(companyDomain)]);
  return {
    name, domain: companyDomain, logo: getCompanyLogo(companyDomain),
    website: `https://${companyDomain}`, isVerified: hasA && hasMx, hasWebsite: hasA, hasMxRecords: hasMx,
    industry: "Unknown", size: "Unknown", founded: null, description: `${name}`,
    socialLinks: { linkedin: `https://linkedin.com/company/${companyDomain.replace(".com", "")}` },
  };
}
