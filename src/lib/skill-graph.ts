export interface SkillNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  level: number; // 0 = not started, 1-10 = proficiency
  status: "mastered" | "learning" | "gap" | "unused";
  demand: "high" | "medium" | "low";
  salaryImpact: number; // percentage salary boost
}

export interface SkillEdge {
  from: string;
  to: string;
  type: "prerequisite" | "complementary" | "alternative";
  strength: number; // 0-1
}

export const SKILL_GRAPH_NODES: SkillNode[] = [
  // Programming Languages
  { id: "javascript", label: "JavaScript", category: "Language", x: 200, y: 100, level: 0, status: "gap", demand: "high", salaryImpact: 15 },
  { id: "typescript", label: "TypeScript", category: "Language", x: 320, y: 80, level: 0, status: "gap", demand: "high", salaryImpact: 18 },
  { id: "python", label: "Python", category: "Language", x: 150, y: 200, level: 0, status: "gap", demand: "high", salaryImpact: 20 },
  { id: "java", label: "Java", category: "Language", x: 100, y: 150, level: 0, status: "gap", demand: "medium", salaryImpact: 12 },
  { id: "sql", label: "SQL", category: "Language", x: 250, y: 250, level: 0, status: "gap", demand: "high", salaryImpact: 10 },

  // Frontend
  { id: "react", label: "React", category: "Frontend", x: 400, y: 150, level: 0, status: "gap", demand: "high", salaryImpact: 16 },
  { id: "nextjs", label: "Next.js", category: "Frontend", x: 500, y: 100, level: 0, status: "gap", demand: "high", salaryImpact: 20 },
  { id: "html-css", label: "HTML/CSS", category: "Frontend", x: 380, y: 220, level: 0, status: "gap", demand: "medium", salaryImpact: 5 },
  { id: "tailwind", label: "Tailwind CSS", category: "Frontend", x: 480, y: 200, level: 0, status: "gap", demand: "medium", salaryImpact: 8 },

  // Backend
  { id: "nodejs", label: "Node.js", category: "Backend", x: 350, y: 320, level: 0, status: "gap", demand: "high", salaryImpact: 15 },
  { id: "express", label: "Express.js", category: "Backend", x: 420, y: 370, level: 0, status: "gap", demand: "medium", salaryImpact: 10 },
  { id: "django", label: "Django", category: "Backend", x: 200, y: 350, level: 0, status: "gap", demand: "medium", salaryImpact: 12 },
  { id: "fastapi", label: "FastAPI", category: "Backend", x: 120, y: 300, level: 0, status: "gap", demand: "high", salaryImpact: 14 },

  // Data & AI
  { id: "pandas", label: "Pandas", category: "Data & AI", x: 80, y: 400, level: 0, status: "gap", demand: "high", salaryImpact: 18 },
  { id: "numpy", label: "NumPy", category: "Data & AI", x: 160, y: 450, level: 0, status: "gap", demand: "medium", salaryImpact: 12 },
  { id: "ml", label: "Machine Learning", category: "Data & AI", x: 250, y: 480, level: 0, status: "gap", demand: "high", salaryImpact: 25 },
  { id: "tensorflow", label: "TensorFlow", category: "Data & AI", x: 340, y: 450, level: 0, status: "gap", demand: "medium", salaryImpact: 20 },
  { id: "data-analysis", label: "Data Analysis", category: "Data & AI", x: 100, y: 500, level: 0, status: "gap", demand: "high", salaryImpact: 15 },

  // DevOps & Cloud
  { id: "git", label: "Git", category: "DevOps", x: 550, y: 280, level: 0, status: "gap", demand: "high", salaryImpact: 8 },
  { id: "docker", label: "Docker", category: "DevOps", x: 600, y: 350, level: 0, status: "gap", demand: "high", salaryImpact: 15 },
  { id: "aws", label: "AWS", category: "DevOps", x: 620, y: 430, level: 0, status: "gap", demand: "high", salaryImpact: 22 },
  { id: "linux", label: "Linux", category: "DevOps", x: 560, y: 400, level: 0, status: "gap", demand: "medium", salaryImpact: 10 },

  // Soft Skills
  { id: "communication", label: "Communication", category: "Soft Skills", x: 450, y: 50, level: 0, status: "gap", demand: "high", salaryImpact: 10 },
  { id: "problem-solving", label: "Problem Solving", category: "Soft Skills", x: 550, y: 50, level: 0, status: "gap", demand: "high", salaryImpact: 8 },
  { id: "teamwork", label: "Teamwork", category: "Soft Skills", x: 620, y: 100, level: 0, status: "gap", demand: "medium", salaryImpact: 5 },

  // Tools
  { id: "vscode", label: "VS Code", category: "Tools", x: 500, y: 450, level: 0, status: "gap", demand: "medium", salaryImpact: 3 },
  { id: "figma", label: "Figma", category: "Tools", x: 550, y: 150, level: 0, status: "gap", demand: "medium", salaryImpact: 6 },
  { id: "jira", label: "Jira", category: "Tools", x: 650, y: 200, level: 0, status: "gap", demand: "medium", salaryImpact: 4 },
];

