export interface InterviewQuestion {
  id: string;
  career: string;
  category: string;
  question: string;
  answer: string;
  tips: string[];
  difficulty: "easy" | "medium" | "hard";
}

export const INTERVIEW_DATABASE: InterviewQuestion[] = [
  // Software Engineer
  { id: "se1", career: "Software Engineer", category: "Technical", question: "Explain the difference between a stack and a queue. When would you use each?", answer: "A stack is LIFO (Last In First Out) — think of a pile of plates. A queue is FIFO (First In First Out) — like a line at a shop. Use stacks for undo operations, function calls, and backtracking. Use queues for BFS, task scheduling, and buffering.", tips: ["Draw diagrams to explain", "Give real-world examples", "Mention time complexity O(1) for both"], difficulty: "easy" },
  { id: "se2", career: "Software Engineer", category: "Technical", question: "How do you handle merge conflicts in Git?", answer: "Pull the latest changes, Git will mark conflicts. Open conflicted files, choose which changes to keep (or combine them), remove conflict markers, then commit. Use 'git merge --abort' if you want to start over.", tips: ["Communicate with your team", "Pull before you push", "Use feature branches to minimize conflicts"], difficulty: "easy" },
  { id: "se3", career: "Software Engineer", category: "Behavioral", question: "Tell me about a time you had to debug a difficult issue.", answer: "Use the STAR method: Situation (what was the problem), Task (what needed to be fixed), Action (steps you took to debug), Result (how you resolved it and what you learned).", tips: ["Be specific about tools used", "Mention what you learned", "Show systematic approach"], difficulty: "medium" },
  { id: "se4", career: "Software Engineer", category: "System Design", question: "Design a URL shortener like bit.ly. Walk me through the architecture.", answer: "Key components: 1) API layer (REST/GraphQL), 2) Shortening service (hash function or counter), 3) Database (key-value store like Redis for fast lookups), 4) Redirect service (301/302 redirect), 5) Analytics (click tracking). Consider: rate limiting, custom aliases, expiration, and scaling.", tips: ["Start with requirements", "Draw the architecture", "Discuss trade-offs", "Mention scalability"], difficulty: "hard" },
  { id: "se5", career: "Software Engineer", category: "Behavioral", question: "Describe a project you're most proud of. What made it challenging?", answer: "Focus on: technical complexity, team collaboration, learning new technologies, and business impact. Quantify results where possible.", tips: ["Show passion", "Highlight problem-solving", "Mention team contribution"], difficulty: "medium" },

  // Data Scientist
  { id: "ds1", career: "Data Scientist", category: "Technical", question: "Explain the bias-variance tradeoff in machine learning.", answer: "Bias is error from wrong assumptions (underfitting). Variance is error from sensitivity to training data (overfitting). High bias = simple model that misses patterns. High variance = complex model that memorizes noise. Goal: find the sweet spot where total error is minimized.", tips: ["Use visual examples", "Mention regularization techniques", "Discuss cross-validation"], difficulty: "medium" },
  { id: "ds2", career: "Data Scientist", category: "Technical", question: "How would you handle missing data in a dataset?", answer: "1) Understand why data is missing (MCAR, MAR, MNAR). 2) For small amounts: drop rows. 3) For numeric: mean/median imputation, or KNN imputation. 4) For categorical: mode imputation or 'Unknown' category. 5) Advanced: MICE, predictive imputation. 6) Always document your approach.", tips: ["Don't just drop data blindly", "Visualize missing patterns", "Consider domain knowledge"], difficulty: "medium" },
  { id: "ds3", career: "Data Scientist", category: "Case Study", question: "A company's user retention dropped 15% last month. How would you investigate?", answer: "1) Segment users by cohort, demographics, platform. 2) Analyze funnel metrics (where do users drop off?). 3) Check for external factors (competitor launch, pricing change). 4) Run correlation analysis with features. 5) A/B test potential solutions. 6) Build a churn prediction model.", tips: ["Start with data exploration", "Ask clarifying questions", "Propose actionable solutions"], difficulty: "hard" },
  { id: "ds4", career: "Data Scientist", category: "Behavioral", question: "Tell me about a time you had to communicate a complex analysis to non-technical stakeholders.", answer: "Focus on: simplifying technical concepts, using visualizations, telling a story with data, and focusing on business impact rather than methodology.", tips: ["Use analogies", "Lead with the 'so what'", "Show business impact"], difficulty: "medium" },

  // UX/UI Designer
  { id: "ux1", career: "UX/UI Designer", category: "Portfolio", question: "Walk me through your design process for a recent project.", answer: "1) Research (user interviews, competitive analysis), 2) Define (personas, user journeys, problem statement), 3) Ideate (wireframes, sketches, brainstorming), 4) Prototype (high-fidelity mockups, interactive prototypes), 5) Test (usability testing, iterate based on feedback).", tips: ["Show your thinking process", "Mention user research findings", "Discuss iterations based on feedback"], difficulty: "medium" },
  { id: "ux2", career: "UX/UI Designer", category: "Design", question: "How do you design for accessibility?", answer: "1) Color contrast (WCAG AA minimum 4.5:1), 2) Keyboard navigation, 3) Screen reader compatibility (semantic HTML, ARIA labels), 4) Clear focus states, 5) Sufficient touch targets (44px minimum), 6) Alt text for images, 7) Captions for video.", tips: ["Know WCAG guidelines", "Use accessibility testing tools", "Test with actual assistive technology"], difficulty: "medium" },
  { id: "ux3", career: "UX/UI Designer", category: "Behavioral", question: "How do you handle disagreements with developers about design feasibility?", answer: "1) Listen to their technical constraints, 2) Understand the 'why' behind the constraint, 3) Propose alternatives that meet both UX goals and technical reality, 4) Prototype to prove concepts, 5) Prioritize based on user impact vs. technical effort.", tips: ["Show collaboration skills", "Be open to alternatives", "Focus on user outcomes"], difficulty: "medium" },

  // Product Manager
  { id: "pm1", career: "Product Manager", category: "Strategy", question: "How would you prioritize features for a new product launch?", answer: "Use frameworks like RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must/Should/Could/Won't), or ICE scoring. Consider: user impact, business value, technical feasibility, and strategic alignment. Involve stakeholders and validate with data.", tips: ["Know multiple frameworks", "Show data-driven thinking", "Mention stakeholder alignment"], difficulty: "hard" },
  { id: "pm2", career: "Product Manager", category: "Technical", question: "How do you work with engineering teams when you don't have a technical background?", answer: "1) Learn the basics of your tech stack, 2) Focus on 'what' and 'why' rather than 'how', 3) Ask engineers to explain trade-offs in plain language, 4) Use technical advisors, 5) Write clear PRDs with acceptance criteria.", tips: ["Show humility and curiosity", "Build trust with engineers", "Focus on user problems"], difficulty: "medium" },

  // Cybersecurity Analyst
  { id: "cs1", career: "Cybersecurity Analyst", category: "Technical", question: "What is the CIA triad and why is it important?", answer: "Confidentiality (only authorized access), Integrity (data isn't tampered), Availability (systems are accessible). It's the foundation of information security. Every security control maps to one or more of these principles.", tips: ["Give examples of each", "Mention related controls", "Discuss real-world breaches"], difficulty: "easy" },
  { id: "cs2", career: "Cybersecurity Analyst", category: "Scenario", question: "A user reports they clicked a suspicious link in an email. What steps do you take?", answer: "1) Isolate the device from network, 2) Check for malware/ransomware, 3) Review email headers for phishing indicators, 4) Check if credentials were entered and rotate them, 5) Scan for lateral movement, 6) Document the incident, 7) Educate the user.", tips: ["Have an incident response plan", "Stay calm and methodical", "Document everything"], difficulty: "medium" },

  // General / All Careers
  { id: "g1", career: "General", category: "Behavioral", question: "Why should we hire you?", answer: "Focus on: 1) Your unique combination of skills, 2) Specific examples of relevant achievements, 3) How your values align with the company, 4) What you can contribute that others can't.", tips: ["Be specific, not generic", "Quantify achievements", "Research the company"], difficulty: "easy" },
  { id: "g2", career: "General", category: "Behavioral", question: "Tell me about a failure and what you learned from it.", answer: "Be honest about a real failure. Focus 70% on what you learned and 30% on the failure itself. Show growth mindset and specific changes you made as a result.", tips: ["Choose a real example", "Focus on learning", "Show self-awareness"], difficulty: "medium" },
  { id: "g3", career: "General", category: "Behavioral", question: "Where do you see yourself in 5 years?", answer: "Show ambition aligned with the role. Example: 'In 5 years, I see myself having grown into a senior role where I can lead projects and mentor junior team members, while deepening my expertise in [relevant area].'", tips: ["Align with company growth", "Show commitment", "Be realistic"], difficulty: "easy" },
  { id: "g4", career: "General", category: "Behavioral", question: "How do you handle stress and tight deadlines?", answer: "Give specific examples: prioritization systems, communication with stakeholders, breaking work into smaller tasks, knowing when to ask for help. Show you stay productive under pressure.", tips: ["Give concrete examples", "Show you don't burn out", "Mention work-life balance"], difficulty: "easy" },
];

export function getInterviewQuestions(career: string): InterviewQuestion[] {
  const careerLower = career.toLowerCase();
  return INTERVIEW_DATABASE.filter(q =>
    q.career.toLowerCase() === careerLower || q.career === "General"
  );
}

export function getAllCareerCategories(): string[] {
  return [...new Set(INTERVIEW_DATABASE.map(q => q.career))].filter(c => c !== "General");
}

export function getQuestionsByCategory(category: string): InterviewQuestion[] {
  return INTERVIEW_DATABASE.filter(q => q.category === category);
}
