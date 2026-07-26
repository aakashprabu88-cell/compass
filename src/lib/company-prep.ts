import { GOOGLE_BEHAVIORAL, GOOGLE_HR, GOOGLE_CODING } from "./google-microsoft-data";
import { MICROSOFT_BEHAVIORAL, MICROSOFT_HR, MICROSOFT_CODING } from "./microsoft-extra-data";
import { AMAZON_BEHAVIORAL, AMAZON_HR, AMAZON_CODING } from "./amazon-meta-data";
import { META_BEHAVIORAL, META_HR, META_CODING } from "./amazon-meta-data";
import { TCS_BEHAVIORAL, TCS_HR, TCS_CODING, INFOSYS_BEHAVIORAL, INFOSYS_HR, INFOSYS_CODING } from "./tcs-infosys-data";

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  domain: string;
  industry: string;
  size: string;
  founded: string;
  headquarters: string;
  description: string;
  hiringProcess: string[];
  avgSalary: string;
  rating: number;
  culture: string;
  benefits: string[];
  techStack: string[];
  interviewRounds: InterviewRound[];
  recentExperiences: InterviewExperience[];
  preparationTips: string[];
  codingPatterns: string[];
  oaPattern: string[];
  behavioralQuestions: QuestionAnswer[];
  hrQuestions: QuestionAnswer[];
  codingQuestions: CodingQuestion[];
  prepTime: string;
}

export interface InterviewRound {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  tips: string[];
}

export interface InterviewExperience {
  role: string;
  date: string;
  difficulty: string;
  outcome: string;
  tips: string;
  rounds: string;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  tips: string;
}

export interface CodingQuestion {
  problem: string;
  difficulty: string;
  approach: string;
  solution: string;
  complexity: string;
}

