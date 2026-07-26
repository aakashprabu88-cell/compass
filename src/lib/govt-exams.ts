export interface GovtExam {
  id: string;
  name: string;
  fullName: string;
  conductingBody: string;
  pattern: string;
  eligibility: string;
  syllabus: string[];
  attempts: string;
  ageLimit: string;
  examFee: string;
  difficulty: "moderate" | "hard" | "very_hard";
  successRate: number;
  avgPrepTime: string;
  salary: string;
  prestige: "high" | "medium" | "very_high";
  description: string;
  website: string;
}

export interface PrepTimeline {
  month: number;
  title: string;
  tasks: string[];
  milestone: boolean;
}

export interface FallbackCareer {
  fromExam: string;
  alternatives: { title: string; reason: string; salary: string; difficulty: string }[];
}

export interface GovtVsPrivate {
  category: string;
  govt: string;
  private: string;
  winner: "government" | "private" | "tie";
}

export const EXAM_DATABASE: GovtExam[] = [
  {
    id: "upsc-cse",
    name: "UPSC CSE",
    fullName: "UPSC Civil Services Examination (IAS/IPS/IFS)",
    conductingBody: "Union Public Service Commission",
    pattern: "3 stages: Prelims (2 objective papers, 400 marks) → Mains (9 descriptive papers, 1750 marks) → Interview (275 marks). Total: 2025 marks.",
    eligibility: "Bachelor's degree from any recognized university. Final year students eligible. No minimum percentage.",
    syllabus: [
      "General Studies I: Indian Heritage, History, Geography, Society",
      "General Studies II: Polity, Governance, Constitution, Social Justice, IR",
      "General Studies III: Technology, Economic Development, Biodiversity, Security, Disaster Management",
      "General Studies IV: Ethics, Integrity, Aptitude",
      "Optional Subject (any one from 26 subjects)",
      "Essay Paper",
      "English & Indian Language (qualifying, not counted for ranking)",
      "Current Affairs (贯穿所有 papers)",
    ],
    attempts: "General: 6 attempts until age 32. OBC: 9 attempts until 35. SC/ST: Unlimited attempts until 37.",
    ageLimit: "21–32 years (General). Relaxations for reserved categories.",
    examFee: "₹100 (General). Female/SC/ST/PwD: Free.",
    difficulty: "very_hard",
    successRate: 0.08,
    avgPrepTime: "18–24 months",
    salary: "₹56,100 – ₹2,50,000 per month (Level 10–17, 7th Pay Commission). IAS: starts at ₹56,100 + allowances.",
    prestige: "very_high",
    description: "India's premier civil services exam. Opens doors to IAS, IPS, IFS, IRS and 24 other Group A and Group B services. Considered the toughest competitive exam in India with intense competition.",
    website: "https://upsc.gov.in",
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    fullName: "Staff Selection Commission – Combined Graduate Level",
    conductingBody: "Staff Selection Commission",
    pattern: "2 tiers: Tier I (100 MCQs, 200 marks – GK, Quant, Reasoning, English) → Tier II (4 papers, 600 marks – Quant, English, General Studies, Statistics/Finance). No interview for most posts.",
    eligibility: "Bachelor's degree from any recognized university. Age 18–32 depending on post. Specific posts may require additional qualifications.",
    syllabus: [
      "Quantitative Aptitude (Maths up to 10th level, some 12th)",
      "General Awareness (Current Affairs, static GK, science)",
      "English Comprehension (grammar, vocabulary, reading)",
      "General Intelligence & Reasoning (analogy, series, coding, puzzles)",
      "Statistics (for JSO post)",
      "Finance & Accounts (for AAO post)",
    ],
    attempts: "General: Unlimited until age 30. OBC: 9 until 33. SC/ST: Unlimited until 35.",
    ageLimit: "18–30 years (varies by post). Some posts: 18–27, others 20–30.",
    examFee: "₹100 (General). Female/SC/ST/PwD: Free.",
    difficulty: "moderate",
    successRate: 3.5,
    avgPrepTime: "6–12 months",
    salary: "₹25,500 – ₹1,42,400 per month depending on post (Level 4–8). Most posts: ₹44,900–₹1,42,400.",
    prestige: "medium",
    description: "One of the largest recruitment exams in India for Group B and C posts in central government ministries, departments, and organizations. Popular for aspirants seeking stable government employment.",
    website: "https://ssc.nic.in",
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    fullName: "Staff Selection Commission – Combined Higher Secondary Level",
    conductingBody: "Staff Selection Commission",
    pattern: "3 tiers: Tier I (100 MCQs, 200 marks) → Tier II (descriptive, 100 marks – essay/letter) → Tier III (Skill Test/Typing Test – qualifying).",
    eligibility: "12th pass (Higher Secondary) from any recognized board. Age 18–27 years.",
    syllabus: [
      "Quantitative Aptitude",
      "General Awareness",
      "English Language & Comprehension",
      "General Intelligence & Reasoning",
      "Descriptive Paper (Essay, Letter, Application)",
      "Typing Test (English: 35 wpm / Hindi: 30 wpm)",
      "DEST (Data Entry Speed Test) for DEO posts",
    ],
    attempts: "General: Unlimited until age 27. OBC: 9 until 30. SC/ST: Unlimited until 32.",
    ageLimit: "18–27 years.",
    examFee: "₹100 (General). Female/SC/ST/PwD: Free.",
    difficulty: "moderate",
    successRate: 4.2,
    avgPrepTime: "4–8 months",
    salary: "₹19,900 – ₹63,200 per month (Level 2–5). DEO: ₹25,500–₹81,100.",
    prestige: "medium",
    description: "Entry-level recruitment for posts like DEO, LDC, Junior Secretariat Assistant, and Postal Assistant in central government. Ideal for 12th-pass candidates seeking government jobs.",
    website: "https://ssc.nic.in",
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection – Probationary Officer",
    conductingBody: "IBPS",
    pattern: "3 stages: Prelims (100 marks, 100 MCQs – Quant, Reasoning, English) → Mains (200 marks, MCQ + Descriptive) → Interview (100 marks). Total: 400 (Mains 80% + Interview 20%).",
    eligibility: "Bachelor's degree from any recognized university. Age 20–30 years. Computer literacy required.",
    syllabus: [
      "Quantitative Aptitude (Data Interpretation, Mensuration, Algebra)",
      "Reasoning Ability (Puzzles, Seating Arrangement, Coding)",
      "English Language (Reading Comprehension, Cloze, Error Spotting)",
      "General/Economy/Banking Awareness",
      "Computer Aptitude",
      "Data Analysis & Interpretation (Mains)",
      "Descriptive Writing (Letter + Essay, 50 marks)",
    ],
    attempts: "General: 4 attempts. OBC: 7 attempts. SC/ST: Unlimited. PwD: 7 (General), 10 (reserved).",
    ageLimit: "20–30 years.",
    examFee: "₹850 (General). SC/ST/PwD/Ex-SM: ₹175.",
    difficulty: "hard",
    successRate: 2.8,
    avgPrepTime: "6–12 months",
    salary: "₹36,000 – ₹63,840 per month (JMPS I – IV). Plus DA, HRA, CCA, and other allowances. In-hand: ₹40,000–₹52,000 starting.",
    prestige: "high",
    description: "Recruitment for Probationary Officers in 11 major public sector banks. Competitive exam with high stakes — one clearing leads to a banking career with fast promotions.",
    website: "https://www.ibps.in",
  },
  {
    id: "ibps-clerk",
    name: "IBPS Clerk",
    fullName: "Institute of Banking Personnel Selection – Clerk (Junior Associate)",
    conductingBody: "IBPS",
    pattern: "2 stages: Prelims (100 MCQs, 100 marks – 60 min) → Mains (200 MCQs, 200 marks – 120 min). No interview.",
    eligibility: "Bachelor's degree from any recognized university. Age 20–28 years. Computer literacy required. Local language proficiency required.",
    syllabus: [
      "Quantitative Aptitude",
      "Reasoning Ability",
      "English Language",
      "General/Financial Awareness",
      "Computer Knowledge",
    ],
    attempts: "General: Unlimited until age 28. OBC: 9 until 31. SC/ST: Unlimited until 33.",
    ageLimit: "20–28 years.",
    examFee: "₹850 (General). SC/ST/PwD/Ex-SM: ₹175.",
    difficulty: "moderate",
    successRate: 5.1,
    avgPrepTime: "4–8 months",
    salary: "₹19,900 – ₹47,920 per month (Level 3). In-hand starting: ₹28,000–₹35,000. DA, HRA, and other allowances extra.",
    prestige: "medium",
    description: "Entry-level clerical cadre in 11 public sector banks. Large number of vacancies make it relatively easier than PO. Good stepping stone into banking sector.",
    website: "https://www.ibps.in",
  },
  {
    id: "sbi-po",
    name: "SBI PO",
    fullName: "State Bank of India – Probationary Officer",
    conductingBody: "State Bank of India",
    pattern: "3 stages: Prelims (100 marks, 1 hr) → Mains (250 marks, 3.5 hrs) → Group Exercise + Interview (50 marks GE + 50 marks Interview). Total: 350.",
    eligibility: "Graduation from any recognized university. Age 21–30 years.",
    syllabus: [
      "Quantitative Aptitude",
      "Reasoning & Computer Aptitude",
      "English Language",
      "General/Economy/Banking Awareness",
      "Data Analysis & Interpretation",
      "Essay & Letter Writing (Descriptive, English)",
      "Group Exercise & Interview",
    ],
    attempts: "General: 4 attempts. OBC: 7. SC/ST: No limit. PWD: 7 (General), 10 (reserved).",
    ageLimit: "21–30 years.",
    examFee: "₹750 (General). SC/ST/PwD: ₹125.",
    difficulty: "hard",
    successRate: 2.1,
    avgPrepTime: "8–14 months",
    salary: "₹41,960 – ₹63,840 per month. In-hand: ₹52,000–₹65,000 starting. SBI offers higher pay than most other bank POs due to perks.",
    prestige: "high",
    description: "SBI's flagship officer recruitment. Considered tougher than IBPS PO due to lower vacancies and higher competition. SBI brand carries significant weight in banking.",
    website: "https://sbi.co.in",
  },
  {
    id: "sbi-clerk",
    name: "SBI Clerk",
    fullName: "State Bank of India – Junior Associate (Clerk)",
    conductingBody: "State Bank of India",
    pattern: "2 stages: Prelims (100 MCQs, 100 marks) → Mains (200 MCQs, 200 marks). No interview. Language test for local language.",
    eligibility: "Graduation from any recognized university. Age 20–28 years.",
    syllabus: [
      "Quantitative Aptitude",
      "Reasoning Ability",
      "English Language",
      "General/Financial Awareness",
      "Computer Knowledge",
    ],
    attempts: "General: Unlimited until age 28. OBC: 9 until 31. SC/ST: Unlimited until 33.",
    ageLimit: "20–28 years.",
    examFee: "₹750 (General). SC/ST/PwD: ₹125.",
    difficulty: "moderate",
    successRate: 4.8,
    avgPrepTime: "3–6 months",
    salary: "₹19,900 – ₹47,920 per month (Level 3). In-hand starting: ₹26,000–₹32,000.",
    prestige: "medium",
    description: "Junior Associate recruitment in India's largest bank. Large vacancies and no interview stage make it a popular choice for banking aspirants.",
    website: "https://sbi.co.in",
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board – Non-Technical Popular Categories",
    conductingBody: "Railway Recruitment Boards (RRBs)",
    pattern: "2 stages: CBT-I (100 MCQs, 100 marks, 90 min) → CBT-II (120 MCQs, 120 marks, 90 min). CBAT for some posts. Document verification.",
    eligibility: "Bachelor's degree (for graduate posts) or 12th pass (for 12th-level posts). Age 18–33 years depending on level.",
    syllabus: [
      "General Awareness",
      "Mathematics",
      "General Intelligence & Reasoning",
      "General Science",
      "Current Affairs",
      "Basic Computer Awareness (for some posts)",
    ],
    attempts: "No restriction on number of attempts within age limit.",
    ageLimit: "18–33 years (varies by category and post level).",
    examFee: "₹500 (General). SC/ST/PwD/Female: ₹250.",
    difficulty: "moderate",
    successRate: 5.5,
    avgPrepTime: "4–8 months",
    salary: "₹19,900 – ₹47,920 per month (Level 2–5). In-hand: ₹25,000–₹35,000.",
    prestige: "medium",
    description: "India's largest recruitment exam by number of applicants. Multiple posts in Indian Railways including Station Master, Goods Guard, Clerk, Typist. Massive vacancies.",
    website: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554",
  },
  {
    id: "rrb-je",
    name: "RRB JE",
    fullName: "Railway Recruitment Board – Junior Engineer",
    conductingBody: "Railway Recruitment Boards (RRBs)",
    pattern: "2 stages: CBT-I (100 MCQs, 100 marks, 90 min) → CBT-II (150 MCQs, 150 marks, 120 min). Document verification and medical exam.",
    eligibility: "Diploma or Degree in Engineering from recognized institution. Age 18–33 years.",
    syllabus: [
      "General Awareness",
      "Physics & Chemistry",
      "Basics of Computers & Applications",
      "Basics of Environmental & Pollution",
      "Technical subjects (Civil/Mechanical/Electrical/Electronics/CS based on trade)",
      "General Intelligence & Reasoning",
      "Mathematics",
    ],
    attempts: "No restriction within age limit.",
    ageLimit: "18–33 years.",
    examFee: "₹500 (General). SC/ST/PwD/Female: ₹250.",
    difficulty: "moderate",
    successRate: 6.2,
    avgPrepTime: "3–6 months",
    salary: "₹35,400 – ₹1,12,400 per month (Level 6). In-hand: ₹40,000–₹50,000.",
    prestige: "high",
    description: "Technical recruitment for engineering posts in Indian Railways. Good salary and growth for diploma/degree engineers. Multiple engineering disciplines covered.",
    website: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554",
  },
  {
    id: "tnpsc-g1",
    name: "TNPSC Group 1",
    fullName: "Tamil Nadu Public Service Commission – Combined Civil Services Examination I",
    conductingBody: "Tamil Nadu Public Service Commission (TNPSC)",
    pattern: "3 stages: Prelims (200 MCQs, 300 marks – General Studies) → Mains (3 descriptive + 1 Tamil qualifying paper) → Interview/Oral Test. Total: 500 (Mains) + Interview.",
    eligibility: "Bachelor's degree from any recognized university. Age 21–32 years.",
    syllabus: [
      "Indian Polity & Economy",
      "Indian History & Culture",
      "Geography of India & Tamil Nadu",
      "Science & Technology",
      "Current Affairs (national + Tamil Nadu)",
      "Aptitude & Mental Ability",
      "Tamil (qualifying)",
      "General Studies Paper II: Indian National Movement, Governance",
      "General Studies Paper III: Technology, Economy, Development",
      "General Studies Paper IV: Ethics, Aptitude",
      "Tamil Essay / General Essay",
    ],
    attempts: "General: 3 attempts (total for all categories). OBC: 3+1=4. SC/ST: No limit. PwD: General+2.",
    ageLimit: "21–32 years (General). SC/ST/BC/MBC: No upper age limit. Differently-abled: 42 years.",
    examFee: "₹150 (prelims) + ₹200 (mains). SC/ST/BC/MBC/PwD/Widows: exemption in some cases.",
    difficulty: "very_hard",
    successRate: 0.9,
    avgPrepTime: "12–18 months",
    salary: "₹37,700 – ₹1,38,500 per month (Level 10–13). IAS-equivalent in Tamil Nadu. In-hand: ₹50,000–₹70,000+.",
    prestige: "very_high",
    description: "Tamil Nadu's premier civil services exam. Recruits Deputy Collectors, DSPs, District Registrars, and other Class I officers in TN state government. Highly competitive.",
    website: "https://www.tnpsc.gov.in",
  },
  {
    id: "tnpsc-g2",
    name: "TNPSC Group 2",
    fullName: "Tamil Nadu Public Service Commission – Combined Civil Services Examination II",
    conductingBody: "Tamil Nadu Public Service Commission (TNPSC)",
    pattern: "Single exam: 200 MCQs (General Studies + Aptitude) in 3 hours. No interview for most posts. Some posts require oral test.",
    eligibility: "Bachelor's degree from any recognized university. Age 18–30 years for most posts.",
    syllabus: [
      "Indian Polity",
      "Indian Economy",
      "Indian History & Culture",
      "Geography",
      "Science & Technology",
      "Current Affairs",
      "Aptitude & Mental Ability",
      "General Tamil / General English (optional)",
    ],
    attempts: "General: 3 attempts. OBC/BC/MBC: 3+1. SC/ST: No limit. PwD: 2 extra.",
    ageLimit: "18–30 years (varies by post). SC/ST/BC/MBC: No upper limit.",
    examFee: "₹150. SC/ST/BC/MBC/PwD/Widows: Free.",
    difficulty: "hard",
    successRate: 2.5,
    avgPrepTime: "6–12 months",
    salary: "₹19,500 – ₹1,15,200 per month (Level 3–11). Deputy Tahsildar, Sub-Registrar, etc.",
    prestige: "high",
    description: "Recruits for Class II and Class II-A posts in Tamil Nadu government including Deputy Tahsildar, Junior Employment Officer, Sub-Registrar. Large number of vacancies.",
    website: "https://www.tnpsc.gov.in",
  },
  {
    id: "neet",
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test (UG)",
    conductingBody: "National Testing Agency (NTA)",
    pattern: "Single exam: 200 MCQs (180 to attempt), 720 marks total. 4 sections: Physics (45), Chemistry (45), Botany (45), Zoology (45). 4 marks per correct answer, -1 for wrong. Duration: 3 hours 20 minutes.",
    eligibility: "12th pass with Physics, Chemistry, Biology/Biotechnology (50% aggregate for General, 40% for reserved). Age: 17 years minimum, no upper limit.",
    syllabus: [
      "Physics: Mechanics, Thermodynamics, Optics, Electrostatics, Magnetism, Modern Physics",
      "Chemistry: Organic, Inorganic, Physical Chemistry",
      "Botany: Cell Biology, Genetics, Ecology, Plant Physiology, Diversity in Living World",
      "Zoology: Human Physiology, Animal Diversity, Reproduction, Genetics & Evolution",
      "Class 11 & 12 NCERT syllabus (full coverage)",
    ],
    attempts: "No restriction on number of attempts.",
    ageLimit: "Minimum 17 years. No upper age limit (as of latest guidelines).",
    examFee: "₹1,700 (General/OBC). SC/ST/PwD: ₹900. EWS: ₹900.",
    difficulty: "very_hard",
    successRate: 1.5,
    avgPrepTime: "12–24 months",
    salary: "MBBS: ₹50,000–₹1,50,000/month (govt hospital). Private practice: ₹1,00,000–₹5,00,000+/month after specialization.",
    prestige: "very_high",
    description: "India's single largest medical entrance exam with 20+ lakh applicants. Gateway to MBBS, BDS, BAMS, BHMS, and other medical courses in India. Highly competitive.",
    website: "https://neet.nta.nic.in",
  },
  {
    id: "clat",
    name: "CLAT",
    fullName: "Common Law Admission Test",
    conductingBody: "Consortium of National Law Universities",
    pattern: "Single exam: 150 MCQs, 150 marks, 2 hours. Sections: English (28-32), Current Affairs (35-39), Legal Reasoning (35-39), Logical Reasoning (28-32), Quantitative Techniques (13-17).",
    eligibility: "12th pass with minimum 45% marks (40% for SC/ST). No upper age limit. No specific subjects required.",
    syllabus: [
      "English Language & Comprehension",
      "Current Affairs including General Knowledge",
      "Legal Reasoning (legal propositions, principles, facts)",
      "Logical Reasoning (patterns, relationships, arguments)",
      "Quantitative Techniques (elementary maths, algebra, statistics)",
    ],
    attempts: "No restriction on number of attempts.",
    ageLimit: "No upper age limit.",
    examFee: "₹4,000 (General). SC/ST: ₹3,500.",
    difficulty: "hard",
    successRate: 3.0,
    avgPrepTime: "6–12 months",
    salary: "Starting: ₹60,000–₹1,50,000/month (entry-level law firms, corporate legal). Top NLU grads: ₹15,00,000–₹1,80,00,000/year at top firms.",
    prestige: "high",
    description: "Gateway to 22 National Law Universities and 60+ affiliated law schools. High-paying corporate law, litigation, and legal advisory careers. Top NLUs are extremely competitive.",
    website: "https://consortiumofnlus.ac.in",
  },
  {
    id: "gate",
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    conductingBody: "IITs (rotating), coordinated by IIT Bombay (2025)",
    pattern: "Single exam: 65 MCQs + NAT questions, 100 marks, 3 hours. Sections: General Aptitude (15 marks) + Engineering Mathematics (15 marks) + Core Subject (70 marks).",
    eligibility: "Bachelor's degree in Engineering/Technology/Architecture or Master's in Science/Computer Applications. Final year students eligible. No minimum percentage.",
    syllabus: [
      "General Aptitude (verbal, numerical, analytical)",
      "Engineering Mathematics (linear algebra, calculus, probability, ODE, PDE)",
      "Core Subject (varies: CS, ME, CE, EE, ECE, CH, etc. — full UG syllabus)",
      "29 papers available across engineering and science disciplines",
    ],
    attempts: "No restriction on number of attempts.",
    ageLimit: "No upper age limit.",
    examFee: "₹1,800 (General/OBC). SC/ST/PwD/Female: ₹900.",
    difficulty: "hard",
    successRate: 15.0,
    avgPrepTime: "6–10 months",
    salary: "PSU recruitment: ₹6,00,000–₹18,00,000/year. M.Tech at IITs: leads to ₹10,00,000–₹40,00,000/year placements. Research: varies.",
    prestige: "high",
    description: "Gateway to M.Tech/M.E./Ph.D. at IITs/IISc and recruitment in PSUs (ONGC, NTPC, IOCL, BHEL, etc.). Valid for 3 years. One of India's most prestigious engineering exams.",
    website: "https://gate.iitb.ac.in",
  },
  {
    id: "cat",
    name: "CAT",
    fullName: "Common Admission Test",
    conductingBody: "IIMs (rotating, currently IIM Lucknow coordinates)",
    pattern: "Single exam: 66 MCQs + non-MCQs, 3 hours (60 min per section). Sections: VARC (24 Qs), DILR (20 Qs), QA (22 Qs). Total: 198 marks. Negative marking: -1 for MCQs, 0 for non-MCQs.",
    eligibility: "Bachelor's degree with 50% marks (45% for SC/ST/PwD). Final year students eligible. Work experience not mandatory but preferred.",
    syllabus: [
      "Verbal Ability & Reading Comprehension (VA-RC): passages, grammar, para-jumbles, summary",
      "Data Interpretation & Logical Reasoning (DILR): charts, tables, puzzles, arrangements, caselets",
      "Quantitative Ability (QA): arithmetic, algebra, geometry, number systems, modern math",
    ],
    attempts: "No restriction on number of attempts.",
    ageLimit: "No upper age limit. Most IIMs prefer candidates under 30.",
    examFee: "₹2,400 (General/OBC). SC/ST/PwD: ₹1,200.",
    difficulty: "very_hard",
    successRate: 2.0,
    avgPrepTime: "9–15 months",
    salary: "IIM grads: ₹20,00,000–₹1,00,00,000+/year (median at top IIMs: ₹25–35 LPA). Consulting, Finance, Product Management roles.",
    prestige: "very_high",
    description: "India's premier MBA entrance exam. Gateway to 20 IIMs and 100+ top B-schools. Exceptional ROI — transforms careers. Top percentile opens doors to consulting and banking careers.",
    website: "https://iimcat.ac.in",
  },
];

