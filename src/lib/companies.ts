export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  industry: string;
  headquarters: string;
  size: string;
  founded: number;
  rating: number;
  culture: string;
  benefits: string[];
  salaryRange: string;
  growthRate: string;
  techStack: string[];
  description: string;
  website: string;
  logo: string;
}

export const COMPANY_DATABASE: CompanyData[] = [
  {
    id: "c1", name: "TCS", slug: "tcs", industry: "Technology", headquarters: "Mumbai, India",
    size: "500,000+", founded: 1968, rating: 4.2,
    culture: "Strong focus on employee development, diverse projects, and global exposure. Known for structured training programs and career growth paths.",
    benefits: ["Health Insurance", "Life Insurance", "Learning & Development", "Retirement Benefits", "Flexible Work", "Employee Stock Options"],
    salaryRange: "₹3.5–25 LPA", growthRate: "growing",
    techStack: ["Java", "Python", "React", "AWS", "Azure", "Salesforce", "ServiceNow"],
    description: "India's largest IT services company. Global presence in 46 countries with enterprise solutions for banking, retail, and healthcare.",
    website: "https://tcs.com", logo: "🏢",
  },
  {
    id: "c2", name: "Infosys", slug: "infosys", industry: "Technology", headquarters: "Bangalore, India",
    size: "300,000+", founded: 1981, rating: 4.1,
    culture: "Innovation-driven with strong values. Known for Infosys Global Education Program and sustainable business practices.",
    benefits: ["Health Insurance", "Education Assistance", "Retirement Benefits", "Performance Bonus", "Flexible Hours"],
    salaryRange: "₹3.5–22 LPA", growthRate: "growing",
    techStack: ["Java", "Python", "React", "Angular", "AWS", "Azure", "Docker"],
    description: "Global leader in next-gen digital services and consulting. Helped enterprises navigate their digital transformation journey.",
    website: "https://infosys.com", logo: "🏢",
  },
  {
    id: "c3", name: "Zoho", slug: "zoho", industry: "Technology", headquarters: "Chennai, India",
    size: "15,000+", founded: 1996, rating: 4.5,
    culture: "Bootstrapped and profitable. Known for employee-first culture, no VC funding, and building products in-house. Strong remote work culture.",
    benefits: ["Health Insurance", "Stock Options", "Work From Home", "Learning Budget", "Free Meals", "Gym"],
    salaryRange: "₹4–20 LPA", growthRate: "booming",
    techStack: ["JavaScript", "React", "Node.js", "Python", "Java", "Go", "Kotlin"],
    description: "SaaS company with 50+ products used by millions. Fully bootstrapped, profitable, and focused on long-term value creation.",
    website: "https://zoho.com", logo: "🏢",
  },
  {
    id: "c4", name: "Freshworks", slug: "freshworks", industry: "Technology", headquarters: "Chennai, India",
    size: "5,000+", founded: 2010, rating: 4.3,
    culture: "Fast-paced startup environment with a focus on customer obsession. Known for innovative SaaS products and rapid growth.",
    benefits: ["Health Insurance", "Stock Options", "Flexible Work", "Learning Budget", "Wellness Programs"],
    salaryRange: "₹5–18 LPA", growthRate: "booming",
    techStack: ["React", "Node.js", "Ruby on Rails", "AWS", "Kubernetes", "TypeScript"],
    description: "SaaS company offering customer service, IT service management, and marketing automation products. IPO'd on NASDAQ.",
    website: "https://freshworks.com", logo: "🏢",
  },
  {
    id: "c5", name: "Amazon AWS", slug: "aws", industry: "Cloud Technology", headquarters: "Seattle, USA / Chennai, India",
    size: "10,000+", founded: 2006, rating: 4.4,
    culture: "Customer obsession, ownership, and bias for action. Known for leadership principles and high-performance culture.",
    benefits: ["Health Insurance", "RSUs", "401k Match", "Parental Leave", "Education Reimbursement", "Wellness"],
    salaryRange: "₹8–35 LPA", growthRate: "booming",
    techStack: ["AWS", "Python", "Java", "Terraform", "Docker", "Kubernetes", "Go"],
    description: "World's leading cloud platform. Powers millions of businesses globally with compute, storage, AI, and database services.",
    website: "https://aws.amazon.com", logo: "☁️",
  },
  {
    id: "c6", name: "HCLTech", slug: "hcltech", industry: "Technology", headquarters: "Noida, India",
    size: "220,000+", founded: 1976, rating: 4.0,
    culture: "Employee-first philosophy with strong focus on innovation and sustainability. Known for Mode 1-2-3 strategy.",
    benefits: ["Health Insurance", "Performance Bonus", "Learning Programs", "Retirement Benefits", "Flexible Work"],
    salaryRange: "₹3.5–20 LPA", growthRate: "growing",
    techStack: ["Java", "Python", "React", "Azure", "AWS", "ServiceNow", "Salesforce"],
    description: "Global technology company with capabilities across cloud, cybersecurity, and digital transformation.",
    website: "https://hcltech.com", logo: "🏢",
  },
  {
    id: "c7", name: "Cognizant", slug: "cognizant", industry: "Technology", headquarters: "New Jersey, USA / Chennai, India",
    size: "350,000+", founded: 1994, rating: 4.1,
    culture: "Client-focused with strong emphasis on digital transformation. Known for industry-specific solutions and consulting.",
    benefits: ["Health Insurance", "Performance Bonus", "Education Assistance", "Retirement Benefits", "Flexible Hours"],
    salaryRange: "₹4–18 LPA", growthRate: "stable",
    techStack: ["Java", ".NET", "React", "AWS", "Azure", "Salesforce", "Pega"],
    description: "One of the world's leading professional services companies, transforming clients' business, operating, and technology models.",
    website: "https://cognizant.com", logo: "🏢",
  },
  {
    id: "c8", name: "Wipro", slug: "wipro", industry: "Technology", headquarters: "Bangalore, India",
    size: "240,000+", founded: 1945, rating: 3.9,
    culture: "Diverse and inclusive workplace with focus on sustainability and innovation. Known for Wipro Ventures and digital capabilities.",
    benefits: ["Health Insurance", "Performance Bonus", "Learning Programs", "Retirement Benefits", "Employee Stock Options"],
    salaryRange: "₹3.5–18 LPA", growthRate: "stable",
    techStack: ["Java", "Python", "React", "Azure", "AWS", "SAP", "Oracle"],
    description: "Global information technology, consulting, and business process services company. Leader in cloud, cybersecurity, and AI.",
    website: "https://wipro.com", logo: "🏢",
  },
  {
    id: "c9", name: "Apollo Hospitals", slug: "apollo", industry: "Healthcare", headquarters: "Chennai, India",
    size: "10,000+", founded: 1983, rating: 4.3,
    culture: "Patient-first approach with cutting-edge medical technology. Known for healthcare innovation and medical education.",
    benefits: ["Health Insurance", "Professional Development", "Retirement Benefits", "Wellness Programs", "Education Assistance"],
    salaryRange: "₹3–25 LPA", growthRate: "booming",
    techStack: ["Healthcare IT", "EMR Systems", "Telemedicine", "Data Analytics"],
    description: "Asia's largest and most trusted healthcare group with 71+ hospitals and 10,000+ beds across India.",
    website: "https://apollohospitals.com", logo: "🏥",
  },
  {
    id: "c10", name: "L&T Construction", slug: "lt", industry: "Construction", headquarters: "Mumbai, India",
    size: "50,000+", founded: 1938, rating: 4.0,
    culture: "Engineering excellence with focus on safety and sustainability. Known for mega infrastructure projects.",
    benefits: ["Health Insurance", "Accommodation", "Performance Bonus", "Retirement Benefits", "Transportation"],
    salaryRange: "₹4–15 LPA", growthRate: "growing",
    techStack: ["AutoCAD", "Project Management", "SAP", "Primavera", "BIM"],
    description: "India's largest construction company, delivering iconic infrastructure projects across 30+ countries.",
    website: "https://larsentoubro.com", logo: "🏗️",
  },
  {
    id: "c11", name: "Bosch", slug: "bosch", industry: "Automotive / Engineering", headquarters: "Stuttgart, Germany / Bangalore, India",
    size: "5,000+ (India)", founded: 1886, rating: 4.4,
    culture: "Engineering-driven with strong focus on innovation and sustainability. Known for quality and precision.",
    benefits: ["Health Insurance", "Performance Bonus", "Retirement Benefits", "Flexible Hours", "Learning Programs"],
    salaryRange: "₹5–20 LPA", growthRate: "growing",
    techStack: ["Embedded Systems", "C/C++", "AUTOSAR", "Python", "MATLAB"],
    description: "Global leader in technology and services. Focus on IoT, automotive, industrial technology, and consumer goods.",
    website: "https://bosch.com", logo: "⚙️",
  },
  {
    id: "c12", name: "RBI", slug: "rbi", industry: "Banking / Government", headquarters: "Mumbai, India",
    size: "10,000+", founded: 1935, rating: 4.6,
    culture: "Stable, prestigious government organization with focus on financial stability and monetary policy.",
    benefits: ["Government Pension", "Health Insurance", "Housing Allowance", "Education Allowance", "Job Security"],
    salaryRange: "₹8–20 LPA", growthRate: "stable",
    techStack: ["Banking Systems", "Data Analysis", "Policy Research", "Statistics"],
    description: "India's central bank, responsible for monetary policy, banking regulation, and financial system stability.",
    website: "https://rbi.org.in", logo: "🏦",
  },
];

export function searchCompanies(query: string, industryFilter?: string): CompanyData[] {
  const q = query.toLowerCase();
  let results = COMPANY_DATABASE.filter(c => {
    const text = `${c.name} ${c.industry} ${c.description} ${c.techStack.join(" ")}`.toLowerCase();
    return text.includes(q);
  });
  if (industryFilter && industryFilter !== "all") {
    results = results.filter(c => c.industry.toLowerCase().includes(industryFilter.toLowerCase()));
  }
  return results;
}

export function getCompanyBySlug(slug: string): CompanyData | undefined {
  return COMPANY_DATABASE.find(c => c.slug === slug);
}

export function getCompaniesByIndustry(industry: string): CompanyData[] {
  return COMPANY_DATABASE.filter(c => c.industry.toLowerCase().includes(industry.toLowerCase()));
}