export const COMPANY_DATABASE: CompanyProfile[] = [
  {
    id: "google",
    name: "Google",
    logo: "G",
    domain: "google.com",
    industry: "Technology",
    size: "180,000+",
    founded: "1998",
    headquarters: "Mountain View, CA",
    description: "Global technology leader in search, cloud, AI, and consumer electronics.",
    hiringProcess: ["Online Application", "Phone Screen", "Technical Phone Interview", "On-site (4-5 rounds)", "Team Match", "Hiring Committee Review", "Offer"],
    avgSalary: "₹15-45 LPA (India) / $120-200K (US)",
    rating: 4.5,
    culture: "Innovation-driven, data-informed, collaborative. Heavy emphasis on 'Googleyness' — comfort with ambiguity, bias to action, collaborative nature.",
    benefits: ["Unlimited PTO", "Stock refreshers", "Free meals", "On-site gym", "20% time", "Education reimbursement"],
    techStack: ["Java", "C++", "Python", "Go", "TypeScript", "Kubernetes", "gRPC", "Bigtable", "Spanner"],
    interviewRounds: [
      { name: "Online Assessment", description: "2-3 coding problems, 90 minutes.", duration: "90 min", difficulty: "Medium-Hard", tips: ["Practice LeetCode Medium/Hard", "Focus on arrays, trees, graphs", "Optimize for time and space"] },
      { name: "Phone Screen", description: "1 coding problem + discussion.", duration: "45 min", difficulty: "Medium", tips: ["Think out loud", "Start with brute force", "Optimize step by step"] },
      { name: "On-site Round 1-2", description: "DSA. 2 problems each.", duration: "45 min each", difficulty: "Hard", tips: ["Cover edge cases", "Discuss complexity", "Code clean"] },
      { name: "On-site Round 3", description: "System design (L4+).", duration: "45 min", difficulty: "Hard", tips: ["Start with requirements", "High-level then deep dive", "Discuss tradeoffs"] },
      { name: "On-site Round 4", description: "Googleyness & Leadership.", duration: "45 min", difficulty: "Medium", tips: ["Use STAR method", "Show impact", "Be genuine"] },
    ],
    recentExperiences: [
      { role: "SWE L4", date: "2026-01", difficulty: "Hard", outcome: "Selected", tips: "DP and graph problems were heavy. System design was Google Maps.", rounds: "5" },
      { role: "SWE L3", date: "2025-11", difficulty: "Medium-Hard", outcome: "Selected", tips: "Array and tree traversal. Behavioral about teamwork.", rounds: "5" },
      { role: "Intern", date: "2025-09", difficulty: "Medium", outcome: "Selected", tips: "Two LeetCode Medium coding rounds.", rounds: "3" },
    ],
    preparationTips: ["Solve 300+ LeetCode problems", "Master graphs, trees, DP, arrays", "Practice system design at Google level", "Prepare 5 strong behavioral stories", "Study Google's engineering blog"],
    codingPatterns: ["Two Pointers", "Sliding Window", "Binary Search", "DFS/BFS", "Dynamic Programming", "Greedy", "Backtracking", "Union Find"],
    oaPattern: ["3 coding problems (Easy + 2 Medium/Hard)", "Time: 90 minutes", "Comprehensive test cases", "Partial scoring available"],
    behavioralQuestions: GOOGLE_BEHAVIORAL,
    hrQuestions: GOOGLE_HR,
    codingQuestions: GOOGLE_CODING,
    prepTime: "3-6 months",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "M",
    domain: "microsoft.com",
    industry: "Technology",
    size: "220,000+",
    founded: "1975",
    headquarters: "Redmond, WA",
    description: "Leader in enterprise software, cloud computing (Azure), and productivity tools.",
    hiringProcess: ["Online Application", "Recruiter Call", "Technical Phone Screen", "On-site (4-5 rounds)", "As Appropriate (AA) Round", "Hiring Manager Review", "Offer"],
    avgSalary: "₹12-40 LPA (India) / $100-180K (US)",
    rating: 4.3,
    culture: "Growth mindset culture. Emphasis on learn-it-all vs know-it-all. Collaborative and inclusive.",
    benefits: ["Stock grants", "Annual bonus", "Health insurance", "Gym membership", "Education budget", "Flexible work"],
    techStack: ["C#", ".NET", "TypeScript", "Azure", "React", "PowerShell", "Rust", "TypeScript"],
    interviewRounds: [
      { name: "Online Assessment", description: "2 coding problems on HackerRank.", duration: "90 min", difficulty: "Medium", tips: ["Focus on data structures", "Optimize solution", "Write clean code"] },
      { name: "Phone Screen", description: "1 coding problem + resume discussion.", duration: "45-60 min", difficulty: "Medium", tips: ["Explain thought process", "Discuss tradeoffs"] },
      { name: "On-site Coding", description: "2 problems per round.", duration: "45 min each", difficulty: "Medium-Hard", tips: ["Test thoroughly", "Handle edge cases", "Discuss complexity"] },
      { name: "System Design", description: "Distributed system design. L56+.", duration: "60 min", difficulty: "Hard", tips: ["Start with scale", "Design for reliability", "Discuss monitoring"] },
      { name: "AA Round", description: "Behavioral + leadership.", duration: "45 min", difficulty: "Medium", tips: ["Show growth mindset", "Demonstrate collaboration", "Be authentic"] },
    ],
    recentExperiences: [
      { role: "SDE II", date: "2026-02", difficulty: "Medium-Hard", outcome: "Selected", tips: "Tree and string problems. System design was notification service.", rounds: "5" },
      { role: "SDE I", date: "2025-12", difficulty: "Medium", outcome: "Selected", tips: "Arrays and linked lists. AA was very behavioral.", rounds: "5" },
    ],
    preparationTips: ["Practice on LeetCode (Microsoft tag)", "Study Azure architecture", "Prepare behavioral with STAR", "Review C#/.NET basics", "Understand distributed systems"],
    codingPatterns: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming", "Stack & Queue", "Hash Maps", "Recursion", "Sorting & Searching"],
    oaPattern: ["2 coding problems", "Time: 60-90 minutes", "Medium difficulty", "Good test case coverage"],
    behavioralQuestions: MICROSOFT_BEHAVIORAL,
    hrQuestions: MICROSOFT_HR,
    codingQuestions: MICROSOFT_CODING,
    prepTime: "2-4 months",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "A",
    domain: "amazon.com",
    industry: "Technology / E-commerce",
    size: "1,500,000+",
    founded: "1994",
    headquarters: "Seattle, WA",
    description: "World's largest e-commerce and cloud computing (AWS) company.",
    hiringProcess: ["Online Application", "OA", "Phone Screen", "On-site (5 rounds, loop)", "Bar Raiser", "Hiring Manager", "Offer"],
    avgSalary: "₹10-35 LPA (India) / $90-170K (US)",
    rating: 4.0,
    culture: "Customer obsession, ownership, bias for action, dive deep. Leadership Principles drive everything.",
    benefits: ["RSUs", "Signing bonus", "Health insurance", "401k", "Relocation", "Parental leave"],
    techStack: ["Java", "Python", "AWS Lambda", "DynamoDB", "S3", "Kubernetes", "React", "Node.js"],
    interviewRounds: [
      { name: "Online Assessment", description: "2 coding + work simulation + leadership.", duration: "120 min", difficulty: "Medium", tips: ["Time management", "Don't skip questions", "Leadership assessment matters"] },
      { name: "Phone Screen", description: "1-2 coding + behavioral (LP focused).", duration: "60 min", difficulty: "Medium", tips: ["Map answers to LPs", "Use STAR format", "Quantify impact"] },
      { name: "Loop Round 1-3", description: "Coding + deep behavioral.", duration: "45 min each", difficulty: "Medium-Hard", tips: ["2-3 stories per LP", "Be specific", "Include metrics"] },
      { name: "Loop Round 4", description: "Coding or system design.", duration: "45 min", difficulty: "Hard", tips: ["Start simple, optimize", "Discuss scalability"] },
      { name: "Bar Raiser", description: "Senior leader. Final check.", duration: "60 min", difficulty: "Hard", tips: ["Be at your best", "Show leadership", "Demonstrate long-term thinking"] },
    ],
    recentExperiences: [
      { role: "SDE II", date: "2026-03", difficulty: "Hard", outcome: "Selected", tips: "Heavy LP focus. Every question tied to leadership principles.", rounds: "5" },
      { role: "SDE I", date: "2025-10", difficulty: "Medium-Hard", outcome: "Selected", tips: "OA had tricky simulation. Bar raiser focused on Dive Deep and Ownership.", rounds: "5" },
    ],
    preparationTips: ["Memorize all 16 Leadership Principles", "Prepare 2-3 stories for EACH LP", "Practice 150+ LeetCode problems", "Study AWS services", "Practice work simulation under time pressure"],
    codingPatterns: ["Arrays", "Strings", "Hash Maps", "Stacks & Queues", "Trees", "Graphs (BFS/DFS)", "Dynamic Programming", "Sorting & Searching"],
    oaPattern: ["2 coding (Easy-Medium)", "1 Work Simulation", "1 Leadership assessment", "Time: 2 hours"],
    behavioralQuestions: AMAZON_BEHAVIORAL,
    hrQuestions: AMAZON_HR,
    codingQuestions: AMAZON_CODING,
    prepTime: "2-4 months",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "M",
    domain: "meta.com",
    industry: "Technology / Social Media",
    size: "67,000+",
    founded: "2004",
    headquarters: "Menlo Park, CA",
    description: "Leading social media and VR/AR technology company behind Facebook, Instagram, WhatsApp.",
    hiringProcess: ["Recruiter Screen", "Technical Phone Screen", "On-site (3-4 rounds)", "Team Matching", "Hiring Committee", "Offer"],
    avgSalary: "₹18-50 LPA (India) / $130-220K (US)",
    rating: 4.2,
    culture: "Move fast. Bold bets. Open communication. Impact-driven.",
    benefits: ["RSUs", "Annual bonus", "Wellness stipend", "Parental leave", "Free meals", "Transportation"],
    techStack: ["Python", "C++", "React", "GraphQL", "Hack (PHP-like)", "Thrift", "Zstd", "TAO"],
    interviewRounds: [
      { name: "Coding Round 1", description: "2 coding problems. Arrays, strings, DP.", duration: "45 min", difficulty: "Medium-Hard", tips: ["Optimize from brute force", "Use hash maps", "Discuss complexity"] },
      { name: "Coding Round 2", description: "1-2 problems. Trees, graphs.", duration: "45 min", difficulty: "Hard", tips: ["Practice graph traversal", "Know your data structures"] },
      { name: "System Design", description: "Large-scale system. Data modeling focus.", duration: "45 min", difficulty: "Hard", tips: ["Start with entities", "Discuss read/write patterns", "Scale to billions"] },
      { name: "Behavioral", description: "Impact and move-fast mentality.", duration: "45 min", difficulty: "Medium", tips: ["Show bold decisions", "Demonstrate impact", "Be direct"] },
    ],
    recentExperiences: [
      { role: "SWE E5", date: "2026-01", difficulty: "Hard", outcome: "Selected", tips: "Pure LeetCode Hard. System design was Instagram feed.", rounds: "4" },
    ],
    preparationTips: ["Solve 200+ LeetCode problems", "Focus on system design for social media scale", "Prepare stories about bold decisions", "Study Meta's engineering blog", "Practice coding under 30 min per problem"],
    codingPatterns: ["Dynamic Programming", "Graph Algorithms", "String Manipulation", "Tree Traversal", "Sliding Window", "Binary Search", "Topological Sort", "Union Find"],
    oaPattern: ["2 coding problems per round", "Focus on optimization", "No OA — direct to phone screen typically"],
    behavioralQuestions: META_BEHAVIORAL,
    hrQuestions: META_HR,
    codingQuestions: META_CODING,
    prepTime: "3-5 months",
  },
  {
    id: "tcs",
    name: "TCS",
    logo: "T",
    domain: "tcs.com",
    industry: "IT Services",
    size: "600,000+",
    founded: "1968",
    headquarters: "Mumbai, India",
    description: "India's largest IT services company. Global leader in consulting and technology services.",
    hiringProcess: ["Online Application", "TCS NQT Exam", "Technical Interview", "HR Interview", "Offer Letter"],
    avgSalary: "₹3.3-7 LPA (Freshers) / ₹8-25 LPA (Experienced)",
    rating: 3.8,
    culture: "Employee-first approach. Structured career growth. Strong training programs.",
    benefits: ["Health insurance", "Provident fund", "Gratuity", "Learning programs", "On-site opportunities"],
    techStack: ["Java", "Python", "C#", ".NET", "SAP", "Salesforce", "Mainframe", "Cloud"],
    interviewRounds: [
      { name: "TCS NQT", description: "Aptitude + coding + verbal.", duration: "180 min", difficulty: "Easy-Medium", tips: ["Practice aptitude", "Basic coding", "Manage time"] },
      { name: "Technical Interview", description: "CS fundamentals + projects.", duration: "30-45 min", difficulty: "Easy-Medium", tips: ["Know your projects", "Basic DS/Algo", "SQL queries"] },
      { name: "HR Interview", description: "Fit, relocation, salary.", duration: "15-20 min", difficulty: "Easy", tips: ["Be honest", "Show willingness", "Ask about growth"] },
    ],
    recentExperiences: [
      { role: "Assistant System Engineer", date: "2025-12", difficulty: "Easy", outcome: "Selected", tips: "NQT moderate. Technical focused on projects and Java. HR was simple.", rounds: "2" },
    ],
    preparationTips: ["Practice TCS NQT pattern", "Review CS fundamentals", "Prepare project explanations", "Basic SQL and programming", "Practice aptitude questions"],
    codingPatterns: ["Basic Loops", "Array Operations", "String Manipulation", "Simple Logic", "Pattern Printing", "Basic SQL"],
    oaPattern: ["Aptitude (quant + logical)", "Coding (2-3 easy problems)", "Verbal English", "Time: 3 hours"],
    behavioralQuestions: TCS_BEHAVIORAL,
    hrQuestions: TCS_HR,
    codingQuestions: TCS_CODING,
    prepTime: "1-2 months",
  },
  {
    id: "infosys",
    name: "Infosys",
    logo: "I",
    domain: "infosys.com",
    industry: "IT Services",
    size: "300,000+",
    founded: "1981",
    headquarters: "Bangalore, India",
    description: "Global leader in next-gen digital services and consulting.",
    hiringProcess: ["Online Application", "HackWithInfy / NQT", "Technical Interview", "HR Interview", "Offer"],
    avgSalary: "₹3.6-6.5 LPA (Freshers) / ₹8-22 LPA (Experienced)",
    rating: 3.7,
    culture: "Value system-driven. Innovation and learning focus. Strong campus connect.",
    benefits: ["Health insurance", "Retirement benefits", "Learning portal", "Global mobility"],
    techStack: ["Java", "Python", "React", "Angular", "AWS", "Azure", "Oracle", "SAP"],
    interviewRounds: [
      { name: "Online Assessment", description: "Aptitude + reasoning + programming.", duration: "120 min", difficulty: "Easy-Medium", tips: ["Practice Infosys patterns", "Logical reasoning", "Basic programming"] },
      { name: "Technical Interview", description: "CS basics + projects.", duration: "30-45 min", difficulty: "Easy-Medium", tips: ["Know your resume", "OOP concepts", "Database queries"] },
      { name: "HR Interview", description: "Fit and role alignment.", duration: "15-20 min", difficulty: "Easy", tips: ["Be genuine", "Show enthusiasm", "Ask about INFYTQ"] },
    ],
    recentExperiences: [
      { role: "Systems Engineer", date: "2025-11", difficulty: "Easy", outcome: "Selected", tips: "Online test manageable. Technical was project-focused. HR about relocation.", rounds: "2" },
    ],
    preparationTips: ["Use HackWithInfy for practice", "Review Java fundamentals", "Practice Infosys-specific aptitude", "Prepare project explanations", "Study networking and DB concepts"],
    codingPatterns: ["Basic Programming", "Pattern Printing", "Array Basics", "String Operations", "Simple Logic", "SQL Queries"],
    oaPattern: ["Quantitative Aptitude", "Logical Reasoning", "Programming (2 problems)", "Time: 2 hours"],
    behavioralQuestions: INFOSYS_BEHAVIORAL,
    hrQuestions: INFOSYS_HR,
    codingQuestions: INFOSYS_CODING,
    prepTime: "1-2 months",
  },
];

