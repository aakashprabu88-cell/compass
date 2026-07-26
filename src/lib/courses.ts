export interface FreeCourse {
  id: string;
  title: string;
  provider: string;
  url: string;
  category: string;
  skills: string[];
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  enrolled: string;
  description: string;
  certificate: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "remote";
  salary: string;
  requiredSkills: string[];
  industries: string[];
  description: string;
  url: string;
  postedDaysAgo: number;
  matchScore: number;
}

export const FREE_COURSES: FreeCourse[] = [
  {
    id: "cs50",
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard (edX)",
    url: "https://cs50.harvard.edu",
    category: "Computer Science",
    skills: ["Programming", "Problem Solving", "System Design", "C", "Python", "SQL", "Web Development"],
    duration: "12 weeks",
    level: "beginner",
    rating: 4.9,
    enrolled: "4M+",
    description: "Harvard's legendary intro CS course. Covers algorithms, data structures, and web development.",
    certificate: true,
  },
  {
    id: "ml-coursera",
    title: "Machine Learning",
    provider: "Stanford (Coursera)",
    url: "https://coursera.org/learn/machine-learning",
    category: "AI & ML",
    skills: ["Machine Learning", "Python", "Mathematics", "Statistics", "Deep Learning"],
    duration: "11 weeks",
    level: "intermediate",
    rating: 4.9,
    enrolled: "4.8M+",
    description: "Andrew Ng's iconic ML course. Neural networks, linear regression, and practical ML.",
    certificate: true,
  },
  {
    id: "google-data",
    title: "Google Data Analytics Certificate",
    provider: "Google (Coursera)",
    url: "https://coursera.org/professional-certificates/google-data-analytics",
    category: "Data Science",
    skills: ["Data Analysis", "SQL", "R", "Data Visualization", "Statistics", "Excel"],
    duration: "6 months",
    level: "beginner",
    rating: 4.8,
    enrolled: "2M+",
    description: "Google's official data analytics certificate. Hands-on projects with real datasets.",
    certificate: true,
  },
  {
    id: "freecodecamp",
    title: "freeCodeCamp Full Stack Curriculum",
    provider: "freeCodeCamp",
    url: "https://freecodecamp.org",
    category: "Web Development",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
    duration: "Self-paced",
    level: "beginner",
    rating: 4.8,
    enrolled: "10M+",
    description: "Completely free full-stack development curriculum with certification projects.",
    certificate: true,
  },
  {
    id: "google-ux",
    title: "Google UX Design Certificate",
    provider: "Google (Coursera)",
    url: "https://coursera.org/professional-certificates/google-ux-design",
    category: "Design",
    skills: ["Design Thinking", "Figma", "User Research", "Prototyping", "Visual Design", "Wireframing"],
    duration: "6 months",
    level: "beginner",
    rating: 4.8,
    enrolled: "1.5M+",
    description: "Google's UX design certificate. Learn user research, Figma, and prototyping.",
    certificate: true,
  },
  {
    id: "ibm-data-science",
    title: "IBM Data Science Professional Certificate",
    provider: "IBM (Coursera)",
    url: "https://coursera.org/professional-certificates/ibm-data-science",
    category: "Data Science",
    skills: ["Python", "SQL", "Data Analysis", "Machine Learning", "Data Visualization"],
    duration: "4 months",
    level: "beginner",
    rating: 4.6,
    enrolled: "900K+",
    description: "IBM's data science path covering Python, SQL, and machine learning basics.",
    certificate: true,
  },
  {
    id: "khan-algo",
    title: "Algorithms & Data Structures",
    provider: "Khan Academy",
    url: "https://khanacademy.org/computing/computer-science/algorithms",
    category: "Computer Science",
    skills: ["Algorithms", "Problem Solving", "Data Structures", "Mathematics"],
    duration: "Self-paced",
    level: "intermediate",
    rating: 4.7,
    enrolled: "500K+",
    description: "Free algorithms and data structures course with interactive exercises.",
    certificate: false,
  },
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer Certificate",
    provider: "Meta (Coursera)",
    url: "https://coursera.org/professional-certificates/meta-frontend-developer",
    category: "Web Development",
    skills: ["React", "JavaScript", "HTML", "CSS", "Version Control", "Testing"],
    duration: "7 months",
    level: "beginner",
    rating: 4.7,
    enrolled: "700K+",
    description: "Meta's official front-end developer certificate. React, testing, and UI best practices.",
    certificate: true,
  },
  {
    id: "aws-cloud",
    title: "AWS Cloud Practitioner Essentials",
    provider: "Amazon (edX)",
    url: "https://aws.amazon.com/training/digital-training",
    category: "Cloud",
    skills: ["Cloud Computing", "AWS", "Networking", "Security", "System Design"],
    duration: "6 hours",
    level: "beginner",
    rating: 4.7,
    enrolled: "3M+",
    description: "AWS fundamentals. Understand cloud architecture, security, and pricing.",
    certificate: true,
  },
  {
    id: "google-pm",
    title: "Google Project Management Certificate",
    provider: "Google (Coursera)",
    url: "https://coursera.org/professional-certificates/google-project-management",
    category: "Management",
    skills: ["Project Management", "Agile", "Leadership", "Communication", "Risk Management"],
    duration: "6 months",
    level: "beginner",
    rating: 4.8,
    enrolled: "1.2M+",
    description: "Google's project management certificate. Agile, Scrum, and leadership skills.",
    certificate: true,
  },
  {
    id: "cybrary-cyber",
    title: "Cybersecurity Career Path",
    provider: "Cybrary",
    url: "https://cybrary.it",
    category: "Cybersecurity",
    skills: ["Network Security", "Incident Response", "Risk Assessment", "Forensics", "Ethical Hacking"],
    duration: "Self-paced",
    level: "beginner",
    rating: 4.5,
    enrolled: "1M+",
    description: "Free cybersecurity learning path. Network security, incident response, and forensics.",
    certificate: false,
  },
  {
    id: "deeplearning-ai",
    title: "Deep Learning Specialization",
    provider: "deeplearning.ai (Coursera)",
    url: "https://coursera.org/specializations/deep-learning",
    category: "AI & ML",
    skills: ["Deep Learning", "Neural Networks", "Python", "TensorFlow", "Machine Learning"],
    duration: "5 months",
    level: "intermediate",
    rating: 4.9,
    enrolled: "1M+",
    description: "Andrew Ng's deep learning specialization. CNNs, RNNs, and sequence models.",
    certificate: true,
  },
  {
    id: "figma-academy",
    title: "Figma Academy",
    provider: "Figma",
    url: "https://figma.com/resources/learn-design",
    category: "Design",
    skills: ["Figma", "Design Thinking", "Prototyping", "Visual Design", "Layout Design"],
    duration: "Self-paced",
    level: "beginner",
    rating: 4.7,
    enrolled: "2M+",
    description: "Official Figma learning resources. Design systems, components, and collaboration.",
    certificate: false,
  },
  {
    id: "microsoft-excel",
    title: "Excel Skills for Business",
    provider: "Macquarie University (Coursera)",
    url: "https://coursera.org/learn/excel",
    category: "Business",
    skills: ["Excel", "Data Analysis", "Financial Modeling", "Data Visualization"],
    duration: "4 weeks",
    level: "beginner",
    rating: 4.9,
    enrolled: "2M+",
    description: "Master Excel for business. Formulas, pivot tables, and data visualization.",
    certificate: true,
  },
  {
    id: "introtodeeplearning",
    title: "Introduction to Deep Learning",
    provider: "MIT (OpenCourseWare)",
    url: "https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2020",
    category: "AI & ML",
    skills: ["Deep Learning", "Neural Networks", "Python", "PyTorch", "Computer Vision"],
    duration: "Self-paced",
    level: "intermediate",
    rating: 4.8,
    enrolled: "500K+",
    description: "MIT's intro to deep learning. Neural networks, CNNs, and reinforcement learning.",
    certificate: false,
  },
];

