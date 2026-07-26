export interface CareerTimeline {
  career: string;
  stages: {
    title: string;
    years: string;
    salary: string;
    skills: string[];
    description: string;
  }[];
}

export const TIMELINE_DATABASE: CareerTimeline[] = [
  {
    career: "Software Engineer",
    stages: [
      { title: "Junior Developer", years: "0-2 years", salary: "₹3-6 LPA", skills: ["HTML/CSS", "JavaScript", "Git", "Basic Algorithms"], description: "Learn fundamentals, contribute to codebases, fix bugs, write unit tests." },
      { title: "Mid-Level Developer", years: "2-5 years", salary: "₹6-12 LPA", skills: ["React/Angular", "Node.js", "System Design", "CI/CD"], description: "Own features end-to-end, mentor juniors, make architectural decisions." },
      { title: "Senior Developer", years: "5-8 years", salary: "₹12-22 LPA", skills: ["Architecture", "Leadership", "Performance Optimization", "Mentoring"], description: "Design systems, lead technical decisions, drive engineering excellence." },
      { title: "Staff/Principal Engineer", years: "8-12 years", salary: "₹22-40 LPA", skills: ["Technical Strategy", "Cross-team Leadership", "Innovation", "Industry Expertise"], description: "Set technical direction, solve org-wide challenges, represent company externally." },
      { title: "Engineering Manager/Director", years: "12+ years", salary: "₹30-60 LPA", skills: ["People Management", "Strategic Planning", "Budget Management", "Executive Communication"], description: "Lead teams, manage budgets, drive engineering culture and hiring." },
    ],
  },
  {
    career: "Data Scientist",
    stages: [
      { title: "Data Analyst", years: "0-2 years", salary: "₹3-7 LPA", skills: ["SQL", "Excel", "Python Basics", "Data Visualization"], description: "Analyze data, build dashboards, support business decisions with data." },
      { title: "Junior Data Scientist", years: "2-4 years", salary: "₹7-12 LPA", skills: ["Python", "Statistics", "ML Basics", "SQL"], description: "Build predictive models, conduct A/B tests, present findings." },
      { title: "Data Scientist", years: "4-7 years", salary: "₹12-20 LPA", skills: ["Deep Learning", "NLP", "Feature Engineering", "MLOps"], description: "Lead ML projects, deploy models to production, mentor juniors." },
      { title: "Senior Data Scientist", years: "7-10 years", salary: "₹20-35 LPA", skills: ["Research", "Strategy", "Team Leadership", "Business Acumen"], description: "Define data strategy, lead complex projects, drive business impact." },
      { title: "Head of Data/Analytics", years: "10+ years", salary: "₹30-50 LPA", skills: ["Executive Leadership", "Data Strategy", "Budget Management", "Cross-functional"], description: "Lead data organizations, define vision, drive data-driven culture." },
    ],
  },
  {
    career: "UX/UI Designer",
    stages: [
      { title: "Junior Designer", years: "0-2 years", salary: "₹3-6 LPA", skills: ["Figma", "Wireframing", "Basic UX", "Visual Design"], description: "Create wireframes, design screens, conduct user research under supervision." },
      { title: "UX Designer", years: "2-4 years", salary: "₹6-10 LPA", skills: ["User Research", "Prototyping", "Design Systems", "Usability Testing"], description: "Lead design for features, conduct research, build design systems." },
      { title: "Senior UX Designer", years: "4-7 years", salary: "₹10-18 LPA", skills: ["Strategy", "Leadership", "Brand Design", "Cross-platform"], description: "Define design direction, mentor juniors, drive design culture." },
      { title: "Design Manager", years: "7-10 years", salary: "₹18-28 LPA", skills: ["Team Management", "Design Strategy", "Stakeholder Management"], description: "Lead design teams, manage budgets, drive design vision." },
      { title: "Head of Design/VP Design", years: "10+ years", salary: "₹25-45 LPA", skills: ["Executive Leadership", "Brand Strategy", "Organizational Design"], description: "Lead design organizations, define company design philosophy." },
    ],
  },
  {
    career: "Cybersecurity Analyst",
    stages: [
      { title: "Security Analyst (L1)", years: "0-2 years", salary: "₹3-6 LPA", skills: ["SIEM", "Log Analysis", "Incident Response Basics", "Networking"], description: "Monitor alerts, triage incidents, document security events." },
      { title: "Security Analyst (L2)", years: "2-4 years", salary: "₹6-12 LPA", skills: ["Penetration Testing", "Malware Analysis", "Forensics", "Compliance"], description: "Investigate complex incidents, conduct vulnerability assessments." },
      { title: "Senior Security Analyst", years: "4-7 years", salary: "₹12-20 LPA", skills: ["Threat Hunting", "Architecture", "Team Leadership", "Compliance"], description: "Lead incident response, design security controls, mentor juniors." },
      { title: "Security Architect", years: "7-10 years", salary: "₹20-35 LPA", skills: ["Security Architecture", "Cloud Security", "Risk Management", "Strategy"], description: "Design security architecture, lead security strategy, manage risk." },
      { title: "CISO/Security Director", years: "10+ years", salary: "₹30-60 LPA", skills: ["Executive Leadership", "Risk Management", "Compliance", "Business Strategy"], description: "Lead security organization, report to board, drive security culture." },
    ],
  },
  {
    career: "Product Manager",
    stages: [
      { title: "Associate PM", years: "0-2 years", salary: "₹4-8 LPA", skills: ["User Research", "Data Analysis", "Wireframing", "Agile"], description: "Support product features, gather requirements, work with engineering." },
      { title: "Product Manager", years: "2-5 years", salary: "₹8-15 LPA", skills: ["Strategy", "Roadmapping", "Stakeholder Management", "Analytics"], description: "Own product features, define roadmap, drive product decisions." },
      { title: "Senior PM", years: "5-8 years", salary: "₹15-25 LPA", skills: ["Product Strategy", "Leadership", "Business Acumen", "Innovation"], description: "Own product areas, lead cross-functional teams, drive strategy." },
      { title: "Group PM/Director", years: "8-12 years", salary: "₹25-40 LPA", skills: ["Organizational Leadership", "P&L Management", "Executive Communication"], description: "Lead product organizations, manage P&L, drive company strategy." },
      { title: "VP Product/CPO", years: "12+ years", salary: "₹40-70 LPA", skills: ["Executive Leadership", "Vision", "Company Strategy", "Board Communication"], description: "Set product vision, lead product organization, drive company growth." },
    ],
  },
];

export function getTimelineForCareer(career: string): CareerTimeline | undefined {
  return TIMELINE_DATABASE.find(t => t.career.toLowerCase() === career.toLowerCase());
}

export function getAllTimelines(): CareerTimeline[] {
  return TIMELINE_DATABASE;
}
