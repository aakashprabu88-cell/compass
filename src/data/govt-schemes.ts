import { GraduationCap, Award, BookOpen, Wallet, Briefcase, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  category: "scholarship" | "loan" | "skill" | "employment";
  description: string;
  descriptionHi: string;
  eligibility: string;
  eligibilityHi: string;
  deadline: string;
  amount: string;
  url: string;
  icon: LucideIcon;
  color: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "1", name: "PM VidyaLakshmi Scheme", nameHi: "पीएम विद्यालक्ष्मी योजना",
    category: "loan",
    description: "Collateral-free education loans up to ₹10 lakh for pursuing higher education in India or abroad.",
    descriptionHi: "भारत या विदेश में उच्च शिक्षा के लिए बिना गारंटी ₹10 लाख तक शिक्षा ऋण।",
    eligibility: "Indian students admitted to approved institutions. Family income ≤ ₹8 lakh/year.",
    eligibilityHi: "अनुमोदित संस्थानों में प्रवेशित भारतीय छात्र। पारिवारिक आय ≤ ₹8 लाख/वर्ष।",
    deadline: "Rolling", amount: "Up to ₹10,00,000",
    url: "https://www.vidyalakshmi.co.in", icon: Wallet, color: "from-emerald-500 to-teal-500",
  },
  {
    id: "2", name: "Post-Matric SC Scholarship", nameHi: "पोस्ट-मैट्रिक छात्रवृत्ति (SC)",
    category: "scholarship",
    description: "Financial assistance for SC students pursuing post-matriculation education including professional courses.",
    descriptionHi: "पेशेवर पाठ्यक्रमों सहित पोस्ट-मैट्रिक शिक्षा के लिए अनुसूचित जाति के छात्रों को वित्तीय सहायता।",
    eligibility: "SC category students. Family income ≤ ₹2.5 lakh/year. Must be enrolled in recognized institution.",
    eligibilityHi: "अनुसूचित जाति श्रेणी के छात्र। पारिवारिक आय ≤ ₹2.5 लाख/वर्ष। मान्यता प्राप्त संस्थान में नामांकित।",
    deadline: "31 January", amount: "₹1,000 - ₹10,000/year",
    url: "https://scholarships.gov.in", icon: Award, color: "from-indigo-500 to-blue-500",
  },
  {
    id: "3", name: "NSDC Skill India Program", nameHi: "एनएसडीसी स्किल इंडिया प्रोग्राम",
    category: "skill",
    description: "Free skill development training in 40+ sectors. Includes certification and job placement assistance.",
    descriptionHi: "40 से अधिक क्षेत्रों में मुफ्त कौशल विकास प्रशिक्षण। प्रमाणन और नौकरी प्लेसमेंट सहायता शामिल।",
    eligibility: "Age 15-45. Indian citizen. Minimum education: Class 8.",
    eligibilityHi: "आयु 15-45। भारतीय नागरिक। न्यूनतम शिक्षा: कक्षा 8।",
    deadline: "Rolling", amount: "Free training + ₹1,000/day stipend",
    url: "https://www.skillindia.gov.in", icon: BookOpen, color: "from-purple-500 to-pink-500",
  },
  {
    id: "4", name: "PM Rozgar Yojana", nameHi: "पीएम रोजगार योजना",
    category: "employment",
    description: "Employment guarantee scheme providing 100 days of wage employment per year to rural households.",
    descriptionHi: "ग्रामीण परिवारों को प्रति वर्ष 100 दिनों का वेतन रोजगार प्रदान करने वाली योजना।",
    eligibility: "Rural households. Adults (18+) willing to do unskilled manual work.",
    eligibilityHi: "ग्रामीण परिवार। वयस्क (18+) जो अकुशल मैनुअल काम करने को तैयार हों।",
    deadline: "Rolling", amount: "₹220/day + 100 days guaranteed",
    url: "https://nrega.nic.in", icon: Briefcase, color: "from-amber-500 to-orange-500",
  },
  {
    id: "5", name: "AICTE Pragati Scholarship", nameHi: "एआईसीटीई प्रगति छात्रवृत्ति",
    category: "scholarship",
    description: "₹50,000/year for girls pursuing technical education (B.E/B.Tech/B.Arch/Diploma) in AICTE institutions.",
    descriptionHi: "एआईसीटीई संस्थानों में तकनीकी शिक्षा (बीई/बीटेक/बी.आर्च/डिप्लोमा) कर रही छात्राओं के लिए ₹50,000/वर्ष।",
    eligibility: "Female students. Admitted to AICTE-approved institution. Family income ≤ ₹8 lakh/year.",
    eligibilityHi: "छात्राएं। एआईसीटीई-अनुमोदित संस्थान में प्रवेशित। पारिवारिक आय ≤ ₹8 लाख/वर्ष।",
    deadline: "30 November", amount: "₹50,000/year",
    url: "https://www.aicte-india.org/schemes", icon: Award, color: "from-pink-500 to-rose-500",
  },
  {
    id: "6", name: "National Scholarship Portal", nameHi: "राष्ट्रीय छात्रवृत्ति पोर्टल",
    category: "scholarship",
    description: "Central portal for all government scholarships. Pre-matric, post-matric, and merit-based schemes.",
    descriptionHi: "सभी सरकारी छात्रवृत्तियों का केंद्रीय पोर्टल। प्री-मैट्रिक, पोस्ट-मैट्रिक और मेरिट-आधारित योजनाएं।",
    eligibility: "Various schemes for SC/ST/OBC/Minority/General categories. Income-based eligibility.",
    eligibilityHi: "एससी/एसटी/ओबीसी/अल्पसंख्यक/सामान्य श्रेणियों के लिए विभिन्न योजनाएं। आय-आधारित पात्रता।",
    deadline: "31 December", amount: "Varies by scheme",
    url: "https://scholarships.gov.in", icon: GraduationCap, color: "from-cyan-500 to-blue-500",
  },
  {
    id: "7", name: "Skill India Digital Hub", nameHi: "स्किल इंडिया डिजिटल हब",
    category: "skill",
    description: "Online learning platform with 1000+ courses. AI-powered career guidance. Free certifications.",
    descriptionHi: "1000 से अधिक पाठ्यक्रमों के साथ ऑनलाइन लर्निंग प्लेटफॉर्म। AI-संचालित करियर मार्गदर्शन। मुफ्त प्रमाणन।",
    eligibility: "Open to all Indian citizens aged 15+.",
    eligibilityHi: "15+ आयु के सभी भारतीय नागरिकों के लिए खुला।",
    deadline: "Always open", amount: "Free courses + certificates",
    url: "https://www.skillindiadigital.gov.in", icon: BookOpen, color: "from-violet-500 to-purple-500",
  },
  {
    id: "8", name: "Stand-Up India Loan", nameHi: "स्टैंड-अप इंडिया लोन",
    category: "loan",
    description: "Loans from ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs to start new businesses.",
    descriptionHi: "एससी/एसटी और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक के ऋण।",
    eligibility: "SC/ST/Women applicants aged 18+. New enterprise in manufacturing, services, or trading.",
    eligibilityHi: "18+ आयु के एससी/एसटी/महिला आवेदक। विनिर्माण, सेवाओं या व्यापार में नया उद्यम।",
    deadline: "Rolling", amount: "₹10,00,000 - ₹1,00,00,000",
    url: "https://www.standupmitra.in", icon: Wallet, color: "from-green-500 to-emerald-500",
  },
  {
    id: "9", name: "PM Mudra Yojana", nameHi: "पीएम मुद्रा योजना",
    category: "loan",
    description: "Loans up to ₹10 lakh for non-farm small/micro enterprises. No collateral required.",
    descriptionHi: "गैर-कृषि छोटे/सूक्ष्म उद्यमों के लिए ₹10 लाख तक ऋण। बिना गारंटी।",
    eligibility: "Indian citizens with a business plan in non-farm sector. Age 18+.",
    eligibilityHi: "गैर-कृषि क्षेत्र में व्यापार योजना वाले भारतीय नागरिक। आयु 18+।",
    deadline: "Rolling", amount: "Up to ₹10,00,000",
    url: "https://www.mudra.org.in", icon: Wallet, color: "from-blue-500 to-indigo-500",
  },
  {
    id: "10", name: "Apprenticeship Training (NAPS)", nameHi: "शिक्षुता प्रशिक्षण (NAPS)",
    category: "skill",
    description: "Learn while earning. Government-subsidized apprenticeship in 30+ sectors with guaranteed stipend.",
    descriptionHi: "कमाते हुए सीखें। 30 से अधिक क्षेत्रों में सरकारी सब्सिडी वाली शिक्षुता।",
    eligibility: "Age 14-21. Class 5 pass minimum. Enrolled in recognized ITI or school.",
    eligibilityHi: "आयु 14-21। कक्षा 5 पास न्यूनतम। मान्यता प्राप्त आईटीआई या स्कूल में नामांकित।",
    deadline: "Rolling", amount: "₹5,000 - ₹9,000/month stipend",
    url: "https://apprenticeshipindia.gov.in", icon: Briefcase, color: "from-yellow-500 to-amber-500",
  },
];

export const GOVT_CATEGORIES = [
  { key: "all", labelKey: "govt.all", icon: Search },
  { key: "scholarship", labelKey: "govt.scholarship", icon: Award },
  { key: "loan", labelKey: "govt.loan", icon: Wallet },
  { key: "skill", labelKey: "govt.skill", icon: BookOpen },
  { key: "employment", labelKey: "govt.employment", icon: Briefcase },
] as const;
