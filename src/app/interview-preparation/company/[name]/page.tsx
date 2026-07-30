"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Briefcase, Star, TrendingUp, Users, ChevronRight, BookOpen, Award, Clock, Globe, Mail, MapPin, Loader2, ExternalLink, Lightbulb, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const COMPANY_INFO: Record<string, { fullName: string; tier: string; hiringProcess: string[]; culture: string; tips: string[] }> = {
  google: {
    fullName: "Google", tier: "FAANG",
    hiringProcess: ["Resume Screen → Phone Interview → On-site (4-5 rounds) → HC → Offer"],
    culture: "Innovation-first, data-driven, collaborative. Known for tough algorithmic interviews.",
    tips: ["Master DSA — Google focuses heavily on algorithms and data structures", "Practice system design for L5+ roles", "Prepare for behavioral questions using Google's 'Googleyness' framework", "Know Google's products and history", "Practice on LeetCode — Google-tagged questions are a goldmine"],
  },
  microsoft: {
    fullName: "Microsoft", tier: "FAANG",
    hiringProcess: ["Phone Screen → Technical Phone → On-site (4 rounds) → AS Review → Offer"],
    culture: "Growth mindset, 'learn-it-all' culture. More emphasis on problem-solving approach than speed.",
    tips: ["Expect more design questions than Google", "Be ready to discuss past projects in-depth", "Microsoft values collaboration — show how you work in teams", "Prepare for 'why Microsoft' — know their products and mission", "Practice explaining your thought process clearly"],
  },
  amazon: {
    fullName: "Amazon", tier: "FAANG",
    hiringProcess: ["Online Assessment → Phone Screen → On-site (4-5 rounds) → Bar Raiser → Offer"],
    culture: "Customer-obsessed, ownership-driven. Leadership Principles are central to every interview.",
    tips: ["Prepare 2-3 STAR stories for each Leadership Principle", "Amazon's Bar Raiser has veto power — prepare well", "Expect LP-focused behavioral questions in EVERY round", "System design interviews focus on scalability", "Practice the 'working backwards' approach"],
  },
  meta: {
    fullName: "Meta", tier: "FAANG",
    hiringProcess: ["Phone Screen → Tech Screen → On-site (4 rounds) → Offer"],
    culture: "Move fast, ship-oriented. Strong engineering culture with focus on product impact.",
    tips: ["Expect at least one coding round in your language of choice", "System design is product-focused (design Instagram, WhatsApp etc.)", "Behavioral questions focus on 'Meta values'", "Prepare for SQL/data engineering questions if applying for relevant roles", "Know Meta's monetization model and products"],
  },
  infosys: {
    fullName: "Infosys", tier: "Service",
    hiringProcess: ["Online Test → Technical Interview → HR Interview → Offer"],
    culture: "Process-driven, learning-oriented. One of India's largest IT services companies.",
    tips: ["Focus on basics: DSA, DBMS, OOP, OS fundamentals", "Prepare for aptitude and logical reasoning tests", "Communication skills matter — practice in English", "Know about recent Infosys projects and acquisitions", "Be ready to explain your academic projects"],
  },
  tcs: {
    fullName: "TCS", tier: "Service",
    hiringProcess: ["TCS NQT → Technical Interview → Managerial → HR → Offer"],
    culture: "Structured, process-heavy. Massive training infrastructure for freshers.",
    tips: ["TCS NQT has aptitude, logical, and verbal sections — practice all three", "Technical interview covers basics of CS fundamentals", "Prepare for 'why TCS' and long-term career questions", "Be honest about your skills — TCS values integrity", "Communication and attitude matter a lot"],
  },
  wipro: {
    fullName: "Wipro", tier: "Service",
    hiringProcess: ["Online Test → Technical Interview → HR → Offer"],
    culture: "Diverse, innovation-focused. Strong in digital transformation and consulting.",
    tips: ["Prepare for their online assessment — aptitude + coding", "Technical interview covers projects and fundamentals", "Wipro values adaptability and willingness to learn", "Be ready to relocate — Wipro has global projects", "Show passion for technology and problem-solving"],
  },
  accenture: {
    fullName: "Accenture", tier: "Service",
    hiringProcess: ["Cognitive Assessment → Technical → HR → Offer"],
    culture: "Consulting-driven, diverse. Strong focus on continuous learning and innovation.",
    tips: ["Accenture's cognitive assessment tests English, reasoning, and math", "Technical questions are moderate difficulty", "Consulting mindset — show problem-solving and client-first attitude", "Prepare for 'tell me about yourself' and situational questions", "Accenture values diversity and inclusion — demonstrate awareness"],
  },
  zoho: {
    fullName: "Zoho", tier: "Product",
    hiringProcess: ["Online Test → Coding Round → Technical Interview → HR → Offer"],
    culture: "Product-first, R&D focused. Known for treating employees well and innovative products.",
    tips: ["Zoho's test is rigorous — covers aptitude, coding, and problem-solving", "They value clean code and algorithmic thinking", "Zoho is known for its unique work culture — research it well", "Expect questions on DBMS and web technologies", "Show genuine interest in Zoho's product ecosystem"],
  },
  freshworks: {
    fullName: "Freshworks", tier: "Product",
    hiringProcess: ["Phone Screen → Coding Test → Technical Rounds → HR → Offer"],
    culture: "Fast-paced, SaaS-focused startup culture. Chennai-based global product company.",
    tips: ["Expect SaaS and product-focused design questions", "Coding rounds focus on full-stack skills", "Freshworks values product sense and user empathy", "Learn about Freshworks' products — Freshdesk, Freshsales, etc.", "Show that you can work in a fast-paced environment"],
  },
};