export function getAllExams(): GovtExam[] {
  return EXAM_DATABASE;
}

export function getExamById(id: string): GovtExam | undefined {
  return EXAM_DATABASE.find((e) => e.id === id);
}

export function calculateSuccessProbability(profile: {
  education: string;
  prepMonths: number;
  attempts: number;
  targetExam: string;
}): number {
  const exam = getExamById(profile.targetExam);
  if (!exam) return 0;

  let base = exam.successRate;

  // Prep time factor
  const avgPrepMonths = parseInt(exam.avgPrepTime) || 12;
  const prepFactor = Math.min(profile.prepMonths / avgPrepMonths, 1.5);
  let probability = base * prepFactor;

  // Education match
  const eduLower = profile.education.toLowerCase();
  if (
    (exam.id === "neet" && (eduLower.includes("biology") || eduLower.includes("pcb"))) ||
    (exam.id === "gate" && (eduLower.includes("engineering") || eduLower.includes("b.tech") || eduLower.includes("b.e"))) ||
    (exam.id === "clat" && (eduLower.includes("12th") || eduLower.includes("higher secondary"))) ||
    (exam.id === "ssc-chsl" && eduLower.includes("12th"))
  ) {
    probability *= 1.3;
  }

  if (
    (exam.id === "gate" && !eduLower.includes("engineering")) ||
    (exam.id === "neet" && !eduLower.includes("biology"))
  ) {
    probability *= 0.5;
  }

  // Experience factor (more attempts = more experience)
  const attemptFactor = 1 + (profile.attempts - 1) * 0.15;
  probability *= attemptFactor;

  // Cap at reasonable maximum
  return Math.min(Math.max(probability, 0.1), 85);
}

