export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  type: "full-time" | "part-time" | "internship" | "remote" | "contract";
  salary: string;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  industries: string[];
  description: string;
  url: string;
  applyUrl: string;
  postedDaysAgo: number;
  experience: string;
  education: string;
  openings: number;
  urgent: boolean;
}

export const JOB_DATABASE: JobListing[] = [
  { id: "ch01", title: "Software Engineer", company: "TCS", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹4â€“8 LPA", salaryMin: 4, salaryMax: 8, requiredSkills: ["Programming", "Java", "SQL", "Problem Solving"], industries: ["Technology"], description: "Develop enterprise solutions for global clients. Work on Java, microservices, and cloud-native apps.", url: "https://careers.tcs.com", applyUrl: "https://careers.tcs.com/iapply.html", postedDaysAgo: 1, experience: "0â€“2 years", education: "B.Tech/BCA", openings: 500, urgent: false },
  { id: "ch02", title: "Python Developer", company: "Infosys", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“10 LPA", salaryMin: 5, salaryMax: 10, requiredSkills: ["Python", "Django", "SQL", "REST API", "Git"], industries: ["Technology"], description: "Build backend services and APIs for banking and retail clients.", url: "https://infosys.com/careers", applyUrl: "https://careers.infosys.com", postedDaysAgo: 2, experience: "1â€“3 years", education: "B.Tech/BCA", openings: 300, urgent: false },
  { id: "ch03", title: "Data Analyst", company: "Cognizant", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹4â€“9 LPA", salaryMin: 4, salaryMax: 9, requiredSkills: ["SQL", "Excel", "Python", "Data Visualization", "Statistics"], industries: ["Technology", "Consulting"], description: "Analyze business data, build dashboards, and present insights to stakeholders.", url: "https://cognizant.com/careers", applyUrl: "https://cognizant.com/careers", postedDaysAgo: 3, experience: "0â€“2 years", education: "B.Tech/B.Sc", openings: 200, urgent: false },
  { id: "ch04", title: "Full Stack Developer", company: "Zoho", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹6â€“14 LPA", salaryMin: 6, salaryMax: 14, requiredSkills: ["JavaScript", "React", "Node.js", "Python", "SQL"], industries: ["Technology"], description: "Build SaaS products used by millions. Full-stack development with React and Python.", url: "https://zoho.com/careers", applyUrl: "https://zoho.com/careers", postedDaysAgo: 1, experience: "1â€“4 years", education: "B.Tech", openings: 150, urgent: true },
  { id: "ch05", title: "DevOps Engineer", company: "Freshworks", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹7â€“15 LPA", salaryMin: 7, salaryMax: 15, requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Python"], industries: ["Technology"], description: "Manage cloud infrastructure and CI/CD pipelines for SaaS products.", url: "https://freshworks.com/careers", applyUrl: "https://freshworks.com/careers", postedDaysAgo: 2, experience: "2â€“5 years", education: "B.Tech", openings: 80, urgent: false },
  { id: "ch06", title: "QA Engineer", company: "TCS", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹3.5â€“7 LPA", salaryMin: 3.5, salaryMax: 7, requiredSkills: ["Testing", "Selenium", "SQL", "Java", "Bug Tracking"], industries: ["Technology"], description: "Manual and automated testing for enterprise applications.", url: "https://careers.tcs.com", applyUrl: "https://careers.tcs.com/iapply.html", postedDaysAgo: 4, experience: "0â€“2 years", education: "B.Tech/BCA", openings: 400, urgent: false },
  { id: "ch07", title: "Cloud Architect", company: "Amazon AWS", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹12â€“25 LPA", salaryMin: 12, salaryMax: 25, requiredSkills: ["AWS", "Cloud Computing", "System Design", "Networking", "Terraform"], industries: ["Technology"], description: "Design and build scalable cloud solutions for enterprise clients.", url: "https://aws.amazon.com/careers", applyUrl: "https://amazon.jobs", postedDaysAgo: 3, experience: "3â€“7 years", education: "B.Tech", openings: 40, urgent: true },
  { id: "ch08", title: "AI/ML Engineer", company: "Ramco Systems", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹8â€“18 LPA", salaryMin: 8, salaryMax: 18, requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Deep Learning", "NLP"], industries: ["Technology"], description: "Build AI-powered HR and aviation software products.", url: "https://ramco.com/careers", applyUrl: "https://ramco.com/careers", postedDaysAgo: 2, experience: "2â€“5 years", education: "B.Tech/M.Tech", openings: 30, urgent: false },
  { id: "ch09", title: "Cybersecurity Analyst", company: "HCLTech", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“12 LPA", salaryMin: 5, salaryMax: 12, requiredSkills: ["Network Security", "Incident Response", "SIEM", "Risk Assessment", "Ethical Hacking"], industries: ["Technology"], description: "Monitor and protect enterprise networks from cyber threats.", url: "https://hcltech.com/careers", applyUrl: "https://hcltech.com/careers", postedDaysAgo: 1, experience: "1â€“4 years", education: "B.Tech", openings: 100, urgent: true },
  { id: "ch10", title: "Mobile App Developer", company: "Freshworks", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹6â€“13 LPA", salaryMin: 6, salaryMax: 13, requiredSkills: ["React Native", "JavaScript", "TypeScript", "iOS", "Android"], industries: ["Technology"], description: "Build mobile apps for Freshdesk and Freshsales products.", url: "https://freshworks.com/careers", applyUrl: "https://freshworks.com/careers", postedDaysAgo: 3, experience: "1â€“4 years", education: "B.Tech", openings: 60, urgent: false },
  { id: "ch11", title: "Business Analyst", company: "Wipro", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“11 LPA", salaryMin: 5, salaryMax: 11, requiredSkills: ["Data Analysis", "SQL", "Communication", "Excel", "Requirement Gathering"], industries: ["Technology", "Consulting"], description: "Bridge business needs with technical solutions. Gather requirements and analyze data.", url: "https://wipro.com/careers", applyUrl: "https://wipro.com/careers", postedDaysAgo: 4, experience: "1â€“4 years", education: "B.Tech/MBA", openings: 120, urgent: false },
  { id: "ch12", title: "Product Manager", company: "Zoho", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹10â€“20 LPA", salaryMin: 10, salaryMax: 20, requiredSkills: ["Strategy", "Communication", "Data Analysis", "User Empathy", "Leadership"], industries: ["Technology"], description: "Lead product strategy for Zoho's CRM suite.", url: "https://zoho.com/careers", applyUrl: "https://zoho.com/careers", postedDaysAgo: 5, experience: "3â€“7 years", education: "B.Tech/MBA", openings: 20, urgent: false },
  { id: "ch13", title: "UI/UX Designer", company: "Freshworks", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“12 LPA", salaryMin: 5, salaryMax: 12, requiredSkills: ["Figma", "Design Thinking", "User Research", "Prototyping", "Visual Design"], industries: ["Technology"], description: "Design intuitive interfaces for SaaS products used by 60K+ businesses.", url: "https://freshworks.com/careers", applyUrl: "https://freshworks.com/careers", postedDaysAgo: 2, experience: "1â€“4 years", education: "B.Des/B.Tech", openings: 40, urgent: false },
  { id: "ch14", title: "Technical Writer", company: "Zoho", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹4â€“8 LPA", salaryMin: 4, salaryMax: 8, requiredSkills: ["Writing", "Technical Documentation", "Communication", "HTML"], industries: ["Technology"], description: "Write documentation for SaaS products. Clear, concise technical writing.", url: "https://zoho.com/careers", applyUrl: "https://zoho.com/careers", postedDaysAgo: 6, experience: "0â€“3 years", education: "Any Graduate", openings: 30, urgent: false },
  { id: "ch15", title: "Database Administrator", company: "Cognizant", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“11 LPA", salaryMin: 5, salaryMax: 11, requiredSkills: ["SQL", "Oracle", "MySQL", "PostgreSQL", "Database Design"], industries: ["Technology"], description: "Manage and optimize database systems for enterprise clients.", url: "https://cognizant.com/careers", applyUrl: "https://cognizant.com/careers", postedDaysAgo: 3, experience: "2â€“5 years", education: "B.Tech", openings: 80, urgent: false },
  { id: "ch16", title: "Network Engineer", company: "HCLTech", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹4â€“9 LPA", salaryMin: 4, salaryMax: 9, requiredSkills: ["Networking", "CCNA", "TCP/IP", "Firewall", "Router Configuration"], industries: ["Technology"], description: "Configure and maintain enterprise network infrastructure.", url: "https://hcltech.com/careers", applyUrl: "https://hcltech.com/careers", postedDaysAgo: 5, experience: "1â€“4 years", education: "B.Tech/BCA", openings: 100, urgent: false },
  { id: "ch17", title: "RPA Developer", company: "Infosys", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹6â€“13 LPA", salaryMin: 6, salaryMax: 13, requiredSkills: ["Python", "UiPath", "Automation", "SQL", "Problem Solving"], industries: ["Technology"], description: "Build robotic process automation solutions for business processes.", url: "https://infosys.com/careers", applyUrl: "https://careers.infosys.com", postedDaysAgo: 4, experience: "1â€“4 years", education: "B.Tech", openings: 60, urgent: false },
  { id: "cb01", title: "Software Developer", company: "L&T Technology", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹4â€“9 LPA", salaryMin: 4, salaryMax: 9, requiredSkills: ["Java", "Python", "SQL", "Problem Solving"], industries: ["Technology", "Manufacturing"], description: "Build industrial IoT and embedded software solutions.", url: "https://ltts.com/careers", applyUrl: "https://ltts.com/careers", postedDaysAgo: 2, experience: "0â€“3 years", education: "B.Tech", openings: 100, urgent: false },
  { id: "cb02", title: "Data Scientist", company: "IBM", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹7â€“16 LPA", salaryMin: 7, salaryMax: 16, requiredSkills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"], industries: ["Technology"], description: "Build ML models for enterprise AI solutions.", url: "https://ibm.com/careers", applyUrl: "https://ibm.com/careers", postedDaysAgo: 3, experience: "2â€“5 years", education: "B.Tech/M.Tech", openings: 40, urgent: false },
  { id: "cb03", title: "Mechanical Design Engineer", company: "Tata Motors", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹4â€“8 LPA", salaryMin: 4, salaryMax: 8, requiredSkills: ["CAD", "SolidWorks", "AutoCAD", "Mechanical Design", "Physics"], industries: ["Automotive", "Manufacturing"], description: "Design automotive components and assemblies.", url: "https://tatamotors.com/careers", applyUrl: "https://tatamotors.com/careers", postedDaysAgo: 5, experience: "0â€“3 years", education: "B.Tech Mechanical", openings: 60, urgent: false },
  { id: "cb04", title: "Electronics Engineer", company: "Bosch", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹5â€“10 LPA", salaryMin: 5, salaryMax: 10, requiredSkills: ["Embedded Systems", "C", "C++", "PCB Design", "Microcontrollers"], industries: ["Automotive", "Technology"], description: "Develop embedded systems for automotive electronics.", url: "https://bosch.com/careers", applyUrl: "https://bosch.com/careers", postedDaysAgo: 4, experience: "1â€“4 years", education: "B.Tech ECE", openings: 50, urgent: false },
  { id: "cb05", title: "Quality Engineer", company: "Toyota", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹4â€“8 LPA", salaryMin: 4, salaryMax: 8, requiredSkills: ["Quality Assurance", "Six Sigma", "SPC", "Problem Solving", "Manufacturing"], industries: ["Automotive", "Manufacturing"], description: "Ensure product quality and process improvement in manufacturing.", url: "https://toyota.com/careers", applyUrl: "https://toyota.com/careers", postedDaysAgo: 6, experience: "1â€“3 years", education: "B.Tech", openings: 30, urgent: false },
  { id: "cb06", title: "Cloud Support Engineer", company: "Amazon AWS", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹5â€“12 LPA", salaryMin: 5, salaryMax: 12, requiredSkills: ["AWS", "Linux", "Networking", "Python", "Troubleshooting"], industries: ["Technology"], description: "Support AWS customers with cloud infrastructure issues.", url: "https://aws.amazon.com/careers", applyUrl: "https://amazon.jobs", postedDaysAgo: 2, experience: "1â€“4 years", education: "B.Tech", openings: 40, urgent: true },
  { id: "cb07", title: "Civil Engineer", company: "L&T Construction", location: "Coimbatore, Tamil Nadu", city: "Coimbatore", type: "full-time", salary: "â‚¹4â€“9 LPA", salaryMin: 4, salaryMax: 9, requiredSkills: ["Structural Analysis", "AutoCAD", "Project Management", "Construction"], industries: ["Construction"], description: "Supervise construction projects. Site management and structural design.", url: "https://ltrig.com/careers", applyUrl: "https://ltrig.com/careers", postedDaysAgo: 3, experience: "0â€“3 years", education: "B.Tech Civil", openings: 80, urgent: false },
  { id: "md01", title: "Software Engineer", company: "TCS", location: "Madurai, Tamil Nadu", city: "Madurai", type: "full-time", salary: "â‚¹3.5â€“7 LPA", salaryMin: 3.5, salaryMax: 7, requiredSkills: ["Java", "SQL", "Problem Solving", "Programming"], industries: ["Technology"], description: "Enterprise software development for global clients.", url: "https://careers.tcs.com", applyUrl: "https://careers.tcs.com/iapply.html", postedDaysAgo: 2, experience: "0â€“2 years", education: "B.Tech/BCA", openings: 200, urgent: false },
  { id: "md02", title: "Web Developer", company: "Infosys BPO", location: "Madurai, Tamil Nadu", city: "Madurai", type: "full-time", salary: "â‚¹3â€“6 LPA", salaryMin: 3, salaryMax: 6, requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Git"], industries: ["Technology"], description: "Build web applications for business process outsourcing clients.", url: "https://infosys.com/careers", applyUrl: "https://careers.infosys.com", postedDaysAgo: 4, experience: "0â€“2 years", education: "BCA/B.Sc", openings: 100, urgent: false },
  { id: "md03", title: "BPO Team Lead", company: "Wipro", location: "Madurai, Tamil Nadu", city: "Madurai", type: "full-time", salary: "â‚¹3.5â€“7 LPA", salaryMin: 3.5, salaryMax: 7, requiredSkills: ["Communication", "Leadership", "Customer Service", "Team Management"], industries: ["BPO", "Technology"], description: "Lead a team of 20+ customer service representatives.", url: "https://wipro.com/careers", applyUrl: "https://wipro.com/careers", postedDaysAgo: 3, experience: "2â€“5 years", education: "Any Graduate", openings: 50, urgent: false },
  { id: "sl01", title: "Production Engineer", company: "SAIL", location: "Salem, Tamil Nadu", city: "Salem", type: "full-time", salary: "â‚¹4â€“9 LPA", salaryMin: 4, salaryMax: 9, requiredSkills: ["Manufacturing", "Quality Control", "Process Improvement", "AutoCAD"], industries: ["Manufacturing", "Steel"], description: "Manage steel production processes and quality control.", url: "https://sail.co.in/careers", applyUrl: "https://sail.co.in/careers", postedDaysAgo: 5, experience: "0â€“3 years", education: "B.Tech", openings: 40, urgent: false },
  { id: "sl03", title: "Java Developer", company: "Cognizant", location: "Salem, Tamil Nadu", city: "Salem", type: "full-time", salary: "â‚¹4â€“8 LPA", salaryMin: 4, salaryMax: 8, requiredSkills: ["Java", "Spring Boot", "SQL", "REST API", "Git"], industries: ["Technology"], description: "Build Java backend services for healthcare clients.", url: "https://cognizant.com/careers", applyUrl: "https://cognizant.com/careers", postedDaysAgo: 3, experience: "1â€“3 years", education: "B.Tech", openings: 60, urgent: false },
  { id: "tr01", title: "System Engineer", company: "Infosys", location: "Trichy, Tamil Nadu", city: "Trichy", type: "full-time", salary: "â‚¹3.5â€“7 LPA", salaryMin: 3.5, salaryMax: 7, requiredSkills: ["Java", "SQL", "Problem Solving", "Programming"], industries: ["Technology"], description: "Develop and maintain enterprise applications.", url: "https://infosys.com/careers", applyUrl: "https://careers.infosys.com", postedDaysAgo: 2, experience: "0â€“2 years", education: "B.Tech/BCA", openings: 150, urgent: false },
  { id: "tr02", title: "Lecturer (Computer Science)", company: "NIT Trichy", location: "Trichy, Tamil Nadu", city: "Trichy", type: "full-time", salary: "â‚¹6â€“12 LPA", salaryMin: 6, salaryMax: 12, requiredSkills: ["Teaching", "Computer Science", "Research", "Communication"], industries: ["Education"], description: "Teach CS courses and conduct research at NIT Trichy.", url: "https://nitt.edu/careers", applyUrl: "https://nitt.edu/careers", postedDaysAgo: 8, experience: "3â€“7 years", education: "Ph.D/M.Tech", openings: 10, urgent: false },
  { id: "tr03", title: "Railway Engineer", company: "Indian Railways", location: "Trichy, Tamil Nadu", city: "Trichy", type: "full-time", salary: "â‚¹5â€“10 LPA", salaryMin: 5, salaryMax: 10, requiredSkills: ["Electrical Engineering", "Maintenance", "Safety", "Problem Solving"], industries: ["Government", "Transport"], description: "Maintain and operate railway electrical systems.", url: "https://indianrailways.gov.in", applyUrl: "https://rrbapply.gov.in", postedDaysAgo: 10, experience: "0â€“5 years", education: "B.Tech", openings: 50, urgent: false },
  { id: "tr04", title: "Bank PO", company: "SBI", location: "Trichy, Tamil Nadu", city: "Trichy", type: "full-time", salary: "â‚¹5â€“12 LPA", salaryMin: 5, salaryMax: 12, requiredSkills: ["Banking", "Communication", "Excel", "Customer Service", "Problem Solving"], industries: ["Banking", "Finance"], description: "Probationary Officer at State Bank of India branches.", url: "https://sbi.co.in/careers", applyUrl: "https://ibpsonline.ibps.in", postedDaysAgo: 15, experience: "0â€“2 years", education: "Any Graduate", openings: 100, urgent: false },
  { id: "hc01", title: "Staff Nurse", company: "Apollo Hospitals", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹3â€“6 LPA", salaryMin: 3, salaryMax: 6, requiredSkills: ["Nursing", "Patient Care", "Communication", "Empathy"], industries: ["Healthcare"], description: "Provide patient care at Apollo Hospitals Chennai.", url: "https://apollohospitals.com/careers", applyUrl: "https://apollohospitals.com/careers", postedDaysAgo: 1, experience: "0â€“3 years", education: "B.Sc Nursing", openings: 100, urgent: true },
  { id: "hc02", title: "Pharmacist", company: "Apollo Pharmacy", location: "Madurai, Tamil Nadu", city: "Madurai", type: "full-time", salary: "â‚¹2.5â€“5 LPA", salaryMin: 2.5, salaryMax: 5, requiredSkills: ["Pharmacology", "Attention to Detail", "Communication"], industries: ["Healthcare"], description: "Dispense medications and advise patients.", url: "https://apollopharmacy.in", applyUrl: "https://apollopharmacy.in", postedDaysAgo: 2, experience: "0â€“2 years", education: "B.Pharm", openings: 50, urgent: false },
  { id: "bf01", title: "IBPS Clerk", company: "Multiple Banks", location: "Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹3â€“6 LPA", salaryMin: 3, salaryMax: 6, requiredSkills: ["Banking", "Excel", "Communication", "Customer Service"], industries: ["Banking"], description: "Clerical position in public sector banks across Tamil Nadu.", url: "https://ibps.in", applyUrl: "https://ibpsonline.ibps.in", postedDaysAgo: 10, experience: "0 years", education: "Any Graduate", openings: 500, urgent: false },
  { id: "bf03", title: "Financial Analyst", company: "TCS BFS", location: "Chennai, Tamil Nadu", city: "Chennai", type: "full-time", salary: "â‚¹5â€“11 LPA", salaryMin: 5, salaryMax: 11, requiredSkills: ["Financial Modeling", "Excel", "SQL", "Statistics", "Communication"], industries: ["Finance", "Technology"], description: "Financial modeling and analysis for banking clients.", url: "https://careers.tcs.com", applyUrl: "https://careers.tcs.com/iapply.html", postedDaysAgo: 3, experience: "1â€“4 years", education: "B.Tech/MBA Finance", openings: 80, urgent: false },
  { id: "rm01", title: "Freelance Web Developer", company: "Upwork Clients", location: "Remote (Tamil Nadu)", city: "Remote", type: "remote", salary: "â‚¹3â€“15 LPA", salaryMin: 3, salaryMax: 15, requiredSkills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Git"], industries: ["Technology", "Freelance"], description: "Work with global clients on web development projects.", url: "https://upwork.com", applyUrl: "https://upwork.com", postedDaysAgo: 1, experience: "0â€“5 years", education: "Any", openings: 500, urgent: false },
  { id: "rm03", title: "Digital Marketing Specialist", company: "Startup", location: "Remote (Tamil Nadu)", city: "Remote", type: "remote", salary: "â‚¹4â€“10 LPA", salaryMin: 4, salaryMax: 10, requiredSkills: ["SEO", "Social Media", "Content Strategy", "Google Ads", "Analytics"], industries: ["Marketing"], description: "Manage digital marketing campaigns for startups.", url: "https://linkedin.com/jobs", applyUrl: "https://linkedin.com/jobs", postedDaysAgo: 2, experience: "1â€“4 years", education: "Any Graduate", openings: 80, urgent: false },
  { id: "rm05", title: "Customer Support (Tamil)", company: "Amazon", location: "Remote (Tamil Nadu)", city: "Remote", type: "remote", salary: "â‚¹2.5â€“4 LPA", salaryMin: 2.5, salaryMax: 4, requiredSkills: ["Communication", "Tamil", "Customer Service", "Problem Solving"], industries: ["E-commerce"], description: "Tamil-language customer support for Amazon customers.", url: "https://amazon.jobs", applyUrl: "https://amazon.jobs", postedDaysAgo: 1, experience: "0â€“2 years", education: "Any Graduate", openings: 300, urgent: true },
];

const SKILL_SYNONYMS: Record<string, string[]> = {
  "javascript": ["js", "es6", "es2015", "ecmascript"],
  "python": ["py", "python3"],
  "react": ["reactjs", "react.js"],
  "node": ["nodejs", "node.js", "express"],
  "machine learning": ["ml", "artificial intelligence", "ai"],
  "sql": ["mysql", "postgresql", "database"],
  "devops": ["ci/cd", "continuous integration", "docker", "kubernetes"],
  "typescript": ["ts"],
  "java": ["spring", "spring boot"],
  "css": ["tailwind", "scss", "sass"],
  "aws": ["amazon web services", "cloud"],
  "azure": ["microsoft azure", "cloud"],
  "gcp": ["google cloud", "google cloud platform"],
};

const SKILL_CATEGORIES: Record<string, string[]> = {
  "frontend": ["javascript", "react", "angular", "vue", "css", "html", "typescript"],
  "backend": ["python", "java", "node.js", "go", "rust", "php", "ruby"],
  "data": ["sql", "python", "statistics", "machine learning", "data visualization"],
  "devops": ["docker", "kubernetes", "aws", "ci/cd", "linux", "terraform"],
  "mobile": ["react native", "flutter", "ios", "android", "swift", "kotlin"],
  "security": ["network security", "penetration testing", "ethical hacking", "siem"],
};

const CAREER_ALIGNMENTS: Record<string, string[]> = {
  "data scientist": ["data analyst", "ml engineer", "ai engineer", "business analyst"],
  "software engineer": ["full stack developer", "backend developer", "frontend developer", "devops engineer"],
  "product manager": ["business analyst", "project manager", "operations manager"],
  "ux designer": ["ui designer", "frontend developer", "product manager"],
  "cybersecurity analyst": ["network engineer", "system administrator", "security engineer"],
};

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s/\-\.]/g, "");
}

function skillMatches(userSkill: string, jobSkill: string): boolean {
  const u = normalize(userSkill);
  const j = normalize(jobSkill);

  if (u === j) return true;
  if (u.includes(j) || j.includes(u)) return true;

  for (const [key, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    const allVariants = [key, ...synonyms].map(normalize);
    if (allVariants.includes(u) && allVariants.includes(j)) return true;
  }

  if (u.length >= 4 && j.length >= 4) {
    let matches = 0;
    for (let i = 0; i < Math.min(u.length, j.length); i++) {
      if (u[i] === j[i]) matches++;
    }
    if (matches / Math.max(u.length, j.length) > 0.75) return true;
  }

  return false;
}

function skillInCategory(skill: string, categories: string[]): boolean {
  const s = normalize(skill);
  for (const cat of Object.entries(SKILL_CATEGORIES)) {
    if (categories.includes(cat[0])) {
      if (cat[1].some(c => normalize(c) === s || normalize(c).includes(s) || s.includes(normalize(c)))) return true;
    }
  }
  return false;
}

function parseExperienceYears(exp: string): number {
  const m = exp.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function estimateUserExperience(skills: string[], education: string): number {
  let years = Math.max(0, skills.length - 2) * 0.5;
  const edu = normalize(education);
  if (edu.includes("phd") || edu.includes("doctorate")) years += 5;
  else if (edu.includes("m.tech") || edu.includes("master") || edu.includes("mba") || edu.includes("mca")) years += 2;
  else if (edu.includes("b.tech") || edu.includes("bachelor") || edu.includes("bca") || edu.includes("b.sc")) years += 0;
  return Math.min(years, 15);
}

function parseCity(jobLocation: string): string {
  return normalize(jobLocation.split(",")[0]);
}

function careerAligns(userCareer: string, jobTitle: string): boolean {
  const u = normalize(userCareer);
  const j = normalize(jobTitle);

  if (u === j || u.includes(j) || j.includes(u)) return true;

  for (const [career, aligned] of Object.entries(CAREER_ALIGNMENTS)) {
    const allCareerTerms = [career, ...aligned].map(normalize);
    if (allCareerTerms.includes(u) && allCareerTerms.includes(j)) return true;
  }

  const uWords = u.split(/\s+/);
  const jWords = j.split(/\s+/);
  const overlap = uWords.filter(w => jWords.includes(w) && w.length > 3);
  if (overlap.length >= 2) return true;

  return false;
}

export function matchJobs(userSkills: string[], userInterests: string[], topCareerTitles: string[]): (JobListing & { matchScore: number })[] {
  const normalizedUserSkills = userSkills.map(normalize);
  const normalizedInterests = userInterests.map(normalize);
  const normalizedCareers = topCareerTitles.map(normalize);
  const userCategories = Object.entries(SKILL_CATEGORIES)
    .filter(([_, skills]) => normalizedUserSkills.some(us => skills.some(s => normalize(s) === us || us.includes(normalize(s)))))
    .map(([cat]) => cat);

  const userExp = estimateUserExperience(userSkills, "");

  return JOB_DATABASE.map(job => {
    // --- 1. Skill Similarity (40%) ---
    const jobSkillsLower = job.requiredSkills.map(normalize);
    let matchedSkills = 0;
    let partialSkillScore = 0;

    for (const userSkill of normalizedUserSkills) {
      const directMatch = jobSkillsLower.some(js => skillMatches(userSkill, js));
      if (directMatch) {
        matchedSkills++;
      } else {
        if (skillInCategory(userSkill, job.industries.map(normalize))) {
          partialSkillScore += 0.3;
        }
        const textMatch = `${job.title} ${job.description}`.toLowerCase();
        if (textMatch.includes(userSkill) && userSkill.length >= 4) {
          partialSkillScore += 0.2;
        }
      }
    }

    for (const jobSkill of jobSkillsLower) {
      if (!normalizedUserSkills.some(us => skillMatches(us, jobSkill))) {
        const interestMatch = normalizedInterests.some(i => skillMatches(i, jobSkill));
        if (interestMatch) partialSkillScore += 0.15;
      }
    }

    const skillScore = Math.min(10, (matchedSkills / Math.max(job.requiredSkills.length, 1)) * 10 + partialSkillScore);

    // --- 2. Experience Level Match (25%) ---
    const jobMinExp = parseExperienceYears(job.experience);
    const jobParts = job.experience.match(/(\d+)\s*[â€“-]\s*(\d+)/);
    const jobMaxExp = jobParts ? parseInt(jobParts[2]) : jobMinExp + 3;
    const jobMidExp = (jobMinExp + jobMaxExp) / 2;

    let expScore = 5;
    if (userExp >= jobMinExp && userExp <= jobMaxExp) {
      expScore = 9;
      const distFromMid = Math.abs(userExp - jobMidExp);
      expScore -= distFromMid * 0.3;
    } else if (userExp < jobMinExp) {
      const gap = jobMinExp - userExp;
      if (gap <= 1) expScore = 7;
      else if (gap <= 2) expScore = 5;
      else expScore = Math.max(2, 5 - gap * 0.8);
    } else {
      const over = userExp - jobMaxExp;
      if (over <= 2) expScore = 8;
      else if (over <= 5) expScore = 6;
      else expScore = Math.max(3, 7 - over * 0.5);
    }

    if (userExp <= 3) {
      const isJunior = job.title.toLowerCase().includes("junior") || job.title.toLowerCase().includes("associate")
        || job.title.toLowerCase().includes("trainee") || jobMinExp <= 2;
      if (isJunior) expScore = Math.min(10, expScore + 1.5);
    }

    expScore = Math.max(0, Math.min(10, expScore));

    // --- 3. Location Preference (15%) ---
    let locationScore = 5;

    if (job.type === "remote" || job.city.toLowerCase() === "remote") {
      locationScore = 9;
    } else {
      const jobCity = parseCity(job.location);
      const userPrefCities = ["chennai", "coimbatore", "madurai", "salem", "trichy", "bangalore", "mumbai", "delhi", "hyderabad", "pune", "remote"];
      const closestMatch = userPrefCities.find(c => c === jobCity);
      if (closestMatch) {
        locationScore = 8;
      } else {
        locationScore = 5;
      }

      if (userInterests.some(i => normalize(i).includes("remote") || normalize(i).includes("work from home"))) {
        if (job.city.toLowerCase() === "remote") locationScore = 10;
        else locationScore = Math.max(3, locationScore - 2);
      }
    }

    locationScore = Math.max(0, Math.min(10, locationScore));

    // --- 4. Industry Affinity (10%) ---
    let industryScore = 3;

    const interestIndustryMap: Record<string, string[]> = {
      "technology": ["technology", "software", "saas", "ai", "ml", "cloud", "devops", "web", "mobile", "data"],
      "finance": ["finance", "banking", "investment", "fintech", "insurance"],
      "healthcare": ["healthcare", "medical", "pharma", "biotech", "nursing"],
      "education": ["education", "edtech", "teaching", "research"],
      "manufacturing": ["manufacturing", "automotive", "industrial", "production"],
      "marketing": ["marketing", "advertising", "seo", "social media", "content"],
    };

    for (const interest of normalizedInterests) {
      for (const [indCategory, keywords] of Object.entries(interestIndustryMap)) {
        if (keywords.some(k => interest.includes(k) || k.includes(interest))) {
          if (job.industries.some(ji => normalize(ji) === indCategory || indCategory.includes(normalize(ji))
            || keywords.some(k => normalize(ji).includes(k)))) {
            industryScore = Math.min(10, industryScore + 3);
          }
        }
      }
    }

    const jobText = `${job.title} ${job.description} ${job.industries.join(" ")}`.toLowerCase();
    for (const interest of normalizedInterests) {
      if (jobText.includes(interest) && interest.length >= 3) {
        industryScore = Math.min(10, industryScore + 1);
      }
    }

    industryScore = Math.max(0, Math.min(10, industryScore));

    // --- 5. Career Trajectory Alignment (10%) ---
    let careerScore = 3;

    for (const career of normalizedCareers) {
      if (careerAligns(career, job.title)) {
        careerScore = Math.min(10, careerScore + 4);
      } else {
        const jobTitleWords = normalize(job.title).split(/\s+/);
        const careerWords = career.split(/\s+/);
        const meaningfulOverlap = careerWords.filter(w => jobTitleWords.includes(w) && w.length > 3);
        if (meaningfulOverlap.length >= 1) {
          careerScore = Math.min(10, careerScore + 2);
        }
      }
    }

    const descLower = job.description.toLowerCase();
    for (const career of normalizedCareers) {
      if (descLower.includes(career) && career.length >= 4) {
        careerScore = Math.min(10, careerScore + 1);
      }
    }

    careerScore = Math.max(0, Math.min(10, careerScore));

    // --- Final Weighted Score ---
    const score =
      skillScore * 0.40 +
      expScore * 0.25 +
      locationScore * 0.15 +
      industryScore * 0.10 +
      careerScore * 0.10;

    const matchScore = Math.round(Math.max(0, Math.min(10, score)) * 100) / 100;

    return { ...job, matchScore };
  }).filter(j => j.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
}

export function searchJobs(query: string, city?: string, type?: string): JobListing[] {
  const q = query.toLowerCase();
  return JOB_DATABASE.filter(j => {
    const text = `${j.title} ${j.company} ${j.description} ${j.requiredSkills.join(" ")}`.toLowerCase();
    if (!text.includes(q)) return false;
    if (city && city !== "all" && j.city.toLowerCase() !== city.toLowerCase()) return false;
    if (type && type !== "all" && j.type !== type) return false;
    return true;
  });
}

// === Adzuna API (real jobs) ===

export interface RealJob {
  id: string; title: string; company: string; companyLogo: string;
  location: string; city: string; type: string; salary: string;
  salaryMin: number; salaryMax: number; description: string; applyUrl: string;
  postedAt: string; experience: string; requiredSkills: string[];
}

export async function fetchRealJobs(params: {
  query?: string; location?: string; country?: string;
  page?: number; resultsPerPage?: number;
}): Promise<{ jobs: RealJob[]; totalCount: number }> {
  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "";
  const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || "";
  if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) return { jobs: [], totalCount: 0 };

  const country = params.country || "in";
  const page = params.page || 1;
  const perPage = params.resultsPerPage || 20;
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
    url.searchParams.set("app_id", ADZUNA_APP_ID);
    url.searchParams.set("app_key", ADZUNA_API_KEY);
    url.searchParams.set("results_per_page", String(perPage));
    if (params.query) url.searchParams.set("what", params.query);
    if (params.location) url.searchParams.set("where", params.location);

    try {
      const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
      if (!res.ok) return { jobs: [], totalCount: 0 };
      const data = await res.json();
      const skills = ["javascript", "typescript", "react", "angular", "vue", "python", "java", "node.js", "node", "go", "rust", "php", "c#", "c++", ".net", "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "sql", "mongodb", "postgresql", "mysql", "oracle", "flutter", "react native", "android", "ios", "swift", "kotlin", "machine learning", "deep learning", "data science", "statistics", "tensorflow", "pytorch", "nlp", "excel", "power bi", "tableau", "html", "css", "git", "linux", "devops", "cybersecurity", "network security", "salesforce", "sap", "communication", "sales", "marketing", "seo", "accounting", "tally", "finance", "banking", "nursing", "healthcare", "patient care", "pharmacology", "teaching", "research", "writing", "content writing", "design", "figma", "ui", "ux", "autocad", "solidworks", "mechanical", "electrical", "civil"];
      const jobs: RealJob[] = (data.results || []).map((r: any) => ({
        id: `adz_${r.id}`, title: r.title || "",
        company: r.company?.display_name || "Unknown", companyLogo: r.company?.logo_url || "",
        location: r.location?.display_name || "",
        city: parseCityFromLocation(r.location?.display_name || ""),
        type: r.contract_type || "full_time",
        salary: r.salary_min ? `â‚¹${Math.round(r.salary_min / 1000)}â€“${Math.round(r.salary_max / 1000)}K` : "Not specified",
        salaryMin: r.salary_min || 0, salaryMax: r.salary_max || 0,
        description: r.description?.replace(/<[^>]*>/g, "").substring(0, 300) || "",
        applyUrl: r.redirect_url || "#", postedAt: r.created || new Date().toISOString(),
        experience: r.title?.toLowerCase().includes("senior") ? "5+ years" : r.title?.toLowerCase().includes("junior") ? "0â€“2 years" : "1â€“3 years",
        requiredSkills: skills.filter(s => `${r.title} ${r.description}`.toLowerCase().includes(s)).slice(0, 6),
      }));
      return { jobs, totalCount: data.count || 0 };
    } catch { return { jobs: [], totalCount: 0 }; }
  }

// === Tamil Nadu real-jobs aggregation ===

const TN_CITY_NAMES = ["chennai", "coimbatore", "madurai", "salem", "trichy", "tiruchirappalli", "vellore", "tirunelveli", "erode", "hosur", "tuticorin", "thoothukudi", "karur", "thanjavur", "kumbakonam", "nagercoil", "pollachi", "tiruppur", "kanyakumari", "dindigul", "ramanathapuram", "villupuram", "cuddalore", "nagapattinam"];

function parseCityFromLocation(location: string): string {
  const parts = location.split(",").map(p => p.trim().toLowerCase());
  const known = TN_CITY_NAMES.find(c => parts.some(p => p === c || p.includes(c)));
  if (known) return known.charAt(0).toUpperCase() + known.slice(1);
  if (parts.some(p => p.includes("remote") || p.includes("work from home"))) return "Remote";
  const first = parts[0] || "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
}

function isTamilNaduLocation(location: string): boolean {
  const l = location.toLowerCase();
  if (l.includes("tamil nadu") || l.includes("tamilnadu")) return true;
  return TN_CITY_NAMES.some(c => l.includes(c));
}

export async function fetchTNJobs(queries: string[], resultsPerPage = 20): Promise<{ jobs: RealJob[]; totalCount: number }> {
  const unique = [...new Set(queries.map(q => q.trim()).filter(q => q.length > 1))].slice(0, 4);
  if (unique.length === 0) return { jobs: [], totalCount: 0 };

  const results = await Promise.all(unique.map(q => fetchRealJobs({ query: q, location: "Tamil Nadu", country: "in", resultsPerPage })));

  const seen = new Set<string>();
  const jobs: RealJob[] = [];
  let totalCount = 0;
  for (const r of results) {
    totalCount += r.totalCount;
    for (const j of r.jobs) {
      if (seen.has(j.id)) continue;
      seen.add(j.id);
      if (!isTamilNaduLocation(j.location)) continue;
      jobs.push(j);
    }
  }
  return { jobs, totalCount };
}

export function rankRealJobs(jobs: RealJob[], userSkills: string[], userInterests: string[], topTitles: string[]): (RealJob & { matchScore: number })[] {
  const us = userSkills.map(normalize).filter(s => s.length >= 3);
  const ui = userInterests.map(normalize);
  const ut = topTitles.map(normalize);

  return jobs.map(job => {
    const text = `${job.title} ${job.description} ${job.requiredSkills.join(" ")} ${job.location}`.toLowerCase();

    let skillHits = 0;
    for (const s of us) if (text.includes(s)) skillHits++;

    let careerHits = 0;
    for (const t of ut) {
      const words = t.split(/\s+/).filter(w => w.length > 3);
      if (words.some(w => job.title.toLowerCase().includes(w))) careerHits++;
    }

    let interestHits = 0;
    for (const i of ui) if (i.length >= 4 && text.includes(i)) interestHits++;

    const skillScore = us.length ? Math.min(1, skillHits / us.length) : 0;
    const careerScore = ut.length ? Math.min(1, careerHits / ut.length) : 0;
    const interestScore = ui.length ? Math.min(1, interestHits / ui.length) : 0;
    const score = skillScore * 0.55 + careerScore * 0.35 + interestScore * 0.10;

    return { ...job, matchScore: Math.round(score * 100) };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

