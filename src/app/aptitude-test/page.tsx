"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, ArrowRight, Brain, Target, Lightbulb, AlertTriangle, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface Question {
  id: number;
  category: "riasec" | "big5" | "values" | "workStyle" | "strengths";
  question: string;
  questionHi: string;
  options: { value: string; label: string; labelHi: string }[];
}

const QUESTIONS: Question[] = [
  // RIASEC - Realistic
  { id: 1, category: "riasec", question: "I enjoy working with my hands, building or fixing things.", questionHi: "मुझे अपने हाथों से कुछ बनाना या ठीक करना अच्छा लगता है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // RIASEC - Investigative
  { id: 2, category: "riasec", question: "I love solving complex problems and understanding how things work.", questionHi: "मुझे जटिल समस्याओं को सुलझाना और समझना अच्छा लगता है कि चीजें कैसे काम करती हैं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // RIASEC - Artistic
  { id: 3, category: "riasec", question: "I express myself through art, writing, music, or design.", questionHi: "मैं कला, लेखन, संगीत या डिजाइन के माध्यम से खुद को व्यक्त करता हूं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // RIASEC - Social
  { id: 4, category: "riasec", question: "I enjoy helping people and making a difference in their lives.", questionHi: "मुझे लोगों की मदद करना और उनके जीवन में बदलाव लाना अच्छा लगता है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // RIASEC - Enterprising
  { id: 5, category: "riasec", question: "I like leading teams, making decisions, and taking charge.", questionHi: "मुझे टीम का नेतृत्व करना, निर्णय लेना और कमान संभालना अच्छा लगता है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // RIASEC - Conventional
  { id: 6, category: "riasec", question: "I prefer structured tasks, clear rules, and organized workflows.", questionHi: "मुझे संरचित कार्य, स्पष्ट नियम और व्यवस्थित कार्यप्रवाह पसंद हैं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Big Five - Openness
  { id: 7, category: "big5", question: "I enjoy trying new experiences and exploring unfamiliar ideas.", questionHi: "मुझे नए अनुभव आजमाना और अपरिचित विचारों का पता लगाना अच्छा लगता है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Big Five - Conscientiousness
  { id: 8, category: "big5", question: "I am organized, detail-oriented, and always meet deadlines.", questionHi: "मैं व्यवस्थित हूं, विवरणों पर ध्यान देता हूं, और हमेशा समय पर काम पूरा करता हूं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Big Five - Extraversion
  { id: 9, category: "big5", question: "I feel energized when working with groups and meeting new people.", questionHi: "समूह में काम करना और नए लोगों से मिलना मुझे ऊर्जा देता है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Values
  { id: 10, category: "values", question: "Financial security is more important than doing work I love.", questionHi: "वित्तीय सुरक्षा उस काम से ज्यादा महत्वपूर्ण है जो मुझे पसंद है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Values
  { id: 11, category: "values", question: "I want my work to directly help society, even if it pays less.", questionHi: "मैं चाहता हूं कि मेरा काम सीधे समाज की मदद करे, भले ही कम भुगतान मिले।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Work Style
  { id: 12, category: "workStyle", question: "I prefer working independently without much supervision.", questionHi: "मुझे बिना ज्यादा निरीक्षण के स्वतंत्र रूप से काम करना पसंद है।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Strengths
  { id: 13, category: "strengths", question: "I am good at explaining complex ideas in simple terms.", questionHi: "मैं जटिल विचारों को सरल शब्दों में समझाने में अच्छा हूं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Strengths
  { id: 14, category: "strengths", question: "I can stay calm and make good decisions under pressure.", questionHi: "दबाव में शांत रहकर अच्छे निर्णय ले सकता हूं।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
  // Final
  { id: 15, category: "values", question: "I would rather start my own business than work for someone else.", questionHi: "मैं किसी और के लिए काम करने के बजाय अपना खुद का व्यवसाय शुरू करना पसंद करूंगा।", options: [
    { value: "strongly_disagree", label: "Strongly Disagree", labelHi: "बिल्कुल असहमत" },
    { value: "disagree", label: "Disagree", labelHi: "असहमत" },
    { value: "neutral", label: "Neutral", labelHi: "तटस्थ" },
    { value: "agree", label: "Agree", labelHi: "सहमत" },
    { value: "strongly_agree", label: "Strongly Agree", labelHi: "बिल्कुल सहमत" },
  ]},
];

function scoreToNumber(value: string): number {
  const map: Record<string, number> = {
    strongly_disagree: 1,
    disagree: 2,
    neutral: 3,
    agree: 4,
    strongly_agree: 5,
  };
  return map[value] || 3;
}

function computeProfile(answers: Record<number, string>) {
  const riasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const riasecCount = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  QUESTIONS.forEach(q => {
    const val = scoreToNumber(answers[q.id] || "neutral");
    if (q.category === "riasec") {
      const key = q.id <= 6 ? ["R", "I", "A", "S", "E", "C"][q.id - 1] : "R";
      riasec[key as keyof typeof riasec] += val;
      riasecCount[key as keyof typeof riasecCount] += 1;
    }
  });

  const riasecAvg: Record<string, number> = {};
  for (const key of Object.keys(riasec)) {
    riasecAvg[key] = riasecCount[key as keyof typeof riasecCount] > 0
      ? riasec[key as keyof typeof riasec] / riasecCount[key as keyof typeof riasecCount]
      : 3;
  }

  const sorted = Object.entries(riasecAvg).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  const typeMap: Record<string, string> = {
    R: "Realistic (Doer)",
    I: "Investigative (Thinker)",
    A: "Artistic (Creator)",
    S: "Social (Helper)",
    E: "Enterprising (Persuader)",
    C: "Conventional (Organizer)",
  };

  const hiTypeMap: Record<string, string> = {
    R: "वास्तविक (कर्ता)",
    I: "अन्वेषक (विचारक)",
    A: "कलात्मक (रचनाकार)",
    S: "सामाजिक (सहायक)",
    E: "उद्यमी (प्रभावक)",
    C: "पारंपरिक (व्यवस्थापक)",
  };

  const careerMatches: Record<string, string[]> = {
    R: ["Software Engineer", "Civil Engineer", "Mechanical Engineer", "Electrician", "Robotics Engineer"],
    I: ["Data Scientist", "Research Scientist", "AI/ML Engineer", "Doctor", "Cybersecurity Analyst"],
    A: ["UX/UI Designer", "Graphic Designer", "Content Creator", "Journalist", "Architect"],
    S: ["Teacher", "Social Worker", "Nurse", "Counselor", "HR Manager"],
    E: ["Product Manager", "Marketing Manager", "Entrepreneur", "Lawyer", "Sales Director"],
    C: ["Accountant", "Financial Analyst", "Project Manager", "Supply Chain Manager", "Paralegal"],
  };

  const strengths: string[] = [];
  const avoid: string[] = [];

  if (riasecAvg.R >= 3.5) strengths.push("Hands-on problem solving", "Technical aptitude", "Building physical systems");
  if (riasecAvg.I >= 3.5) strengths.push("Analytical thinking", "Research ability", "Complex problem solving");
  if (riasecAvg.A >= 3.5) strengths.push("Creative expression", "Innovative thinking", "Visual communication");
  if (riasecAvg.S >= 3.5) strengths.push("Interpersonal skills", "Teaching ability", "Empathy");
  if (riasecAvg.E >= 3.5) strengths.push("Leadership", "Decision making", "Persuasion");
  if (riasecAvg.C >= 3.5) strengths.push("Organization", "Attention to detail", "Process management");

  if (riasecAvg.R < 2.5) avoid.push("Manual trades", "Physical engineering roles");
  if (riasecAvg.I < 2.5) avoid.push("Research-heavy roles", "Data analysis positions");
  if (riasecAvg.A < 2.5) avoid.push("Pure creative roles", "Design-heavy positions");
  if (riasecAvg.S < 2.5) avoid.push("Teaching", "Healthcare", "Social work");
  if (riasecAvg.E < 2.5) avoid.push("Sales leadership", "Executive management");
  if (riasecAvg.C < 2.5) avoid.push("Accounting", "Compliance roles", "Data entry");

  if (strengths.length === 0) strengths.push("Adaptability", "Quick learning", "Versatility");
  if (avoid.length === 0) avoid.push("Highly repetitive tasks", "Isolated work with no collaboration");

  return {
    type: `${typeMap[primary]} / ${typeMap[secondary]}`,
    typeHi: `${hiTypeMap[primary]} / ${hiTypeMap[secondary]}`,
    primary,
    secondary,
    topCareers: [...(careerMatches[primary] || []), ...(careerMatches[secondary] || [])].slice(0, 6),
    strengths,
    avoid,
    scores: riasecAvg,
  };
}

export default function AptitudeTestPage() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState<"intro" | "test" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [profile, setProfile] = useState<ReturnType<typeof computeProfile> | null>(null);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const p = computeProfile(answers);
    setProfile(p);
    setStep("results");
  };

  const isHi = locale === "hi";
  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  if (step === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">{t.aptitude.title}</h1>
          <p className="text-slate-400 mb-8">{t.aptitude.subtitle}</p>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-2xl font-bold text-indigo-400">15</div>
              <div className="text-xs text-slate-500">{isHi ? "प्रश्न" : "Questions"}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-xs text-slate-500">{isHi ? "करियर टाइप" : "Career Types"}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-2xl font-bold text-emerald-400">RIASEC</div>
              <div className="text-xs text-slate-500">{isHi ? "मनोवैज्ञानिक मॉडल" : "Psychometric Model"}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-2xl font-bold text-amber-400">Big 5</div>
              <div className="text-xs text-slate-500">{isHi ? "व्यक्तित्व मॉडल" : "Personality Model"}</div>
            </div>
          </div>
          <button onClick={() => setStep("test")} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all glow-sm">
            {t.aptitude.startBtn}
          </button>
          <div className="mt-4">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-400">{t.common.back}</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === "results" && profile) {
    const riasecLabels: Record<string, { en: string; hi: string }> = {
      R: { en: "Realistic (Doer)", hi: "वास्तविक (कर्ता)" },
      I: { en: "Investigative (Thinker)", hi: "अन्वेषक (विचारक)" },
      A: { en: "Artistic (Creator)", hi: "कलात्मक (रचनाकार)" },
      S: { en: "Social (Helper)", hi: "सामाजिक (सहायक)" },
      E: { en: "Enterprising (Persuader)", hi: "उद्यमी (प्रभावक)" },
      C: { en: "Conventional (Organizer)", hi: "पारंपरिक (व्यवस्थापक)" },
    };

    return (
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.aptitude.results.title}</h1>
          </motion.div>

          {/* Personality Type */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-indigo-500/20 mb-6" style={{ background: "rgba(99,102,241,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">{t.aptitude.results.personality}</h2>
            </div>
            <div className="text-2xl font-bold gradient-text mb-3">{isHi ? profile.typeHi : profile.type}</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(profile.scores).map(([key, val]) => (
                <div key={key} className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <div className="text-lg font-bold text-indigo-400">{Math.round(val * 20)}%</div>
                  <div className="text-[10px] text-slate-500">{riasecLabels[key]?.[isHi ? "hi" : "en"]}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Careers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/5 mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold">{t.aptitude.results.topCareers}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {profile.topCareers.map((career, i) => (
                <Link key={i} href="/paths" className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all text-sm font-medium">
                  {career}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Strengths */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-green-500/20 mb-6" style={{ background: "rgba(34,197,94,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-green-400" />
              <h2 className="font-semibold">{t.aptitude.results.strengths}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Avoid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl border border-red-500/20 mb-6" style={{ background: "rgba(239,68,68,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="font-semibold">{t.aptitude.results.avoid}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.avoid.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep("intro"); setCurrentQ(0); setAnswers({}); setProfile(null); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <RotateCcw className="w-4 h-4" /> {t.aptitude.results.retake}
            </button>
            <Link href="/paths" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all font-semibold">
              {t.aptitude.results.viewPaths} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.aptitude.progress} {currentQ + 1} {t.aptitude.of} {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mb-8">
            <div className="text-xs text-indigo-400 mb-2 uppercase tracking-wider font-medium">{isHi ? q.category === "riasec" ? "RIASEC" : q.category === "big5" ? "Big 5" : q.category === "values" ? "मूल्य" : q.category === "workStyle" ? "कार्य शैली" : "ताकत" : q.category.replace(/([A-Z])/g, " $1").trim()}</div>
            <h2 className="text-xl font-semibold mb-6">{isHi ? q.questionHi : q.question}</h2>
            <div className="space-y-2">
              {q.options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(q.id, opt.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[q.id] === opt.value
                      ? "border-indigo-500/40 bg-indigo-500/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]"
                  }`}>
                  {isHi ? opt.labelHi : opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm disabled:opacity-30 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" /> {t.aptitude.prevBtn}
          </button>
          {currentQ < QUESTIONS.length - 1 ? (
            <button onClick={() => setCurrentQ(currentQ + 1)} disabled={!answers[q.id]}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-medium disabled:opacity-30 transition-all">
              {t.aptitude.nextBtn} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold disabled:opacity-30 transition-all">
              <CheckCircle2 className="w-4 h-4" /> {t.aptitude.submitBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
