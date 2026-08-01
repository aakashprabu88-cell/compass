export interface Direction {
  key: string;
  name: string;
  tag: string;
  color: string;
  rad: number;
  body: string;
  points: string[];
  href: string;
}

export const DIRS: Direction[] = [
  { key: "N", name: "AI Career Assessment", tag: "Know yourself", color: "#f59e0b", rad: 0, body: "Map your RIASEC code, Big Five traits and strengths in minutes — your true north, computed.", points: ["RIASEC Interest Code", "Big Five Personality", "Skill Graph"], href: "/assessment" },
  { key: "NE", name: "Explore Career Paths", tag: "Find your way", color: "#22d3ee", rad: Math.PI / 4, body: "650+ real paths with salaries, demand and next steps — see the road before you walk it.", points: ["650+ Career Paths", "Salary & Demand", "Next Steps"], href: "/paths" },
  { key: "E", name: "AI Mock Interview", tag: "Face the panel", color: "#a855f7", rad: Math.PI / 2, body: "Practice against an AI panel, scored live with honest feedback for every round.", points: ["AI Panel", "Live Scoring", "Analytics"], href: "/interview-preparation" },
  { key: "SE", name: "Resume Builder", tag: "Open every door", color: "#f472b6", rad: (3 * Math.PI) / 4, body: "An ATS-ready resume built in minutes — plus AI outreach that actually gets replies.", points: ["Resume Builder", "ATS Check", "AI Outreach"], href: "/resume-builder" },
  { key: "S", name: "Aptitude Training", tag: "Train your mind", color: "#10b981", rad: Math.PI, body: "Bite-sized drills with instant scoring, weekly tests and live performance tracking.", points: ["Daily Quiz", "Weekly Test", "Live Performance"], href: "/interview-preparation/aptitude" },
  { key: "SW", name: "Jobs & Internships", tag: "Land offers", color: "#34d399", rad: (5 * Math.PI) / 4, body: "Openings matched to your profile — tracked end to end from apply to accepted offer.", points: ["Matched Jobs", "Internships", "Live Tracker"], href: "/jobs" },
  { key: "W", name: "Compass AI Coach", tag: "Think together", color: "#818cf8", rad: (3 * Math.PI) / 2, body: "An agent that plans, drafts and guides you — from first question to final offer, 24/7.", points: ["Career Coach", "Live Agent", "24/7"], href: "/agent" },
  { key: "NW", name: "Learning Roadmap", tag: "Close the gap", color: "#f97316", rad: (7 * Math.PI) / 4, body: "A sequenced plan built around exactly what you're missing — not a generic syllabus.", points: ["Courses", "Skill Gaps", "Personal Coach"], href: "/courses" },
];

export const normalizeAngle = (a: number) => {
  const twoPi = Math.PI * 2;
  return ((a % twoPi) + twoPi) % twoPi;
};

export const headingFromDrag = (dx: number, dy: number) => normalizeAngle(Math.atan2(dx, -dy));

export const dirFromHeading = (heading: number) => Math.round(normalizeAngle(heading) / (Math.PI / 4)) % 8;
