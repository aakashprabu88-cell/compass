export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  xp: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  totalQuestions: number;
  mockInterviews: number;
  applicationsSent: number;
  coursesCompleted: number;
  dailyChallenges: { date: string; completed: boolean }[];
}

export const BADGES: Badge[] = [
  { id: "first-step", name: "First Step", description: "Complete your career assessment", icon: "Footprints", color: "emerald", requirement: "Complete onboarding", xp: 50 },
  { id: "skill-scout", name: "Skill Scout", description: "Identify 5+ skill gaps", icon: "Search", color: "blue", requirement: "5+ skill gaps identified", xp: 100 },
  { id: "resume-pro", name: "Resume Pro", description: "Get 70+ ATS score", icon: "FileText", color: "purple", requirement: "ATS score >= 70", xp: 150 },
  { id: "job-hunter", name: "Job Hunter", description: "Apply to 5 jobs", icon: "Briefcase", color: "indigo", requirement: "5 applications sent", xp: 100 },
  { id: "career-explorer", name: "Career Explorer", description: "Explore 3+ career paths", icon: "Compass", color: "cyan", requirement: "3+ career paths viewed", xp: 75 },
  { id: "company-scholar", name: "Company Scholar", description: "Research 3+ companies", icon: "Building2", color: "amber", requirement: "3+ companies researched", xp: 100 },
  { id: "sim-master", name: "Simulator Master", description: "Run 3+ career simulations", icon: "TrendingUp", color: "green", requirement: "3+ simulations run", xp: 125 },
  { id: "salary-ninja", name: "Salary Ninja", description: "Use negotiation coach", icon: "IndianRupee", color: "yellow", requirement: "Negotiation scripts generated", xp: 75 },
  { id: "govt-explorer", name: "Govt Explorer", description: "Check govt exam pathways", icon: "Shield", color: "red", requirement: "Govt exam page visited", xp: 50 },
  { id: "intel-analyst", name: "Intel Analyst", description: "View hiring intelligence", icon: "Radar", color: "violet", requirement: "Intelligence dashboard viewed", xp: 50 },
  { id: "streak-3", name: "On Fire", description: "3-day activity streak", icon: "Flame", color: "orange", requirement: "3-day streak", xp: 150 },
  { id: "streak-7", name: "Unstoppable", description: "7-day activity streak", icon: "Zap", color: "yellow", requirement: "7-day streak", xp: 300 },
  { id: "course-finisher", name: "Course Finisher", description: "Complete a learning course", icon: "GraduationCap", color: "teal", requirement: "1 course completed", xp: 200 },
  { id: "heavy-applicant", name: "Application Machine", description: "Apply to 10+ jobs", icon: "Rocket", color: "pink", requirement: "10+ applications", xp: 250 },
  { id: "polyglot", name: "Polyglot", description: "List 5+ programming languages", icon: "Code", color: "lime", requirement: "5+ languages in profile", xp: 100 },
];

export const LEVELS = [
  { level: 1, title: "Career Curious", xpRequired: 0 },
  { level: 2, title: "Job Seeker", xpRequired: 200 },
  { level: 3, title: "Skill Builder", xpRequired: 500 },
  { level: 4, title: "Interview Ready", xpRequired: 1000 },
  { level: 5, title: "Application Pro", xpRequired: 1800 },
  { level: 6, title: "Career Athlete", xpRequired: 3000 },
  { level: 7, title: "Offer Magnet", xpRequired: 5000 },
  { level: 8, title: "Career Master", xpRequired: 8000 },
  { level: 9, title: "Industry Leader", xpRequired: 12000 },
  { level: 10, title: "Career Legend", xpRequired: 20000 },
];

export function calculateLevel(xp: number): { level: number; title: string; progress: number; nextLevelXp: number } {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }

  const xpInLevel = xp - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

  return { level: currentLevel.level, title: currentLevel.title, progress, nextLevelXp: nextLevel.xpRequired };
}

export function getEarnableBadges(progress: UserProgress): { earned: Badge[]; locked: Badge[] } {
  const earned: Badge[] = [];
  const locked: Badge[] = [];

  for (const badge of BADGES) {
    if (progress.badges.includes(badge.id)) {
      earned.push(badge);
    } else {
      locked.push(badge);
    }
  }

  return { earned, locked };
}

export function checkNewBadges(progress: UserProgress): Badge[] {
  const newBadges: Badge[] = [];

  if (progress.totalQuestions >= 5 && !progress.badges.includes("skill-scout")) {
    newBadges.push(BADGES.find(b => b.id === "skill-scout")!);
  }
  if (progress.applicationsSent >= 5 && !progress.badges.includes("job-hunter")) {
    newBadges.push(BADGES.find(b => b.id === "job-hunter")!);
  }
  if (progress.applicationsSent >= 10 && !progress.badges.includes("heavy-applicant")) {
    newBadges.push(BADGES.find(b => b.id === "heavy-applicant")!);
  }
  if (progress.streak >= 3 && !progress.badges.includes("streak-3")) {
    newBadges.push(BADGES.find(b => b.id === "streak-3")!);
  }
  if (progress.streak >= 7 && !progress.badges.includes("streak-7")) {
    newBadges.push(BADGES.find(b => b.id === "streak-7")!);
  }
  if (progress.coursesCompleted >= 1 && !progress.badges.includes("course-finisher")) {
    newBadges.push(BADGES.find(b => b.id === "course-finisher")!);
  }
  if (progress.mockInterviews >= 3 && !progress.badges.includes("sim-master")) {
    newBadges.push(BADGES.find(b => b.id === "sim-master")!);
  }

  return newBadges.filter(Boolean);
}

export function getDailyChallenge(date: string): { id: string; title: string; description: string; xp: number; type: string } {
  const hash = date.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const challenges = [
    { id: "solve-3", title: "Solve 3 Coding Problems", description: "Complete any 3 coding challenges today", xp: 50, type: "coding" },
    { id: "apply-2", title: "Apply to 2 Jobs", description: "Submit applications to 2 matching jobs", xp: 40, type: "application" },
    { id: "learn-1hr", title: "Learn for 1 Hour", description: "Spend 1 hour on your learning roadmap", xp: 30, type: "learning" },
    { id: "research-company", title: "Research a Company", description: "Visit and study a company preparation page", xp: 25, type: "research" },
    { id: "update-resume", title: "Update Your Resume", description: "Improve your resume and check ATS score", xp: 35, type: "resume" },
    { id: "simulate", title: "Run a Simulation", description: "Complete a career trajectory simulation", xp: 45, type: "simulation" },
    { id: "negotiate", title: "Practice Negotiation", description: "Generate salary negotiation scripts", xp: 20, type: "negotiation" },
    { id: "check-govt", title: "Check Govt Exams", description: "Explore government exam pathways", xp: 15, type: "govt" },
  ];
  return challenges[Math.abs(hash) % challenges.length];
}