export function generatePrepTimeline(exam: GovtExam, startMonth: number): PrepTimeline[] {
  const timelines: Record<string, PrepTimeline[]> = {
    "upsc-cse": [
      { month: startMonth, title: "Foundation Building", tasks: ["Cover NCERT books (History, Polity, Geography, Economics)", "Start newspaper reading (The Hindu / Indian Express daily)", "Begin General Studies Paper I preparation", "Choose optional subject"], milestone: true },
      { month: startMonth + 1, title: "Core Subjects – Phase 1", tasks: ["Complete Indian Polity (Laxmikanth)", "Start Indian History (Ancient + Medieval)", "Daily current affairs notes", "1 hour newspaper analysis"], milestone: false },
      { month: startMonth + 2, title: "Core Subjects – Phase 2", tasks: ["Geography (Physical + Indian)", "Economy basics (Ramesh Singh / Sriram IAS)", "Continue optional subject preparation", "Answer writing practice (2 answers/day)"], milestone: false },
      { month: startMonth + 3, title: "Advanced Preparation", tasks: ["GS II: Polity, Governance, Social Justice", "GS III: Technology, Economy, Security", "Optional subject deep dive", "Start preliminary test series"], milestone: true },
      { month: startMonth + 4, title: "Essay & Ethics", tasks: ["GS IV: Ethics, Integrity, Aptitude", "Essay writing practice (2 essays/week)", "Ethics case study practice", "Complete optional subject syllabus"], milestone: false },
      { month: startMonth + 5, title: "Revision Phase 1", tasks: ["Full syllabus revision – GS I to IV", "Optional subject revision", "Current affairs compilation", "Previous year question analysis (20 years)"], milestone: false },
      { month: startMonth + 6, title: "Mock Tests", tasks: ["Full-length prelims mock tests (weekly)", "Analyze and improve weak areas", "Speed and accuracy improvement", "Current affairs rapid revision"], milestone: true },
      { month: startMonth + 7, title: "Prelims Focus", tasks: ["Intensive prelims-only focus", "Daily mock tests", "PYQs timed practice", "Revision of facts and figures"], milestone: false },
      { month: startMonth + 8, title: "Prelims Exam Month", tasks: ["Light revision only", "Avoid new topics", "Stay calm and confident", "EXAM: UPSC Prelims"], milestone: true },
      { month: startMonth + 9, title: "Mains Preparation", tasks: ["If cleared prelims: intensive mains prep", "Daily answer writing (5-8 answers)", "Essay practice (3/week)", "Optional subject answer practice"], milestone: false },
      { month: startMonth + 10, title: "Mains Intensive", tasks: ["Full-length mains mocks", "GS answer writing with feedback", "Optional subject answer improvement", "Time management practice"], milestone: true },
      { month: startMonth + 11, title: "Final Revision", tasks: ["Comprehensive revision all papers", "Current affairs consolidation", "Interview preparation (if applicable)", "EXAM: UPSC Mains"], milestone: true },
    ],
    "ssc-cgl": [
      { month: startMonth, title: "Diagnostic & Basics", tasks: ["Take a diagnostic test to assess current level", "Cover 10th-level maths foundations", "Start English grammar basics", "Learn reasoning patterns"], milestone: true },
      { month: startMonth + 1, title: "Quantitative Aptitude", tasks: ["Complete arithmetic (percentage, ratio, profit/loss)", "Data interpretation basics", "Trigonometry and mensuration", "Daily practice sets (50 questions)"], milestone: false },
      { month: startMonth + 2, title: "Reasoning & English", tasks: ["Logical reasoning (analogy, coding, series)", "Puzzles and seating arrangements", "English vocabulary and grammar", "Reading comprehension practice"], milestone: false },
      { month: startMonth + 3, title: "General Awareness", tasks: ["Static GK (Polity, History, Geography, Science)", "Current affairs compilation", "Economics basics", "Monthly current affairs revision"], milestone: true },
      { month: startMonth + 4, title: "Advanced Topics", tasks: ["Advanced maths (algebra, geometry, number system)", "Error spotting and sentence correction", "Cloze test and fillers", "Advanced reasoning puzzles"], milestone: false },
      { month: startMonth + 5, title: "Tier I Mock Tests", tasks: ["Full-length Tier I mocks (3/week)", "Speed improvement drills", "Weak area identification and fixing", "PYQs analysis"], milestone: true },
      { month: startMonth + 6, title: "Tier II Preparation", tasks: ["If cleared Tier I: start Tier II focused prep", "Data Analysis & Interpretation", "Advanced English (Mains level)", "Statistics basics (for JSO)"], milestone: false },
      { month: startMonth + 7, title: "Final Revision", tasks: ["Complete syllabus revision", "Mock tests for Tier II", "Descriptive paper practice", "EXAM: SSC CGL Tier I → Tier II"], milestone: true },
    ],
    "ibps-po": [
      { month: startMonth, title: "Basics & Strategy", tasks: ["Assess current level with a diagnostic test", "Start quantitative aptitude basics", "Learn reasoning patterns (series, coding)", "Read banking awareness basics"], milestone: true },
      { month: startMonth + 1, title: "Core Preparation", tasks: ["Complete arithmetic (percentage, ratio, averages)", "Reasoning puzzles and arrangements", "English grammar and vocabulary", "Daily current affairs for banking"], milestone: false },
      { month: startMonth + 2, title: "Advanced Topics", tasks: ["Data Interpretation (tables, graphs, caselets)", "Advanced reasoning (seating, blood relations)", "Reading comprehension and cloze tests", "Banking awareness deep dive"], milestone: false },
      { month: startMonth + 3, title: "Prelims Focus", tasks: ["Prelims mock tests (daily during last month)", "Speed and accuracy drills", "PYQs analysis (last 5 years)", "Prelims-specific strategy"], milestone: true },
      { month: startMonth + 4, title: "Mains Preparation", tasks: ["Descriptive writing (essay + letter practice)", "General/Economy/Banking awareness", "Data Analysis & Interpretation", "Computer aptitude basics"], milestone: false },
      { month: startMonth + 5, title: "Mains Intensive", tasks: ["Full-length mains mocks", "Descriptive paper timed practice", "Interview preparation (current affairs, banking)", "EXAM: IBPS PO"], milestone: true },
    ],
    "neet": [
      { month: startMonth, title: "NCERT Foundation", tasks: ["Read NCERT Biology Class 11 & 12 line by line", "Start NCERT Physics (Class 11 mechanics)", "NCERT Chemistry (Class 11 – Organic basics)", "Make notes for each chapter"], milestone: true },
      { month: startMonth + 1, title: "Physics Deep Dive", tasks: ["Complete Class 11 Physics (Mechanics, Waves, Thermodynamics)", "Numerical practice (50+ problems per chapter)", "Physics formula sheet creation", "Concept videos for difficult topics"], milestone: false },
      { month: startMonth + 2, title: "Chemistry Foundation", tasks: ["Physical Chemistry (Mole concept, Equilibrium, Thermodynamics)", "Organic Chemistry (GOC, Hydrocarbons, Named Reactions)", "Inorganic Chemistry (Periodic table, Chemical bonding)", "NCERT line-by-line for Inorganic"], milestone: false },
      { month: startMonth + 3, title: "Biology Deep Dive", tasks: ["Complete Class 12 Biology syllabus", "Human Physiology detailed study", "Genetics and Evolution", "Plant Physiology and Ecology"], milestone: true },
      { month: startMonth + 4, title: "Class 11 Revision + Class 12 Physics", tasks: ["Physics: Electrostatics, Magnetism, Optics, Modern Physics", "Revise Class 11 Biology completely", "Inorganic Chemistry – complete remaining chapters", "Daily NEET-level MCQs (100)"], milestone: false },
      { month: startMonth + 5, title: "Advanced Chemistry & Biology", tasks: ["Organic Chemistry – complete remaining chapters", "Biology: Genetics, Evolution, Biotechnology", "Physical Chemistry – complete syllabus", "Weekly full-length mock tests"], milestone: false },
      { month: startMonth + 6, title: "Mock Test Phase", tasks: ["Full-length NEET mocks (2/week)", "Analyze mistakes and revise weak areas", "NCERT re-reads for factual accuracy", "Previous year papers (2015–2025)"], milestone: true },
      { month: startMonth + 7, title: "Final Revision", tasks: ["NCERT rapid revision (all 4 books)", "Formula and diagram revision", "Light mock tests only", "EXAM: NEET UG"], milestone: true },
    ],
  };

  // Generic fallback timeline
  const genericTimeline: PrepTimeline[] = [
    { month: startMonth, title: "Assessment & Planning", tasks: ["Take diagnostic test", "Understand exam pattern and syllabus", "Create study schedule", "Gather study materials and resources"], milestone: true },
    { month: startMonth + 1, title: "Foundation Building", tasks: ["Cover core subject fundamentals", "Build conceptual clarity", "Daily study routine (4-6 hours)", "Start practice questions"], milestone: false },
    { month: startMonth + 2, title: "Core Subject Mastery", tasks: ["Deep dive into all subjects", "Solve topic-wise question banks", "Take topic tests", "Identify and work on weak areas"], milestone: false },
    { month: startMonth + 3, title: "Advanced Topics", tasks: ["Cover advanced/optional topics", "Increase practice intensity", "Begin full-length mock tests", "Analyze performance trends"], milestone: true },
    { month: startMonth + 4, title: "Mock Test Phase", tasks: ["Regular mock tests (2-3 per week)", "Detailed analysis after each mock", "Speed and accuracy improvement", "PYQ analysis"], milestone: false },
    { month: startMonth + 5, title: "Final Revision & Exam", tasks: ["Complete syllabus revision", "Formula and key facts revision", "Light study only in last week", `EXAM: ${exam.name}`], milestone: true },
  ];

  return timelines[exam.id] || genericTimeline;
}

