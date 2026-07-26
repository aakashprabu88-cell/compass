export interface MentorData {
  id: string;
  name: string;
  title: string;
  company: string;
  companyId: string;
  experience: number;
  skills: string[];
  bio: string;
  linkedin: string;
  available: boolean;
  rating: number;
  mentees: number;
}

export const MENTOR_DATABASE: MentorData[] = [
  {
    id: "m1", name: "Priya Sharma", title: "Senior Software Engineer", company: "Zoho",
    companyId: "c3", experience: 8, skills: ["JavaScript", "React", "Node.js", "System Design", "Mentoring"],
    bio: "Full-stack engineer with 8 years of experience building SaaS products. Passionate about helping fresh graduates navigate their first tech job.",
    linkedin: "#", available: true, rating: 4.8, mentees: 12,
  },
  {
    id: "m2", name: "Arjun Reddy", title: "AI/ML Lead", company: "Freshworks",
    companyId: "c4", experience: 6, skills: ["Python", "Machine Learning", "TensorFlow", "Data Engineering", "Leadership"],
    bio: "Leading AI initiatives at Freshworks. Previously at Amazon. Love mentoring aspiring AI engineers.",
    linkedin: "#", available: true, rating: 4.7, mentees: 8,
  },
  {
    id: "m3", name: "Kavitha Menon", title: "UX Design Manager", company: "Amazon AWS",
    companyId: "c5", experience: 10, skills: ["Figma", "Design Thinking", "User Research", "Prototyping", "Team Leadership"],
    bio: "Design leader with a decade of experience. Passionate about inclusive design and mentoring women in tech.",
    linkedin: "#", available: true, rating: 4.9, mentees: 15,
  },
  {
    id: "m4", name: "Vikram Patel", title: "Cybersecurity Architect", company: "HCLTech",
    companyId: "c6", experience: 12, skills: ["Network Security", "Penetration Testing", "Cloud Security", "Cryptography", "Risk Assessment"],
    bio: "Cybersecurity veteran with 12 years protecting enterprise infrastructure. CEH and CISSP certified.",
    linkedin: "#", available: true, rating: 4.6, mentees: 6,
  },
  {
    id: "m5", name: "Meena Krishnan", title: "Product Manager", company: "Zoho",
    companyId: "c3", experience: 7, skills: ["Product Strategy", "Agile", "Data Analysis", "User Empathy", "Roadmapping"],
    bio: "Product manager who's shipped 5+ products from 0 to 1. Love helping aspiring PMs understand the role.",
    linkedin: "#", available: true, rating: 4.8, mentees: 10,
  },
  {
    id: "m6", name: "Rahul Verma", title: "Data Science Manager", company: "Cognizant",
    companyId: "c7", experience: 9, skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Leadership"],
    bio: "Leading data science teams for Fortune 500 clients. PhD in Statistics from IIT Madras.",
    linkedin: "#", available: true, rating: 4.7, mentees: 9,
  },
  {
    id: "m7", name: "Anitha Raj", title: "Cloud Infrastructure Lead", company: "Amazon AWS",
    companyId: "c5", experience: 8, skills: ["AWS", "Terraform", "Kubernetes", "Docker", "CI/CD", "Python"],
    bio: "AWS Solutions Architect Pro certified. Built and managed infrastructure serving millions of users.",
    linkedin: "#", available: true, rating: 4.5, mentees: 7,
  },
  {
    id: "m8", name: "Suresh Babu", title: "HR Director", company: "TCS",
    companyId: "c1", experience: 15, skills: ["Talent Acquisition", "Employee Relations", "Leadership Development", "Diversity & Inclusion"],
    bio: "15 years in HR leadership. Expert in campus hiring and fresh graduate onboarding. Available for career guidance.",
    linkedin: "#", available: true, rating: 4.4, mentees: 20,
  },
  {
    id: "m9", name: "Deepa Nair", title: "Frontend Architect", company: "Infosys",
    companyId: "c2", experience: 10, skills: ["React", "TypeScript", "Next.js", "Performance Optimization", "Design Systems"],
    bio: "Frontend architect specializing in high-performance web applications. Open source contributor.",
    linkedin: "#", available: true, rating: 4.6, mentees: 11,
  },
  {
    id: "m10", name: "Karthik Iyer", title: "DevOps Manager", company: "Freshworks",
    companyId: "c4", experience: 7, skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Monitoring", "Automation"],
    bio: "DevOps practitioner focused on reliability and developer experience. SRE certified.",
    linkedin: "#", available: true, rating: 4.5, mentees: 5,
  },
];

export function matchMentors(
  userSkills: string[],
  userInterests: string[],
  careerTitles: string[]
): (MentorData & { matchScore: number })[] {
  const allKeywords = [
    ...userSkills.map(s => s.toLowerCase()),
    ...userInterests.map(i => i.toLowerCase()),
    ...careerTitles.map(t => t.toLowerCase()),
  ];

  return MENTOR_DATABASE
    .map(mentor => {
      let score = 0;
      const mentorSkillsLower = mentor.skills.map(s => s.toLowerCase());

      mentorSkillsLower.forEach(ms => {
        if (allKeywords.some(kw => kw.includes(ms) || ms.includes(kw))) score += 2;
      });

      allKeywords.forEach(kw => {
        const mentorText = `${mentor.title} ${mentor.bio} ${mentor.company}`.toLowerCase();
        if (mentorText.includes(kw)) score += 0.5;
      });

      score += mentor.rating * 0.3;
      score += Math.min(mentor.mentees * 0.1, 1);

      return { ...mentor, matchScore: Math.max(0, Math.round(score * 10) / 10) };
    })
    .filter(m => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