const COMMON_QUESTIONS: Record<string, { question: string; answer: string }[]> = {
  google: [
    { question: "Why do you want to work at Google?", answer: "Google's mission to organize the world's information resonates with me. I admire the engineering culture, innovation, and scale of impact. I want to work on problems that affect billions of users." },
    { question: "Tell me about a time you had a conflict with a teammate.", answer: "Use the STAR method — describe a specific situation, task, action, and result. Focus on how you resolved the conflict constructively." },
  ],
  amazon: [
    { question: "Tell me about a time you went above and beyond.", answer: "Use STAR format — focus on a specific example where you took ownership and delivered beyond expectations. Tie it to an Amazon Leadership Principle." },
    { question: "How would you design X (e.g., Amazon's recommendation system)?", answer: "Start with requirements, then high-level architecture, dive deep into components, mention trade-offs, and discuss scale." },
  ],
};

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const nameSlug = (params.name as string).toLowerCase();
  const info = COMPANY_INFO[nameSlug];
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("company detail load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  const displayName = info?.fullName || nameSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const questions = COMMON_QUESTIONS[nameSlug] || [];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Link href="/interview-preparation/company" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                {displayName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{info?.tier || "Company"}</span>
              </div>
            </div>
          </motion.div>

          {info ? (
            <>
              {/* Culture */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Culture</h2>
                </div>
                <p className="text-sm text-slate-300">{info.culture}</p>
              </motion.div>

              {/* Hiring Process */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Hiring Process</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {info.hiringProcess.map((step, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">{step}</span>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">Preparation Tips</h2>
                </div>
                <ul className="space-y-2">
                  {info.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">General Preparation</h2>
                </div>
                <p className="text-sm text-slate-300">Research {displayName}'s products, culture, and recent news. Practice coding on LeetCode and prepare behavioral stories using the STAR method.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">Universal Tips</h2>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Master DSA fundamentals — arrays, strings, trees, graphs, DP</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Prepare 3-4 STAR stories for behavioral questions</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Review core CS: OS, DBMS, Networks, OOP, System Design</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Practice company-specific questions on LeetCode with topic tags</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Prepare thoughtful questions to ask the interviewer</li>
                </ul>
              </motion.div>
            </>
          )}

          {/* Common Questions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="p-5 rounded-2xl border border-white/5 mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <h2 className="font-semibold text-sm">Common Interview Questions</h2>
            </div>
            {questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-sm font-medium mb-2">Q: {q.question}</p>
                    <p className="text-xs text-slate-400">{q.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">AI-powered company-specific questions coming soon. Use the <Link href="/interview-preparation/aptitude" className="text-indigo-400 hover:underline">Aptitude</Link> and <Link href="/interview-preparation/technical" className="text-indigo-400 hover:underline">Technical</Link> sections to prepare in the meantime.</p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