export function getFallbackCareers(examId: string): FallbackCareer {
  const fallbacks: Record<string, FallbackCareer> = {
    "upsc-cse": {
      fromExam: "UPSC CSE",
      alternatives: [
        { title: "State PSC Services", reason: "Similar role at state level with same syllabus overlap", salary: "₹37,700–₹1,12,400/month", difficulty: "Very Hard" },
        { title: "SSC CGL (Inspector/ASO)", reason: "Central government Group B post with similar GK focus", salary: "₹44,900–₹1,42,400/month", difficulty: "Moderate" },
        { title: "Banking (IBPS/SBI PO)", reason: "Government sector with analytical skills transfer", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "Teaching (UGC-NET / School)", reason: "Knowledge and communication skills applicable", salary: "₹40,000–₹85,000/month", difficulty: "Moderate" },
        { title: "Defense Services (CDS/AFCAT)", reason: "Officer-level role in Indian Armed Forces", salary: "₹56,100–₹1,77,500/month", difficulty: "Hard" },
      ],
    },
    "ssc-cgl": {
      fromExam: "SSC CGL",
      alternatives: [
        { title: "IBPS/SBI PO", reason: "Similar analytical skills with banking sector growth", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "SSC CPO (Sub-Inspector)", reason: "Central Police forces recruitment with similar syllabus", salary: "₹35,400–₹1,12,400/month", difficulty: "Hard" },
        { title: "RRB NTPC", reason: "Similar pattern, larger vacancies in railways", salary: "₹19,900–₹47,920/month", difficulty: "Moderate" },
        { title: "State Government Exams", reason: "State-level exams with overlapping syllabus", salary: "₹19,900–₹1,12,400/month", difficulty: "Moderate" },
      ],
    },
    "ssc-chsl": {
      fromExam: "SSC CHSL",
      alternatives: [
        { title: "SSC CGL (after graduation)", reason: "Higher level with better pay and role", salary: "₹44,900–₹1,42,400/month", difficulty: "Hard" },
        { title: "Railway Group D", reason: "Similar difficulty, railway sector entry", salary: "₹18,000–₹56,900/month", difficulty: "Moderate" },
        { title: "India Post GDS", reason: "Postal department recruitment with typing skills", salary: "₹12,000–₹14,500/month", difficulty: "Easy" },
        { title: "State SSC Exams", reason: "State-level clerical recruitment", salary: "₹19,900–₹63,200/month", difficulty: "Moderate" },
      ],
    },
    "ibps-po": {
      fromExam: "IBPS PO",
      alternatives: [
        { title: "SBI PO", reason: "Higher pay in same banking sector", salary: "₹41,960–₹63,840/month", difficulty: "Hard" },
        { title: "RBI Grade B", reason: "Central bank role with better work-life balance", salary: "₹55,200–₹1,08,650/month", difficulty: "Very Hard" },
        { title: "NABARD Grade A", reason: "Development banking with rural focus", salary: "₹44,500–₹89,100/month", difficulty: "Hard" },
        { title: "Insurance (LIC AAO)", reason: "Similar exam pattern in insurance sector", salary: "₹32,795–₹62,310/month", difficulty: "Hard" },
      ],
    },
    "ibps-clerk": {
      fromExam: "IBPS Clerk",
      alternatives: [
        { title: "SBI Clerk", reason: "Larger bank with more branches", salary: "₹19,900–₹47,920/month", difficulty: "Moderate" },
        { title: "IBPS PO (with graduation)", reason: "Officer level with faster career growth", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "SSC CHSL", reason: "Similar pattern in central government", salary: "₹19,900–₹63,200/month", difficulty: "Moderate" },
        { title: "State Government Clerk", reason: "State-level clerical roles", salary: "₹18,000–₹56,900/month", difficulty: "Moderate" },
      ],
    },
    "sbi-po": {
      fromExam: "SBI PO",
      alternatives: [
        { title: "IBPS PO", reason: "Similar officer role across multiple banks", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "RBI Grade B", reason: "Regulatory role with excellent work-life balance", salary: "₹55,200–₹1,08,650/month", difficulty: "Very Hard" },
        { title: "NABARD Grade A/B", reason: "Development banking with unique focus", salary: "₹44,500–₹89,100/month", difficulty: "Hard" },
        { title: "SIDBI Grade A", reason: "MSME financing role in development bank", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
      ],
    },
    "sbi-clerk": {
      fromExam: "SBI Clerk",
      alternatives: [
        { title: "IBPS Clerk", reason: "Similar clerical role across other banks", salary: "₹19,900–₹47,920/month", difficulty: "Moderate" },
        { title: "SBI PO (next level)", reason: "Officer cadre with promotion opportunities", salary: "₹41,960–₹63,840/month", difficulty: "Hard" },
        { title: "SSC CHSL", reason: "Central government clerical posts", salary: "₹19,900–₹63,200/month", difficulty: "Moderate" },
        { title: "India Post MTS", reason: "Multi-tasking staff in postal department", salary: "₹18,000–₹56,900/month", difficulty: "Easy" },
      ],
    },
    "rrb-ntpc": {
      fromExam: "RRB NTPC",
      alternatives: [
        { title: "SSC CGL", reason: "Central government posts with better pay", salary: "₹44,900–₹1,42,400/month", difficulty: "Hard" },
        { title: "IBPS Clerk", reason: "Banking sector with similar pattern", salary: "₹19,900–₹47,920/month", difficulty: "Moderate" },
        { title: "RRB Group D", reason: "Easier entry into railways", salary: "₹18,000–₹56,900/month", difficulty: "Easy" },
        { title: "State Government Exams", reason: "Similar syllabus overlap with state exams", salary: "₹18,000–₹1,12,400/month", difficulty: "Moderate" },
      ],
    },
    "rrb-je": {
      fromExam: "RRB JE",
      alternatives: [
        { title: "SSC JE", reason: "Similar technical recruitment for central govt", salary: "₹35,400–₹1,12,400/month", difficulty: "Hard" },
        { title: "DRDO / ISRO recruitment", reason: "Premier research organization recruitment", salary: "₹56,100–₹1,77,500/month", difficulty: "Very Hard" },
        { title: "PSU recruitment (via GATE)", reason: "Public sector undertaking engineering jobs", salary: "₹6,00,000–₹18,00,000/year", difficulty: "Hard" },
        { title: "State PWD / Irrigation dept.", reason: "State-level engineering posts", salary: "₹35,400–₹1,12,400/month", difficulty: "Moderate" },
      ],
    },
    "tnpsc-g1": {
      fromExam: "TNPSC Group 1",
      alternatives: [
        { title: "UPSC Civil Services", reason: "National-level equivalent with wider scope", salary: "₹56,100–₹2,50,000/month", difficulty: "Very Hard" },
        { title: "TNPSC Group 2", reason: "State-level Class II posts", salary: "₹19,500–₹1,15,200/month", difficulty: "Hard" },
        { title: "Banking (IBPS/SBI PO)", reason: "Central government banking with analytical skills", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "SSC CGL", reason: "Central government Group B posts", salary: "₹44,900–₹1,42,400/month", difficulty: "Moderate" },
      ],
    },
    "tnpsc-g2": {
      fromExam: "TNPSC Group 2",
      alternatives: [
        { title: "TNPSC Group 1", reason: "Higher level state services", salary: "₹37,700–₹1,38,500/month", difficulty: "Very Hard" },
        { title: "SSC CGL", reason: "Central government posts with similar pattern", salary: "₹44,900–₹1,42,400/month", difficulty: "Moderate" },
        { title: "RRB NTPC", reason: "Railway recruitment with similar pattern", salary: "₹19,900–₹47,920/month", difficulty: "Moderate" },
        { title: "Banking Clerk/PO", reason: "Banking sector entry", salary: "₹19,900–₹63,840/month", difficulty: "Moderate" },
      ],
    },
    "neet": {
      fromExam: "NEET",
      alternatives: [
        { title: "BAMS/BHMS/BVMS", reason: "Alternative medical degrees with NEET score", salary: "₹30,000–₹80,000/month", difficulty: "Moderate" },
        { title: "B.Sc Nursing", reason: "Healthcare career with growing demand", salary: "₹25,000–₹55,000/month", difficulty: "Moderate" },
        { title: "Pharmacy (B.Pharm)", reason: "Pharmaceutical industry with biology background", salary: "₹20,000–₹50,000/month", difficulty: "Moderate" },
        { title: "Biotechnology / Life Sciences", reason: "Research and industry careers in biotech", salary: "₹25,000–₹70,000/month", difficulty: "Moderate" },
      ],
    },
    "clat": {
      fromExam: "CLAT",
      alternatives: [
        { title: "AILET (NLU Delhi)", reason: "Separate exam for NLU Delhi admission", salary: "₹60,000–₹1,50,000/month", difficulty: "Hard" },
        { title: "LSAT / Other Law Entrance", reason: "Private law schools via different entrance", salary: "₹30,000–₹1,50,000/month", difficulty: "Moderate" },
        { title: "Civil Services (UPSC)", reason: "Law graduates have strong UPSC track record", salary: "₹56,100–₹2,50,000/month", difficulty: "Very Hard" },
        { title: "Judiciary (PCS-J)", reason: "Direct judicial services after law degree", salary: "₹44,900–₹1,42,400/month", difficulty: "Very Hard" },
      ],
    },
    "gate": {
      fromExam: "GATE",
      alternatives: [
        { title: "PSU recruitment (direct)", reason: "GATE score used by PSUs like ONGC, NTPC, IOCL", salary: "₹6,00,000–₹18,00,000/year", difficulty: "Hard" },
        { title: "M.Tech at IITs/NITs", reason: "Research and specialization leading to better placements", salary: "₹10,00,000–₹40,00,000/year", difficulty: "Hard" },
        { title: "DRDO / ISRO / BARC", reason: "Research scientist roles in premier organizations", salary: "₹56,100–₹1,77,500/month", difficulty: "Very Hard" },
        { title: "Private Sector (Software/Consulting)", reason: "Directly use engineering skills in industry", salary: "₹6,00,000–₹30,00,000/year", difficulty: "Moderate" },
        { title: "Banking (IBPS/SBI PO)", reason: "Government sector alternative with analytical skills", salary: "₹36,000–₹63,840/month", difficulty: "Moderate" },
      ],
    },
    "cat": {
      fromExam: "CAT",
      alternatives: [
        { title: "XAT (XLRI)", reason: "Top MBA entrance with HR/BM specialization", salary: "₹15,00,000–₹40,00,000/year", difficulty: "Hard" },
        { title: "SNAP/NMAT/CMAT", reason: "Other MBA entrances for Symbiosis, NMIMS, etc.", salary: "₹8,00,000–₹25,00,000/year", difficulty: "Moderate" },
        { title: "Banking (IBPS/SBI PO)", reason: "Government sector with analytical skills", salary: "₹36,000–₹63,840/month", difficulty: "Hard" },
        { title: "UPSC Civil Services", reason: "Similar aptitude for GK and analytical skills", salary: "₹56,100–₹2,50,000/month", difficulty: "Very Hard" },
        { title: "Corporate Sector (direct)", reason: "MBA skills applicable in management roles", salary: "₹6,00,000–₹20,00,000/year", difficulty: "Moderate" },
      ],
    },
  };

  return (
    fallbacks[examId] || {
      fromExam: examId,
      alternatives: [
        { title: "Banking Exams (IBPS/SBI)", reason: "Analytical skills transferable to banking sector", salary: "₹19,900–₹63,840/month", difficulty: "Moderate to Hard" },
        { title: "SSC CGL", reason: "Central government recruitment with similar pattern", salary: "₹44,900–₹1,42,400/month", difficulty: "Moderate" },
        { title: "State Government Exams", reason: "State-level recruitment with syllabus overlap", salary: "₹18,000–₹1,12,400/month", difficulty: "Moderate" },
      ],
    }
  );
}

export function compareGovtVsPrivate(role: string): GovtVsPrivate[] {
  const roleLower = role.toLowerCase();

  if (roleLower.includes("ias") || roleLower.includes("civil") || roleLower.includes("collector")) {
    return [
      { category: "Starting Salary", govt: "₹56,100/month (IAS)", private: "₹8,00,000–₹25,00,000/year (Management)", winner: "private" },
      { category: "Job Security", govt: "Lifetime – constitutional protection", private: "At-will employment, layoffs common", winner: "government" },
      { category: "Work-Life Balance", govt: "Varies by posting – can be demanding", private: "Depends on company, often 50-60 hr weeks", winner: "tie" },
      { category: "Prestige", govt: "Immense – highest administrative authority", private: "Depends on company/role", winner: "government" },
      { category: "Growth Potential", govt: "Slow but guaranteed promotions to highest levels", private: "Fast if high performer, stagnation risk", winner: "tie" },
      { category: "Pension/Benefits", govt: "NPS + NPS + housing + vehicle + staff", private: "Variable, 401k-style", winner: "government" },
      { category: "Autonomy", govt: "District-level decision making power", private: "Within defined roles", winner: "government" },
      { category: "Long-term Wealth", govt: "Moderate but very stable", private: "Higher ceiling but more volatile", winner: "private" },
    ];
  }

  if (roleLower.includes("bank") || roleLower.includes("po") || roleLower.includes("clerk")) {
    return [
      { category: "Starting Salary", govt: "₹36,000–₹63,840/month (Bank PO)", private: "₹3,50,000–₹8,00,000/year (Private bank)", winner: "government" },
      { category: "Job Security", govt: "Very high – rarely terminated", private: "Performance-based, high attrition", winner: "government" },
      { category: "Work Hours", govt: "10 AM–5 PM mostly, Sat off", private: "Often extended hours, targets pressure", winner: "government" },
      { category: "Career Growth", govt: "Promotions every 5-7 years", private: "Faster initially, ceiling later", winner: "tie" },
      { category: "Perks & Allowances", govt: "DA, HRA, travel, medical, LTC", private: "Variable, often limited", winner: "government" },
      { category: "Innovation", govt: "Limited – bureaucratic processes", private: "More scope for tech adoption", winner: "private" },
      { category: "Long-term Wealth", govt: "Stable but capped at scale", private: "Higher ceiling in private banking/fintech", winner: "private" },
      { category: "Transfer/Location", govt: "Frequent transfers across districts", private: "Usually fixed location", winner: "private" },
    ];
  }

  if (roleLower.includes("engineer") || roleLower.includes("rrb je") || roleLower.includes("ssc je")) {
    return [
      { category: "Starting Salary", govt: "₹35,400–₹1,12,400/month (Railways/JE)", private: "₹4,00,000–₹12,00,000/year", winner: "government" },
      { category: "Job Security", govt: "Lifetime employment", private: "At-will, layoffs during downturns", winner: "government" },
      { category: "Technical Work", govt: "Maintenance, inspection focused", private: "Design, development, innovation", winner: "private" },
      { category: "Work Culture", govt: "Structured, hierarchical", private: "Dynamic, fast-paced", winner: "private" },
      { category: "Work-Life Balance", govt: "Good, fixed hours", private: "Variable, often demanding", winner: "government" },
      { category: "Growth Speed", govt: "Slow but guaranteed", private: "Merit-based, faster for top performers", winner: "private" },
      { category: "Benefits", govt: "Pension + housing + medical + LTC", private: "Variable, often better tech perks", winner: "government" },
      { category: "Innovation", govt: "Limited – legacy systems", private: "Cutting-edge technologies", winner: "private" },
    ];
  }

  // Default comparison for general roles
  return [
    { category: "Starting Salary", govt: "₹19,900–₹63,840/month", private: "₹3,00,000–₹15,00,000/year", winner: "tie" },
    { category: "Job Security", govt: "Lifetime – extremely hard to lose", private: "At-will employment", winner: "government" },
    { category: "Work-Life Balance", govt: "Generally good, fixed hours", private: "Varies widely by company", winner: "government" },
    { category: "Career Growth", govt: "Slow, seniority-based", private: "Fast if high-performing", winner: "private" },
    { category: "Pension & Benefits", govt: "NPS + housing + medical + LTC", private: "Variable, 401k-style", winner: "government" },
    { category: "Work Environment", govt: "Hierarchical, bureaucratic", private: "Dynamic, modern", winner: "private" },
    { category: "Innovation Scope", govt: "Limited by processes", private: "Higher scope", winner: "private" },
    { category: "Social Impact", govt: "Direct policy implementation", private: "Varies by industry", winner: "government" },
    { category: "Retirement Benefits", govt: "NPS + pension + gratuity", private: "Provident fund + gratuity", winner: "government" },
    { category: "Long-term Wealth", govt: "Stable accumulation", private: "Higher ceiling, more risk", winner: "private" },
  ];
}