export function getCompanyById(id: string): CompanyProfile | undefined {
  return COMPANY_DATABASE.find(c => c.id === id);
}

export function searchCompanies(query: string): CompanyProfile[] {
  const q = query.toLowerCase();
  return COMPANY_DATABASE.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.industry.toLowerCase().includes(q) ||
    c.techStack.some(t => t.toLowerCase().includes(q))
  );
}

export function getCompanyReadiness(companyId: string, userSkills: string[]): { score: number; matchedTech: string[]; missingTech: string[]; tips: string[] } {
  const company = getCompanyById(companyId);
  if (!company) return { score: 0, matchedTech: [], missingTech: [], tips: [] };

  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const matchedTech = company.techStack.filter(t => userSkillsLower.some(us => us.includes(t.toLowerCase()) || t.toLowerCase().includes(us)));
  const missingTech = company.techStack.filter(t => !userSkillsLower.some(us => us.includes(t.toLowerCase()) || t.toLowerCase().includes(us)));

  const score = Math.round((matchedTech.length / Math.max(company.techStack.length, 1)) * 100);
  const tips = [
    `Study ${company.name}'s tech stack: ${company.techStack.join(", ")}`,
    `Practice ${company.codingPatterns.slice(0, 3).join(", ")}`,
    `Prepare for ${company.interviewRounds.length} interview rounds`,
    `Estimated prep time: ${company.prepTime}`,
  ];

  return { score, matchedTech, missingTech, tips };
}
