export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number; // 0-100
  category: string;
  marketDemand: number;
  salaryImpact: number;
  connections: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  fit: number;
  salary: string;
  growth: string;
  automationRisk: number;
}

export const SKILL_NODES: SkillNode[] = [
  { id: "js", label: "JavaScript", x: 300, y: 200, level: 85, category: "Frontend", marketDemand: 95, salaryImpact: 80, connections: ["react", "node", "ts"] },
  { id: "react", label: "React", x: 180, y: 120, level: 70, category: "Frontend", marketDemand: 92, salaryImpact: 82, connections: ["nextjs", "ts"] },
  { id: "node", label: "Node.js", x: 420, y: 120, level: 65, category: "Backend", marketDemand: 88, salaryImpact: 78, connections: ["ts", "postgres"] },
  { id: "ts", label: "TypeScript", x: 300, y: 100, level: 60, category: "Frontend", marketDemand: 90, salaryImpact: 85, connections: [] },
  { id: "nextjs", label: "Next.js", x: 160, y: 200, level: 55, category: "Frontend", marketDemand: 85, salaryImpact: 80, connections: ["react"] },
  { id: "python", label: "Python", x: 500, y: 280, level: 50, category: "Data", marketDemand: 93, salaryImpact: 88, connections: ["ml", "postgres"] },
  { id: "ml", label: "Machine Learning", x: 600, y: 200, level: 30, category: "AI/ML", marketDemand: 97, salaryImpact: 95, connections: [] },
  { id: "postgres", label: "PostgreSQL", x: 420, y: 300, level: 55, category: "Backend", marketDemand: 80, salaryImpact: 70, connections: ["node"] },
  { id: "docker", label: "Docker", x: 550, y: 380, level: 40, category: "DevOps", marketDemand: 82, salaryImpact: 75, connections: ["aws"] },
  { id: "aws", label: "AWS", x: 650, y: 350, level: 25, category: "DevOps", marketDemand: 91, salaryImpact: 90, connections: [] },
  { id: "git", label: "Git", x: 200, y: 320, level: 80, category: "Tools", marketDemand: 75, salaryImpact: 50, connections: ["js", "docker"] },
  { id: "css", label: "CSS/Tailwind", x: 130, y: 280, level: 75, category: "Frontend", marketDemand: 78, salaryImpact: 60, connections: ["react", "js"] },
  { id: "sql", label: "SQL", x: 350, y: 380, level: 45, category: "Backend", marketDemand: 77, salaryImpact: 65, connections: ["postgres"] },
  { id: "java", label: "Java", x: 520, y: 150, level: 35, category: "Backend", marketDemand: 79, salaryImpact: 82, connections: ["ts"] },
  { id: "figma", label: "Figma", x: 100, y: 180, level: 40, category: "Design", marketDemand: 65, salaryImpact: 55, connections: ["css"] },
];

export const CAREER_PATHS: CareerPath[] = [
  { id: "frontend", title: "Frontend Engineer", fit: 82, salary: "₹8-18 LPA", growth: "High", automationRisk: 15 },
  { id: "fullstack", title: "Full Stack Developer", fit: 75, salary: "₹10-22 LPA", growth: "High", automationRisk: 12 },
  { id: "ml", title: "ML Engineer", fit: 45, salary: "₹15-35 LPA", growth: "Very High", automationRisk: 8 },
  { id: "devops", title: "DevOps Engineer", fit: 38, salary: "₹12-28 LPA", growth: "High", automationRisk: 10 },
  { id: "data", title: "Data Analyst", fit: 52, salary: "₹6-14 LPA", growth: "Medium", automationRisk: 25 },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Frontend": "#818cf8",
  "Backend": "#34d399",
  "Data": "#fbbf24",
  "AI/ML": "#f472b6",
  "DevOps": "#a78bfa",
  "Tools": "#64748b",
  "Design": "#fb923c",
};

export const CATEGORY_COLORS_BG: Record<string, string> = {
  "Frontend": "rgba(129,140,248,0.15)",
  "Backend": "rgba(52,211,153,0.15)",
  "Data": "rgba(251,191,36,0.15)",
  "AI/ML": "rgba(244,114,182,0.15)",
  "DevOps": "rgba(167,139,250,0.15)",
  "Tools": "rgba(100,116,139,0.15)",
  "Design": "rgba(251,146,60,0.15)",
};