export function matchCourses(
  userSkills: string[],
  userInterests: string[],
  gaps: Array<{ skillName: string; priority: string }>
): FreeCourse[] {
  const highPrioritySkills = gaps
    .filter(g => g.priority === "high")
    .map(g => g.skillName.toLowerCase());

  const medPrioritySkills = gaps
    .filter(g => g.priority === "medium")
    .map(g => g.skillName.toLowerCase());

  const allUserKeywords = [
    ...userSkills.map(s => s.toLowerCase()),
    ...userInterests.map(i => i.toLowerCase()),
  ];

  return FREE_COURSES
    .map(course => {
      let score = 0;
      const courseSkillsLower = course.skills.map(s => s.toLowerCase());

      // Boost: course covers a high-priority skill gap
      highPrioritySkills.forEach(skill => {
        if (courseSkillsLower.some(cs => cs.includes(skill) || skill.includes(cs))) score += 3;
      });

      // Boost: course covers a medium-priority skill gap
      medPrioritySkills.forEach(skill => {
        if (courseSkillsLower.some(cs => cs.includes(skill) || skill.includes(cs))) score += 1.5;
      });

      // Boost: course skills match user's interests
      allUserKeywords.forEach(kw => {
        if (courseSkillsLower.some(cs => cs.includes(kw) || kw.includes(cs))) score += 0.5;
        if (course.category.toLowerCase().includes(kw)) score += 0.5;
      });

      // Rating bonus
      score += course.rating * 0.2;

      // Free certificate bonus
      if (course.certificate) score += 0.5;

      return { ...course, matchScore: score };
    })
    .filter(c => c.matchScore > 1)
    .sort((a, b) => b.matchScore - a.matchScore);
}
