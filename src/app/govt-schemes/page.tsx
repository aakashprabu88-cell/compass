"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Wallet, Briefcase, Award, Search, ChevronRight, GraduationCap, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Scheme {
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
  icon: any;
  color: string;
}

const SCHEMES: Scheme[] = [
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

export default function GovtSchemesPage() {
  const { t, locale } = useLanguage();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok || !res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) { setUser(data); setLoading(false); }
      } catch { if (!cancelled) router.push("/"); }
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const isHi = locale === "hi";

  const filtered = SCHEMES.filter(s => {
    const matchesFilter = filter === "all" || s.category === filter;
    const matchesSearch = search === "" ||
      (isHi ? s.nameHi : s.name).toLowerCase().includes(search.toLowerCase()) ||
      (isHi ? s.descriptionHi : s.description).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { key: "all", label: t.govt.all, icon: Search },
    { key: "scholarship", label: t.govt.scholarship, icon: Award },
    { key: "loan", label: t.govt.loan, icon: Wallet },
    { key: "skill", label: t.govt.skill, icon: BookOpen },
    { key: "employment", label: t.govt.employment, icon: Briefcase },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">{t.govt.title}</h1>
            <p className="text-slate-400 text-sm mb-6">{t.govt.subtitle}</p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.govt.searchPlaceholder}
              className="pl-10" style={{ maxWidth: "100%" }} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setFilter(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  filter === cat.key ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.05]"
                }`}>
                <cat.icon className="w-3.5 h-3.5" /> {cat.label}
              </button>
            ))}
          </div>

          {/* Schemes Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((scheme, i) => (
              <motion.div key={scheme.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center shrink-0`}>
                    <scheme.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{isHi ? scheme.nameHi : scheme.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 uppercase">{scheme.category}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3">{isHi ? scheme.descriptionHi : scheme.description}</p>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{t.govt.eligibility}:</span>
                    <span className="text-slate-400">{isHi ? scheme.eligibilityHi : scheme.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{t.govt.deadline}:</span>
                    <span className="text-amber-400 font-medium">{scheme.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{t.govt.amount}:</span>
                    <span className="text-green-400 font-medium">{scheme.amount}</span>
                  </div>
                </div>
                <a href={scheme.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 text-sm transition-all w-full justify-center">
                  {t.govt.applyNow} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t.govt.noResults}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
