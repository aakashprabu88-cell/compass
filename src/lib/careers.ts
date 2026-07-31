interface CareerData {
  title: string;
  slug: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  growthOutlook: string;
  aiRisk: string;
  aiRiskScore: number;
  requiredSkills: string[];
  industries: string[];
  educationLevel: string;
  timeToEntry: string;
  keyTasks: string[];
  futureOutlook: string;
}

export const CAREER_DATABASE: CareerData[] = [
  {
    title: "AI/Machine Learning Engineer",
    slug: "ai-ml-engineer",
    description: "Design and build intelligent systems that learn from data. Work on cutting-edge AI models, neural networks, and autonomous systems.",
    salaryMin: 120000, salaryMax: 250000,
    growthOutlook: "booming", aiRisk: "none", aiRiskScore: 0.05,
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "Mathematics", "Data Engineering", "PyTorch", "TensorFlow"],
    industries: ["Technology", "Healthcare", "Finance", "Automotive"],
    educationLevel: "masters", timeToEntry: "6+ years",
    keyTasks: ["Design ML pipelines", "Train and optimize models", "Deploy AI systems", "Research new techniques"],
    futureOutlook: "Demand will continue to explode as every industry adopts AI. One of the safest careers for the next 20+ years."
  },
  {
    title: "Software Engineer",
    slug: "software-engineer",
    description: "Build, test, and maintain software applications. Work across the full stack from user interfaces to backend systems.",
    salaryMin: 90000, salaryMax: 200000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.2,
    requiredSkills: ["Programming", "Problem Solving", "System Design", "Git", "Testing", "Communication"],
    industries: ["Technology", "Finance", "Healthcare", "E-commerce", "Entertainment"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Write clean code", "Design systems", "Debug issues", "Collaborate with teams"],
    futureOutlook: "Core role that adapts with technology. AI tools will enhance productivity, not replace engineers. Strong long-term outlook."
  },
  {
    title: "Data Scientist",
    slug: "data-scientist",
    description: "Extract insights from complex datasets using statistics, ML, and visualization to drive business decisions.",
    salaryMin: 95000, salaryMax: 180000,
    growthOutlook: "growing", aiRisk: "medium", aiRiskScore: 0.35,
    requiredSkills: ["Statistics", "Python", "SQL", "Data Visualization", "Machine Learning", "Business Acumen"],
    industries: ["Technology", "Finance", "Healthcare", "Retail", "Marketing"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Analyze datasets", "Build predictive models", "Create dashboards", "Present findings"],
    futureOutlook: "AI will automate routine analysis but strategic thinking and domain expertise remain human strengths."
  },
  {
    title: "UX/UI Designer",
    slug: "ux-ui-designer",
    description: "Create intuitive, beautiful digital experiences. Research user needs and design interfaces that solve real problems.",
    salaryMin: 75000, salaryMax: 150000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Design Thinking", "Figma", "User Research", "Prototyping", "Visual Design", "Empathy"],
    industries: ["Technology", "E-commerce", "Healthcare", "Finance", "Entertainment"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Conduct user research", "Design interfaces", "Create prototypes", "Test with users"],
    futureOutlook: "Human empathy and creativity are essential. AI assists with routine tasks but cannot replace user understanding."
  },
  {
    title: "Product Manager",
    slug: "product-manager",
    description: "Lead cross-functional teams to build products customers love. Bridge business strategy with technical execution.",
    salaryMin: 100000, salaryMax: 190000,
    growthOutlook: "stable", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Strategy", "Communication", "Data Analysis", "User Empathy", "Leadership", "Technical Understanding"],
    industries: ["Technology", "E-commerce", "Finance", "Healthcare"],
    educationLevel: "bachelors", timeToEntry: "4+ years",
    keyTasks: ["Define product vision", "Prioritize features", "Lead teams", "Analyze metrics"],
    futureOutlook: "Requires deep human judgment about what people need. AI can inform decisions but not replace strategic thinking."
  },
  {
    title: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    description: "Protect organizations from digital threats. Monitor systems, investigate incidents, and build security defenses.",
    salaryMin: 80000, salaryMax: 160000,
    growthOutlook: "booming", aiRisk: "none", aiRiskScore: 0.05,
    requiredSkills: ["Network Security", "Incident Response", "Risk Assessment", "Programming", "Forensics"],
    industries: ["Technology", "Finance", "Government", "Healthcare", "Defense"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Monitor threats", "Investigate breaches", "Implement defenses", "Train employees"],
    futureOutlook: "Growing faster than any other field. AI creates new threats that need human defenders. Massive talent shortage."
  },
  {
    title: "Digital Marketing Specialist",
    slug: "digital-marketing",
    description: "Drive brand awareness and customer acquisition through digital channels. Manage campaigns across social, search, and email.",
    salaryMin: 55000, salaryMax: 110000,
    growthOutlook: "stable", aiRisk: "high", aiRiskScore: 0.6,
    requiredSkills: ["SEO", "Content Strategy", "Analytics", "Social Media", "Copywriting", "Advertising"],
    industries: ["Marketing", "E-commerce", "Technology", "Media"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Manage campaigns", "Analyze performance", "Create content", "Optimize channels"],
    futureOutlook: "AI will automate routine tasks (ad placement, A/B testing). Strategic brand thinking remains human."
  },
  {
    title: "Financial Analyst",
    slug: "financial-analyst",
    description: "Analyze financial data, create models, and provide investment guidance to organizations and individuals.",
    salaryMin: 70000, salaryMax: 150000,
    growthOutlook: "stable", aiRisk: "high", aiRiskScore: 0.55,
    requiredSkills: ["Financial Modeling", "Excel", "Accounting", "Statistics", "Communication", "Industry Knowledge"],
    industries: ["Finance", "Insurance", "Technology", "Government"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Build financial models", "Analyze markets", "Prepare reports", "Advise clients"],
    futureOutlook: "AI handles routine analysis. Client relationships and strategic advice remain human strengths."
  },
  {
    title: "Content Creator/Influencer",
    slug: "content-creator",
    description: "Create engaging content across video, written, and audio platforms. Build audiences and monetize creativity.",
    salaryMin: 30000, salaryMax: 200000,
    growthOutlook: "growing", aiRisk: "medium", aiRiskScore: 0.4,
    requiredSkills: ["Content Creation", "Video Editing", "Storytelling", "Social Media", "Personal Branding"],
    industries: ["Media", "Entertainment", "Marketing", "Education"],
    educationLevel: "none", timeToEntry: "0 years",
    keyTasks: ["Create content", "Build audience", "Collaborate with brands", "Analyze performance"],
    futureOutlook: "AI generates content but authenticity and personal connection remain human. Competition is fierce."
  },
  {
    title: "Teacher/Educator",
    slug: "teacher",
    description: "Inspire and educate the next generation. Design curricula, deliver lessons, and support student growth.",
    salaryMin: 40000, salaryMax: 85000,
    growthOutlook: "stable", aiRisk: "low", aiRiskScore: 0.1,
    requiredSkills: ["Subject Expertise", "Communication", "Patience", "Creativity", "Classroom Management", "Empathy"],
    industries: ["Education", "Government", "Non-profit"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Design lessons", "Teach classes", "Assess progress", "Support students"],
    futureOutlook: "AI tutoring supplements but cannot replace human inspiration and mentorship. Chronic teacher shortage."
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    description: "Plan, execute, and deliver projects on time and budget. Coordinate teams and manage stakeholder expectations.",
    salaryMin: 75000, salaryMax: 140000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.3,
    requiredSkills: ["Organization", "Communication", "Leadership", "Risk Management", "Budgeting", "Agile"],
    industries: ["Technology", "Construction", "Finance", "Healthcare"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Plan projects", "Coordinate teams", "Manage budgets", "Report progress"],
    futureOutlook: "AI automates scheduling and tracking. Human leadership and stakeholder management remain essential."
  },
  {
    title: "Mechanical Engineer",
    slug: "mechanical-engineer",
    description: "Design, build, and test mechanical systems from engines to robots to HVAC systems.",
    salaryMin: 75000, salaryMax: 140000,
    growthOutlook: "stable", aiRisk: "low", aiRiskScore: 0.2,
    requiredSkills: ["CAD", "Physics", "Mathematics", "Problem Solving", "Prototyping", "Manufacturing"],
    industries: ["Automotive", "Aerospace", "Manufacturing", "Energy"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Design components", "Run simulations", "Build prototypes", "Test systems"],
    futureOutlook: "AI assists design but physical engineering and hands-on problem solving require human expertise."
  },
  {
    title: "Graphic Designer",
    slug: "graphic-designer",
    description: "Create visual concepts to communicate ideas through print and digital media.",
    salaryMin: 45000, salaryMax: 90000,
    growthOutlook: "declining", aiRisk: "high", aiRiskScore: 0.65,
    requiredSkills: ["Adobe Creative Suite", "Typography", "Color Theory", "Layout Design", "Branding"],
    industries: ["Marketing", "Media", "Technology", "Publishing"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Design visuals", "Create brand identities", "Produce layouts", "Collaborate with teams"],
    futureOutlook: "AI image generation is disrupting routine design work. Strategic brand thinking and art direction remain human."
  },
  {
    title: "Civil Engineer",
    slug: "civil-engineer",
    description: "Design, build, and maintain infrastructure like roads, bridges, buildings, and water systems.",
    salaryMin: 70000, salaryMax: 130000,
    growthOutlook: "stable", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Structural Analysis", "CAD", "Project Management", "Physics", "Regulations"],
    industries: ["Construction", "Government", "Consulting"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Design structures", "Inspect sites", "Ensure compliance", "Manage projects"],
    futureOutlook: "Infrastructure investment is growing worldwide. AI assists design but construction requires human oversight."
  },
  {
    title: "Journalist/Reporter",
    slug: "journalist",
    description: "Research, write, and report news and stories. Investigate issues and inform the public.",
    salaryMin: 35000, salaryMax: 80000,
    growthOutlook: "declining", aiRisk: "high", aiRiskScore: 0.55,
    requiredSkills: ["Writing", "Research", "Interviewing", "Critical Thinking", "Ethics", "Multimedia"],
    industries: ["Media", "Publishing", "Digital News"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Research stories", "Conduct interviews", "Write articles", "Produce content"],
    futureOutlook: "AI generates routine news but investigative journalism and human storytelling remain essential."
  },
  {
    title: "Cybersecurity Engineer",
    slug: "cybersecurity-engineer",
    description: "Design and build secure systems. Develop security architecture and respond to sophisticated threats.",
    salaryMin: 110000, salaryMax: 200000,
    growthOutlook: "booming", aiRisk: "none", aiRiskScore: 0.05,
    requiredSkills: ["Security Architecture", "Penetration Testing", "Programming", "Cloud Security", "Cryptography"],
    industries: ["Technology", "Finance", "Government", "Defense"],
    educationLevel: "bachelors", timeToEntry: "4+ years",
    keyTasks: ["Design security systems", "Test vulnerabilities", "Build defenses", "Lead incident response"],
    futureOutlook: "Massive talent shortage. AI creates new attack vectors that need human defenders."
  },
  {
    title: "Marketing Manager",
    slug: "marketing-manager",
    description: "Develop marketing strategies, manage campaigns, and drive brand growth across channels.",
    salaryMin: 80000, salaryMax: 160000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.35,
    requiredSkills: ["Strategy", "Brand Management", "Analytics", "Leadership", "Creativity", "Communication"],
    industries: ["Marketing", "Technology", "Consumer Goods", "Media"],
    educationLevel: "bachelors", timeToEntry: "4+ years",
    keyTasks: ["Develop strategy", "Manage budgets", "Lead teams", "Drive growth"],
    futureOutlook: "AI handles execution. Strategy, brand vision, and team leadership remain human."
  },
  {
    title: "Accountant",
    slug: "accountant",
    description: "Manage financial records, prepare tax returns, and ensure regulatory compliance for organizations.",
    salaryMin: 55000, salaryMax: 120000,
    growthOutlook: "declining", aiRisk: "high", aiRiskScore: 0.6,
    requiredSkills: ["Accounting", "Excel", "Tax Law", "Attention to Detail", "Regulations"],
    industries: ["Finance", "Government", "Technology", "Healthcare"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Prepare financial statements", "File taxes", "Audit records", "Advise on compliance"],
    futureOutlook: "AI automates routine accounting. Advisory and strategic roles remain. Shrinking traditional demand."
  },
  {
    title: "Research Scientist",
    slug: "research-scientist",
    description: "Conduct original research to advance knowledge in physics, biology, chemistry, or related fields.",
    salaryMin: 80000, salaryMax: 150000,
    growthOutlook: "stable", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Scientific Method", "Statistics", "Writing", "Critical Thinking", "Lab Skills"],
    industries: ["Academia", "Pharmaceutical", "Technology", "Government"],
    educationLevel: "doctorate", timeToEntry: "8+ years",
    keyTasks: ["Design experiments", "Analyze data", "Write papers", "Secure funding"],
    futureOutlook: "AI accelerates research but hypothesis generation, experimental design, and interpretation remain human."
  },
  {
    title: "Customer Service Representative",
    slug: "customer-service",
    description: "Handle customer inquiries, resolve issues, and provide support via phone, email, or chat.",
    salaryMin: 30000, salaryMax: 50000,
    growthOutlook: "declining", aiRisk: "critical", aiRiskScore: 0.8,
    requiredSkills: ["Communication", "Patience", "Problem Solving", "Empathy", "Product Knowledge"],
    industries: ["Retail", "Technology", "Healthcare", "Finance"],
    educationLevel: "none", timeToEntry: "0 years",
    keyTasks: ["Handle inquiries", "Resolve issues", "Document interactions", "Escalate problems"],
    futureOutlook: "AI chatbots and voice agents are rapidly replacing routine customer service. Complex cases still need humans."
  },
  {
    title: "Sustainability Consultant",
    slug: "sustainability-consultant",
    description: "Help organizations reduce environmental impact and implement sustainable practices.",
    salaryMin: 60000, salaryMax: 120000,
    growthOutlook: "booming", aiRisk: "low", aiRiskScore: 0.1,
    requiredSkills: ["Environmental Science", "Business Strategy", "Data Analysis", "Communication", "Regulations"],
    industries: ["Consulting", "Energy", "Manufacturing", "Government"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Assess impact", "Develop strategies", "Implement solutions", "Report progress"],
    futureOutlook: "Climate regulations driving massive demand. Requires human judgment and stakeholder management."
  },
  {
    title: "Data Entry Clerk",
    slug: "data-entry",
    description: "Input, verify, and maintain data in computer systems and databases.",
    salaryMin: 28000, salaryMax: 42000,
    growthOutlook: "declining", aiRisk: "critical", aiRiskScore: 0.9,
    requiredSkills: ["Typing", "Attention to Detail", "Data Entry Software"],
    industries: ["Healthcare", "Finance", "Government", "Retail"],
    educationLevel: "none", timeToEntry: "0 years",
    keyTasks: ["Enter data", "Verify accuracy", "Maintain records"],
    futureOutlook: "One of the most at-risk careers. OCR and AI automation are rapidly eliminating these roles."
  },
  {
    title: "UX Researcher",
    slug: "ux-researcher",
    description: "Conduct user research to understand behavior, needs, and motivations. Drive product decisions with insights.",
    salaryMin: 85000, salaryMax: 160000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.1,
    requiredSkills: ["User Research", "Statistics", "Empathy", "Interviewing", "Analysis", "Presentation"],
    industries: ["Technology", "E-commerce", "Healthcare", "Finance"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Conduct interviews", "Run studies", "Analyze data", "Present insights"],
    futureOutlook: "Deeply human role requiring empathy and nuanced understanding. Growing demand as companies focus on users."
  },
  {
    title: "Supply Chain Manager",
    slug: "supply-chain-manager",
    description: "Oversee the flow of goods from raw materials to customers. Optimize logistics and operations.",
    salaryMin: 75000, salaryMax: 140000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.3,
    requiredSkills: ["Logistics", "Data Analysis", "Negotiation", "Leadership", "ERP Systems"],
    industries: ["Manufacturing", "Retail", "Technology", "Healthcare"],
    educationLevel: "bachelors", timeToEntry: "4+ years",
    keyTasks: ["Optimize logistics", "Manage suppliers", "Reduce costs", "Forecast demand"],
    futureOutlook: "AI optimizes routine decisions. Strategic supplier relationships and crisis management remain human."
  },
  {
    title: "Healthcare Provider (Nurse/Doctor)",
    slug: "healthcare-provider",
    description: "Provide direct patient care in hospitals, clinics, or community settings. Diagnose, treat, and support patients.",
    salaryMin: 65000, salaryMax: 250000,
    growthOutlook: "booming", aiRisk: "none", aiRiskScore: 0.02,
    requiredSkills: ["Medical Knowledge", "Empathy", "Communication", "Critical Thinking", "Teamwork", "Patient Care"],
    industries: ["Healthcare", "Government", "Education"],
    educationLevel: "bachelors", timeToEntry: "4-12 years",
    keyTasks: ["Diagnose conditions", "Provide treatment", "Support patients", "Collaborate with teams"],
    futureOutlook: "Aging populations guarantee growing demand. AI assists diagnostics but cannot replace human care and judgment."
  },
  {
    title: "Electrician/Trades Professional",
    slug: "electrician",
    description: "Install, maintain, and repair electrical systems in homes, businesses, and infrastructure.",
    salaryMin: 50000, salaryMax: 95000,
    growthOutlook: "growing", aiRisk: "none", aiRiskScore: 0.01,
    requiredSkills: ["Electrical Systems", "Problem Solving", "Physical Dexterity", "Safety", "Blueprint Reading"],
    industries: ["Construction", "Manufacturing", "Utilities", "Maintenance"],
    educationLevel: "trade_school", timeToEntry: "2-4 years",
    keyTasks: ["Install wiring", "Diagnose faults", "Maintain systems", "Ensure safety compliance"],
    futureOutlook: "Physical labor cannot be automated. Green energy transition is creating massive new demand."
  },
  {
    title: "Lawyer",
    slug: "lawyer",
    description: "Advise clients on legal matters, represent them in court, and navigate complex legal systems.",
    salaryMin: 80000, salaryMax: 200000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.35,
    requiredSkills: ["Legal Knowledge", "Critical Thinking", "Writing", "Negotiation", "Research", "Ethics"],
    industries: ["Legal", "Finance", "Technology", "Government"],
    educationLevel: "doctorate", timeToEntry: "7+ years",
    keyTasks: ["Research cases", "Draft documents", "Negotiate settlements", "Represent in court"],
    futureOutlook: "AI handles document review and research. Client counsel, courtroom strategy, and ethics remain human."
  },
  {
    title: "Social Worker",
    slug: "social-worker",
    description: "Help individuals and families navigate challenges like poverty, abuse, and mental health issues.",
    salaryMin: 42000, salaryMax: 75000,
    growthOutlook: "growing", aiRisk: "none", aiRiskScore: 0.02,
    requiredSkills: ["Empathy", "Communication", "Advocacy", "Crisis Management", "Cultural Competence"],
    industries: ["Healthcare", "Government", "Non-profit", "Education"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Assess needs", "Connect to resources", "Provide counseling", "Advocate for clients"],
    futureOutlook: "Deeply human role that requires empathy, judgment, and cultural understanding. Growing demand."
  },
  {
    title: "Chef/Culinary Professional",
    slug: "chef",
    description: "Create menus, prepare meals, and lead kitchen teams in restaurants, hotels, or catering.",
    salaryMin: 35000, salaryMax: 85000,
    growthOutlook: "stable", aiRisk: "none", aiRiskScore: 0.01,
    requiredSkills: ["Culinary Skills", "Creativity", "Time Management", "Leadership", "Food Safety"],
    industries: ["Food & Beverage", "Hospitality", "Entertainment"],
    educationLevel: "trade_school", timeToEntry: "1-2 years",
    keyTasks: ["Design menus", "Prepare dishes", "Manage kitchen", "Train staff"],
    futureOutlook: "Physical, creative work that cannot be automated. Growing demand in food culture."
  },
  {
    title: "Pharmacist",
    slug: "pharmacist",
    description: "Dispense medications, advise patients on drug use, and ensure safe pharmaceutical practices.",
    salaryMin: 110000, salaryMax: 150000,
    growthOutlook: "declining", aiRisk: "medium", aiRiskScore: 0.4,
    requiredSkills: ["Pharmacology", "Attention to Detail", "Communication", "Patient Care", "Chemistry"],
    industries: ["Healthcare", "Retail", "Pharmaceutical"],
    educationLevel: "doctorate", timeToEntry: "8 years",
    keyTasks: ["Dispense medications", "Advise patients", "Check interactions", "Manage inventory"],
    futureOutlook: "Automation of dispensing is growing. Patient counseling and clinical services remain human."
  },
  {
    title: "Physical Therapist",
    slug: "physical-therapist",
    description: "Help patients recover from injuries and manage pain through exercise, manual therapy, and education.",
    salaryMin: 75000, salaryMax: 110000,
    growthOutlook: "booming", aiRisk: "none", aiRiskScore: 0.02,
    requiredSkills: ["Anatomy", "Manual Therapy", "Empathy", "Exercise Design", "Communication"],
    industries: ["Healthcare", "Sports", "Rehabilitation"],
    educationLevel: "doctorate", timeToEntry: "7+ years",
    keyTasks: ["Assess patients", "Design treatment plans", "Provide therapy", "Track progress"],
    futureOutlook: "Aging population and sports medicine drive demand. Fully human, hands-on role."
  },
  {
    title: "Paralegal",
    slug: "paralegal",
    description: "Assist lawyers with research, document preparation, and case management.",
    salaryMin: 45000, salaryMax: 75000,
    growthOutlook: "declining", aiRisk: "high", aiRiskScore: 0.6,
    requiredSkills: ["Legal Research", "Writing", "Organization", "Attention to Detail", "Legal Software"],
    industries: ["Legal", "Government", "Corporate"],
    educationLevel: "associates", timeToEntry: "2 years",
    keyTasks: ["Research cases", "Prepare documents", "Organize files", "Support lawyers"],
    futureOutlook: "AI handles document review and research. Some roles shift to AI supervision."
  },
  {
    title: "Radiologist",
    slug: "radiologist",
    description: "Interpret medical images like X-rays, CT scans, and MRIs to diagnose conditions.",
    salaryMin: 250000, salaryMax: 500000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.4,
    requiredSkills: ["Medical Imaging", "Diagnosis", "Attention to Detail", "Medical Knowledge"],
    industries: ["Healthcare", "Research"],
    educationLevel: "doctorate", timeToEntry: "13+ years",
    keyTasks: ["Interpret scans", "Write reports", "Consult with clinicians", "Guide procedures"],
    futureOutlook: "AI excels at image detection but complex cases, clinical context, and patient communication remain human."
  },
  {
    title: "HR Manager",
    slug: "hr-manager",
    description: "Manage recruitment, employee relations, compensation, and company culture.",
    salaryMin: 65000, salaryMax: 130000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Communication", "Recruitment", "Leadership", "Empathy", "Employment Law", "Organization"],
    industries: ["Technology", "Healthcare", "Retail", "Finance", "Manufacturing"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Recruit talent", "Manage payroll", "Handle disputes", "Build culture"],
    futureOutlook: "People management and culture-building are deeply human. AI handles resume screening, not relationship building."
  },
  {
    title: "Business Analyst",
    slug: "business-analyst",
    description: "Bridge business needs and technical solutions by analyzing processes, gathering requirements, and driving improvements.",
    salaryMin: 70000, salaryMax: 130000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.2,
    requiredSkills: ["Data Analysis", "Communication", "Process Modeling", "SQL", "Problem Solving", "Documentation"],
    industries: ["Technology", "Finance", "Consulting", "Healthcare", "Retail"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Gather requirements", "Analyze processes", "Create documentation", "Coordinate stakeholders"],
    futureOutlook: "AI supports analysis, but stakeholder engagement and process judgment remain human strengths."
  },
  {
    title: "Architect",
    slug: "architect",
    description: "Design buildings and spaces that are functional, safe, and beautiful.",
    salaryMin: 70000, salaryMax: 140000,
    growthOutlook: "growing", aiRisk: "low", aiRiskScore: 0.15,
    requiredSkills: ["Design", "CAD", "Structural Knowledge", "Creativity", "Project Management", "Regulations"],
    industries: ["Architecture", "Construction", "Real Estate", "Government"],
    educationLevel: "bachelors", timeToEntry: "5 years",
    keyTasks: ["Design buildings", "Create blueprints", "Oversee construction", "Coordinate clients"],
    futureOutlook: "AI assists with drafting and visualization. Spatial creativity and client relationships remain human."
  },
  {
    title: "Psychologist",
    slug: "psychologist",
    description: "Study human behavior and mental processes. Provide therapy and conduct research on mental health.",
    salaryMin: 60000, salaryMax: 120000,
    growthOutlook: "growing", aiRisk: "none", aiRiskScore: 0.02,
    requiredSkills: ["Psychology", "Empathy", "Research", "Communication", "Observation", "Ethics"],
    industries: ["Healthcare", "Education", "Corporate", "Government"],
    educationLevel: "masters", timeToEntry: "6+ years",
    keyTasks: ["Counsel clients", "Conduct therapy", "Assess behavior", "Research cognition"],
    futureOutlook: "Deeply human role centered on trust and empathy. Growing mental health demand worldwide."
  },
  {
    title: "Dentist",
    slug: "dentist",
    description: "Diagnose and treat oral health conditions, perform procedures, and educate patients on dental care.",
    salaryMin: 120000, salaryMax: 250000,
    growthOutlook: "growing", aiRisk: "none", aiRiskScore: 0.02,
    requiredSkills: ["Dentistry", "Anatomy", "Patient Care", "Attention to Detail", "Manual Dexterity"],
    industries: ["Healthcare", "Private Practice"],
    educationLevel: "doctorate", timeToEntry: "8+ years",
    keyTasks: ["Examine patients", "Perform procedures", "Plan treatments", "Educate patients"],
    futureOutlook: "Precise, hands-on clinical work that cannot be automated. Stable, growing demand."
  },
  {
    title: "Content Writer",
    slug: "content-writer",
    description: "Produce engaging written content for websites, blogs, marketing, and documentation.",
    salaryMin: 35000, salaryMax: 85000,
    growthOutlook: "growing", aiRisk: "medium", aiRiskScore: 0.4,
    requiredSkills: ["Writing", "SEO", "Research", "Editing", "Grammar", "Creativity"],
    industries: ["Marketing", "Media", "Technology", "Publishing"],
    educationLevel: "bachelors", timeToEntry: "2-4 years",
    keyTasks: ["Write articles", "Optimize for SEO", "Edit content", "Research topics"],
    futureOutlook: "AI drafts quickly but human voice, research depth, and brand authenticity remain valued."
  },
  {
    title: "Sales Manager",
    slug: "sales-manager",
    description: "Lead sales teams, build client relationships, and drive revenue growth.",
    salaryMin: 60000, salaryMax: 150000,
    growthOutlook: "stable", aiRisk: "medium", aiRiskScore: 0.3,
    requiredSkills: ["Communication", "Negotiation", "Leadership", "CRM", "Relationship Management", "Strategy"],
    industries: ["Technology", "Retail", "Finance", "Pharmaceutical", "Real Estate"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Lead teams", "Close deals", "Build relationships", "Forecast revenue"],
    futureOutlook: "Relationship-based selling survives automation. Trust and empathy remain core human strengths."
  },
  {
    title: "Interior Designer",
    slug: "interior-designer",
    description: "Design functional and beautiful indoor spaces for homes, offices, and commercial venues.",
    salaryMin: 45000, salaryMax: 100000,
    growthOutlook: "growing", aiRisk: "medium", aiRiskScore: 0.35,
    requiredSkills: ["Design", "Space Planning", "Color Theory", "CAD", "Creativity", "Communication"],
    industries: ["Design", "Real Estate", "Construction", "Hospitality"],
    educationLevel: "bachelors", timeToEntry: "4 years",
    keyTasks: ["Plan layouts", "Select materials", "Create renders", "Coordinate vendors"],
    futureOutlook: "AI generates layouts, but client taste, spatial judgment, and personalized creativity remain human."
  },
];

// Concrete tech/tool keywords users type, mapped to careers by slug.
// `requiredSkills` above are generic competencies; these are the actual
// technologies that make skill matching meaningful.
export const TECH_ALIASES: Record<string, string[]> = {
  "ai-ml-engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "NumPy", "Pandas", "scikit-learn", "LLM", "GenAI"],
  "software-engineer": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "C#", "Go", "Rust", "Git", "SQL", "HTML", "CSS", "Full Stack", "Web Development", "AWS", "Docker", "Kubernetes", "REST API"],
  "data-scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "R", "Tableau", "Power BI", "Data Visualization", "Excel", "scikit-learn"],
  "ux-ui-designer": ["Figma", "UI/UX", "Wireframing", "Prototyping", "User Research", "Adobe XD", "Sketch", "HTML", "CSS", "Design"],
  "product-manager": ["Product Management", "Agile", "Scrum", "Jira", "SQL", "Analytics", "Roadmapping", "A/B Testing"],
  "cybersecurity-analyst": ["Network Security", "Kali Linux", "SIEM", "Wireshark", "Penetration Testing", "Linux", "Firewalls"],
  "digital-marketing": ["SEO", "SEM", "Google Ads", "Facebook Ads", "Google Analytics", "Content Marketing", "Social Media", "Email Marketing"],
  "financial-analyst": ["Excel", "Financial Modeling", "Accounting", "SQL", "Python", "Power BI", "Tableau", "Valuation"],
  "content-creator": ["Video Editing", "Photoshop", "Premiere Pro", "After Effects", "YouTube", "Instagram", "Social Media"],
  "teacher": ["Teaching", "Curriculum", "Lesson Planning", "Classroom Management"],
  "project-manager": ["Agile", "Scrum", "Jira", "MS Project", "Risk Management", "Stakeholder Management"],
  "mechanical-engineer": ["CAD", "AutoCAD", "SolidWorks", "MATLAB", "3D Modeling", "FEA", "Thermodynamics"],
  "graphic-designer": ["Photoshop", "Illustrator", "InDesign", "Figma", "Canva", "Typography", "After Effects", "Branding"],
  "civil-engineer": ["AutoCAD", "Revit", "STAAD", "Structural Analysis", "Surveying"],
  "journalist": ["Writing", "Editing", "Research", "SEO", "Copywriting", "Journalism"],
  "cybersecurity-engineer": ["Penetration Testing", "Ethical Hacking", "Network Security", "Cryptography", "Linux", "Kali", "Python", "Cloud Security", "AWS", "Azure"],
  "marketing-manager": ["Marketing", "Branding", "Analytics", "SEO", "Campaign Management", "Google Analytics"],
  "accountant": ["Accounting", "Excel", "Tally", "QuickBooks", "GAAP", "Tax"],
  "research-scientist": ["Python", "R", "MATLAB", "Statistics", "Scientific Writing", "Data Analysis"],
  "customer-service": ["CRM", "Customer Support", "Zendesk", "Communication"],
  "sustainability-consultant": ["Data Analysis", "Excel", "ESG", "Environmental Science", "Sustainability"],
  "data-entry": ["Typing", "Excel", "MS Office", "Data Entry"],
  "ux-researcher": ["User Research", "Figma", "Usability Testing", "Surveys", "Statistics", "SPSS"],
  "supply-chain-manager": ["ERP", "SAP", "Logistics", "Excel", "Forecasting", "Inventory Management"],
  "healthcare-provider": ["Medicine", "Nursing", "Anatomy", "Patient Care", "Biology", "First Aid", "Clinical"],
  "electrician": ["Electrical", "Wiring", "Blueprint", "Circuit", "Solar", "HVAC"],
  "lawyer": ["Legal Research", "Contract Law", "Litigation", "Corporate Law", "Intellectual Property", "Drafting"],
  "social-worker": ["Counseling", "Psychology", "Case Management", "Community Work", "Advocacy"],
  "chef": ["Cooking", "Baking", "Culinary", "Menu Planning", "Food Safety", "Pastry"],
  "pharmacist": ["Pharmacy", "Chemistry", "Medicine", "Drug Safety", "Pharmacology"],
  "physical-therapist": ["Physiotherapy", "Anatomy", "Rehabilitation", "Sports Medicine", "Exercise"],
  "paralegal": ["Legal Research", "Document Drafting", "Case Management", "Law", "Legal Writing"],
  "radiologist": ["Radiology", "Medical Imaging", "Anatomy", "MRI", "CT Scan", "Medicine"],
  "hr-manager": ["Recruitment", "HR", "Payroll", "Employee Relations", "Talent Management", "Interviewing"],
  "business-analyst": ["SQL", "Excel", "Data Analysis", "Process Modeling", "Requirement Gathering", "UML", "Jira"],
  "architect": ["AutoCAD", "Revit", "SketchUp", "Architecture", "Building Design", "Blueprints"],
  "psychologist": ["Psychology", "Counseling", "Behavioral Science", "Research", "Mental Health"],
  "dentist": ["Dentistry", "Anatomy", "Patient Care", "Surgical", "Radiology"],
  "content-writer": ["Writing", "SEO", "Editing", "Copywriting", "Content Strategy", "Grammar"],
  "sales-manager": ["Sales", "Negotiation", "CRM", "Lead Generation", "Communication", "Relationship Management"],
  "interior-designer": ["Design", "AutoCAD", "SketchUp", "Space Planning", "Color Theory", "3D Rendering"],
};

export function parseJsonArray(json: string): string[] {
  try { return JSON.parse(json); } catch { return []; }
}

export function calculateMatchScore(
  userProfile: {
    skills: string[];
    interests: string[];
    personality: Record<string, string>;
    values: string[];
    workStyle: string;
  },
  career: CareerData
): { total: number; skillMatch: number; interestMatch: number; aiSafetyScore: number } {
  const userSkills = userProfile.skills.map(s => s.toLowerCase().trim());
  const requiredSkills = career.requiredSkills.map(s => s.toLowerCase().trim());
  const aliasSkills = (TECH_ALIASES[career.slug] || []).map(s => s.toLowerCase().trim());

  // Skill match: what % of the career's skills does the user actually possess?
  // A skill counts when it (or a fuzzy variant) appears in the user's list.
  // Fuzzy-match only terms >= 4 chars to avoid false positives (e.g. "ml" vs "html").
  const matchesUser = (s: string) =>
    userSkills.some(us =>
      us === s ||
      (s.length >= 4 && us.includes(s)) ||
      (us.length >= 4 && s.includes(us))
    );
  const requiredRatio = requiredSkills.length > 0
    ? requiredSkills.filter(matchesUser).length / requiredSkills.length
    : 0.5;
  // Aliases represent concrete tech; ~8 hits counts as a full match.
  const aliasRatio = aliasSkills.length > 0
    ? Math.min(aliasSkills.filter(matchesUser).length / Math.min(aliasSkills.length, 8), 1)
    : 0;
  const skillMatch = Math.min(requiredRatio * 0.3 + aliasRatio * 0.7, 1);

  // Interest match: keyword overlap between interests and career fields
  const interestKeywords = userProfile.interests.map(i => i.toLowerCase()).join(" ");
  const careerKeywords = [...career.industries, ...career.requiredSkills, career.description]
    .join(" ").toLowerCase();
  const interestWords = interestKeywords.split(/\s+/).filter(w => w.length > 3);
  const matchedInterests = interestWords.filter(w => careerKeywords.includes(w));
  const interestMatch = interestWords.length > 0
    ? Math.min(matchedInterests.length / Math.max(interestWords.length * 0.3, 1), 1)
    : 0.3;

  // AI safety: inverse of AI risk score (higher = safer)
  const aiSafetyScore = 1 - career.aiRiskScore;

  // Personality alignment (simplified) — values may be numeric levels or "high"/"low" strings
  const personality = userProfile.personality;
  const isHigh = (v?: string) => v === "high" || (v !== undefined && !isNaN(Number(v)) && Number(v) >= 6);
  let personalityBonus = 0;
  if (isHigh(personality.analytical) && (career.title.includes("Engineer") || career.title.includes("Scientist") || career.title.includes("Analyst"))) {
    personalityBonus += 0.05;
  }
  if (isHigh(personality.creative) && (career.title.includes("Designer") || career.title.includes("Content") || career.title.includes("Chef"))) {
    personalityBonus += 0.05;
  }
  if (isHigh(personality.social) && (career.title.includes("Teacher") || career.title.includes("Social Worker") || career.title.includes("Manager"))) {
    personalityBonus += 0.05;
  }
  if (isHigh(personality.leadership) && (career.title.includes("Manager") || career.title.includes("Director"))) {
    personalityBonus += 0.05;
  }

  // Weighted total — skills dominate the match
  const total = Math.min(
    skillMatch * 0.5 +
    interestMatch * 0.2 +
    aiSafetyScore * 0.15 +
    personalityBonus +
    0.1, // base
    1
  );

  return {
    total: Math.round(total * 100) / 100,
    skillMatch: Math.round(skillMatch * 100) / 100,
    interestMatch: Math.round(interestMatch * 100) / 100,
    aiSafetyScore: Math.round(aiSafetyScore * 100) / 100,
  };
}

export function calculateSkillGaps(
  userSkills: string[],
  career: CareerData
): Array<{ skill: string; current: number; required: number; gap: number }> {
  const careerSkills = career.requiredSkills;
  return careerSkills.map(skill => {
    const userHas = userSkills.some(us =>
      us.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(us.toLowerCase())
    );
    const current = userHas ? 7 : Math.min(3, Math.max(1, userSkills.length > 0 ? 2 : 1));
    const required = 7;
    return {
      skill,
      current,
      required,
      gap: Math.max(0, required - current),
    };
  });
}