export const SKILL_GRAPH_EDGES: SkillEdge[] = [
  // Language prerequisites
  { from: "html-css", to: "javascript", type: "prerequisite", strength: 0.9 },
  { from: "javascript", to: "typescript", type: "prerequisite", strength: 0.8 },
  { from: "javascript", to: "react", type: "prerequisite", strength: 0.9 },
  { from: "python", to: "pandas", type: "prerequisite", strength: 0.8 },
  { from: "python", to: "django", type: "prerequisite", strength: 0.7 },
  { from: "python", to: "fastapi", type: "prerequisite", strength: 0.7 },
  { from: "python", to: "ml", type: "prerequisite", strength: 0.8 },
  { from: "java", to: "sql", type: "complementary", strength: 0.6 },

  // Frontend chain
  { from: "html-css", to: "tailwind", type: "complementary", strength: 0.7 },
  { from: "react", to: "nextjs", type: "prerequisite", strength: 0.9 },
  { from: "react", to: "tailwind", type: "complementary", strength: 0.6 },

  // Backend chain
  { from: "javascript", to: "nodejs", type: "prerequisite", strength: 0.9 },
  { from: "nodejs", to: "express", type: "prerequisite", strength: 0.8 },
  { from: "sql", to: "nodejs", type: "complementary", strength: 0.5 },
  { from: "sql", to: "django", type: "complementary", strength: 0.6 },

  // Data chain
  { from: "python", to: "numpy", type: "prerequisite", strength: 0.8 },
  { from: "numpy", to: "pandas", type: "prerequisite", strength: 0.7 },
  { from: "pandas", to: "data-analysis", type: "prerequisite", strength: 0.8 },
  { from: "pandas", to: "ml", type: "complementary", strength: 0.7 },
  { from: "ml", to: "tensorflow", type: "prerequisite", strength: 0.8 },

  // DevOps chain
  { from: "git", to: "docker", type: "complementary", strength: 0.6 },
  { from: "docker", to: "aws", type: "complementary", strength: 0.7 },
  { from: "linux", to: "docker", type: "prerequisite", strength: 0.7 },
  { from: "linux", to: "aws", type: "complementary", strength: 0.6 },

  // Cross-cutting
  { from: "nodejs", to: "react", type: "complementary", strength: 0.8 },
  { from: "nextjs", to: "nodejs", type: "complementary", strength: 0.6 },
  { from: "git", to: "nodejs", type: "complementary", strength: 0.5 },
  { from: "communication", to: "teamwork", type: "complementary", strength: 0.7 },
  { from: "problem-solving", to: "ml", type: "complementary", strength: 0.5 },
];

export const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Language": { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", text: "#818cf8", glow: "rgba(99,102,241,0.4)" },
  "Frontend": { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#34d399", glow: "rgba(16,185,129,0.4)" },
  "Backend": { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#fbbf24", glow: "rgba(245,158,11,0.4)" },
  "Data & AI": { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", text: "#c084fc", glow: "rgba(168,85,247,0.4)" },
  "DevOps": { bg: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.3)", text: "#fb7185", glow: "rgba(244,63,94,0.4)" },
  "Soft Skills": { bg: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.3)", text: "#22d3ee", glow: "rgba(6,182,212,0.4)" },
  "Tools": { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.3)", text: "#94a3b8", glow: "rgba(148,163,184,0.4)" },
};

export function updateSkillLevels(userSkills: string[], userGaps: { skillName: string; currentLevel: number; requiredLevel: number }[]) {
  const nodes = SKILL_GRAPH_NODES.map(node => {
    const lowerLabel = node.label.toLowerCase();
    const hasSkill = userSkills.some(s => s.toLowerCase() === lowerLabel || lowerLabel.includes(s.toLowerCase()) || s.toLowerCase().includes(lowerLabel));
    const gap = userGaps.find(g => g.skillName.toLowerCase() === lowerLabel || lowerLabel.includes(g.skillName.toLowerCase()));

    if (hasSkill) {
      return { ...node, level: 7, status: "mastered" as const };
    } else if (gap) {
      return { ...node, level: gap.currentLevel, status: gap.currentLevel >= gap.requiredLevel ? "mastered" as const : "gap" as const };
    }
    return node;
  });
  return nodes;
}

export function getSkillStats(nodes: SkillNode[]) {
  const mastered = nodes.filter(n => n.status === "mastered").length;
  const gaps = nodes.filter(n => n.status === "gap").length;
  const totalSalaryBoost = nodes.filter(n => n.status === "mastered").reduce((s, n) => s + n.salaryImpact, 0);
  const potentialBoost = nodes.filter(n => n.status === "gap" && n.demand === "high").reduce((s, n) => s + n.salaryImpact, 0);
  return { mastered, gaps, total: nodes.length, totalSalaryBoost, potentialBoost };
}
