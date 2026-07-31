"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Lightbulb, AlertTriangle, HelpCircle, ChevronRight, CheckCircle2, Video, Zap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { APTITUDE_CONTENT, GENERIC_APTITUDE_THEORY } from "@/lib/aptitude-content";

const TOPIC_META: Record<string, { title: string; topics: string[] }> = {
  percentage: { title: "Percentage", topics: ["Percentage Basics", "Fraction to Percentage", "Percentage Change", "Successive Percentage", "Population Problems"] },
  arithmetic: { title: "Arithmetic", topics: ["BODMAS", "Fractions", "Decimals", "Simplification", "Approximation"] },
  "profit-loss": { title: "Profit & Loss", topics: ["Cost & Selling Price", "Profit Percentage", "Discounts", "Marked Price", "Successive Discounts"] },
  "time-work": { title: "Time & Work", topics: ["Work Efficiency", "Combined Work", "Pipes & Cisterns", "Alternate Work", "Work & Wages"] },
  "time-speed": { title: "Time Speed Distance", topics: ["Speed Distance Time", "Relative Speed", "Trains", "Boats & Streams", "Races"] },
  probability: { title: "Probability", topics: ["Basic Probability", "Conditional Probability", "Bayes Theorem", "Probability Distributions", "Expected Value"] },
  permutation: { title: "Permutation & Combination", topics: ["Factorial", "Permutations", "Combinations", "Circular Arrangements", "Constraints"] },
  "number-system": { title: "Number System", topics: ["Number Types", "Divisibility Rules", "LCM & HCF", "Remainders", "Base Systems"] },
  ratio: { title: "Ratio & Proportion", topics: ["Basic Ratios", "Proportions", "Partnership", "Mixtures", "Direct & Inverse Variation"] },
  average: { title: "Average", topics: ["Basic Average", "Weighted Average", "Combined Groups", "Average Speed", "Age Problems"] },
  algebra: { title: "Algebra", topics: ["Linear Equations", "Quadratic Equations", "Polynomials", "Inequalities", "Algebraic Identities"] },
  geometry: { title: "Geometry", topics: ["Lines & Angles", "Triangles", "Circles", "Polygons", "Coordinate Geometry"] },
  trigonometry: { title: "Trigonometry", topics: ["Trig Ratios", "Identities", "Heights & Distances", "Angle Measurements", "Applications"] },
  mensuration: { title: "Mensuration", topics: ["2D Shapes Area", "3D Shapes Volume", "Surface Area", "Composite Shapes", "Unit Conversions"] },
  "data-interpretation": { title: "Data Interpretation", topics: ["Tables", "Bar Graphs", "Pie Charts", "Line Graphs", "Mixed Charts"] },
  "data-sufficiency": { title: "Data Sufficiency", topics: ["Statement Analysis", "Sufficiency Conditions", "Combined Statements", "Logical Deduction", "GMAT Style"] },
  simplification: { title: "Simplification", topics: ["BODMAS", "Approximation", "Surds", "Indices", "Square Roots"] },
  pipes: { title: "Pipes & Cisterns", topics: ["Fill Rates", "Empty Rates", "Combined Pipes", "Leak Problems", "Capacity"] },
};

type SampleQ = { difficulty: string; question: string; options: string[]; correct: number; explanation: string };

const SAMPLE_QUESTIONS: Record<string, SampleQ[]> = {
  percentage: [
    { difficulty: "Easy", question: "What is 20% of 450?", options: ["80", "90", "100", "110"], correct: 1, explanation: "20% of 450 = (20/100) × 450 = 0.2 × 450 = 90" },
    { difficulty: "Easy", question: "Convert 3/5 to percentage.", options: ["30%", "40%", "50%", "60%"], correct: 3, explanation: "(3/5) × 100 = 60%" },
    { difficulty: "Medium", question: "If A's salary is 20% less than B's, B's salary is what percent more than A's?", options: ["20%", "25%", "15%", "30%"], correct: 1, explanation: "Let B = 100, A = 80. (20/80) × 100 = 25%" },
    { difficulty: "Hard", question: "A number is first increased by 10% and then decreased by 10%. Net change?", options: ["0%", "1% increase", "1% decrease", "No change"], correct: 2, explanation: "10 + (-10) + (10 × -10)/100 = -1% = 1% decrease" },
  ],
  arithmetic: [
    { difficulty: "Easy", question: "Simplify: 12 + 6 ÷ 3 × 2", options: ["12", "16", "18", "10"], correct: 1, explanation: "BODMAS: 6 ÷ 3 = 2, 2 × 2 = 4, 12 + 4 = 16" },
    { difficulty: "Medium", question: "What is 0.625 as a fraction?", options: ["5/8", "3/4", "5/6", "7/8"], correct: 0, explanation: "0.625 = 625/1000 = 5/8" },
    { difficulty: "Hard", question: "Simplify: (3² + 4²) / 5", options: ["7", "5", "25", "3.4"], correct: 1, explanation: "(9 + 16) / 5 = 25 / 5 = 5" },
  ],
  "profit-loss": [
    { difficulty: "Easy", question: "A shirt costing ₹500 is sold at ₹600. Profit percent?", options: ["16.67%", "20%", "25%", "10%"], correct: 1, explanation: "Profit = 100, CP = 500, Profit% = (100/500)×100 = 20%" },
    { difficulty: "Medium", question: "An item marked at ₹800 is sold at 15% discount. Selling price?", options: ["₹680", "₹720", "₹700", "₹760"], correct: 0, explanation: "Discount = 15% of 800 = 120, SP = 800 - 120 = 680" },
    { difficulty: "Hard", question: "A shopkeeper sells an item at ₹360 after giving a 10% discount and still makes 20% profit. Cost price?", options: ["₹270", "₹280", "₹300", "₹320"], correct: 0, explanation: "MP = 360/0.9 = 400. CP = 400/(1.2) = ₹333.33. Actually: SP = 360, Profit = 20%, CP = 360/1.2 = 300" },
  ],
  "time-work": [
    { difficulty: "Easy", question: "A can do a work in 10 days, B in 15 days. Together in how many days?", options: ["5", "6", "8", "12"], correct: 1, explanation: "A's 1 day = 1/10, B's 1 day = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. So 6 days." },
    { difficulty: "Medium", question: "A pipe fills a tank in 6 hours, another empties it in 9 hours. Both open together, time to fill?", options: ["12 hours", "15 hours", "18 hours", "21 hours"], correct: 2, explanation: "In 1 hour: 1/6 - 1/9 = 3/18 - 2/18 = 1/18. So 18 hours to fill." },
    { difficulty: "Hard", question: "A is twice as efficient as B. Together they finish in 12 days. A alone takes how many days?", options: ["16", "18", "20", "24"], correct: 1, explanation: "Let B's efficiency = 1 unit/day, A = 2 units/day. Total work = 12 × 3 = 36 units. A alone = 36/2 = 18 days." },
  ],
  "time-speed": [
    { difficulty: "Easy", question: "A train travels 240 km in 4 hours. Speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, explanation: "Speed = 240/4 = 60 km/h" },
    { difficulty: "Medium", question: "A car covers 150 km at 50 km/h and next 100 km at 40 km/h. Average speed?", options: ["45.5 km/h", "46.15 km/h", "44 km/h", "48 km/h"], correct: 1, explanation: "Time1 = 150/50 = 3h, Time2 = 100/40 = 2.5h. Avg speed = 250/5.4 = 46.15 km/h" },
    { difficulty: "Hard", question: "A train 300 m long passes a pole in 15 seconds. Speed in km/h?", options: ["60", "72", "80", "90"], correct: 1, explanation: "Speed = 300/15 = 20 m/s. In km/h: 20 × 18/5 = 72 km/h" },
  ],
  probability: [
    { difficulty: "Easy", question: "A coin is tossed. Probability of heads?", options: ["0.25", "0.5", "0.75", "1"], correct: 1, explanation: "There are 2 outcomes, heads is 1. P = 1/2 = 0.5" },
    { difficulty: "Medium", question: "A die is rolled. Probability of getting a number > 4?", options: ["1/6", "1/3", "1/2", "2/3"], correct: 1, explanation: "Numbers > 4: 5,6. So 2/6 = 1/3" },
    { difficulty: "Hard", question: "Two dice are rolled. Probability of sum 7?", options: ["1/6", "1/9", "5/36", "1/12"], correct: 0, explanation: "Favorable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Total = 36. P = 6/36 = 1/6" },
  ],
  permutation: [
    { difficulty: "Easy", question: "How many ways to arrange 4 books on a shelf?", options: ["12", "16", "24", "48"], correct: 2, explanation: "4! = 4×3×2×1 = 24" },
    { difficulty: "Medium", question: "How many 3-letter words can be formed from 'TABLE' without repetition?", options: ["60", "120", "20", "30"], correct: 0, explanation: "5P3 = 5×4×3 = 60" },
    { difficulty: "Medium", question: "In how many ways can 3 people be selected from 7?", options: ["35", "21", "42", "28"], correct: 0, explanation: "7C3 = 7!/(3!4!) = 35" },
  ],
  "number-system": [
    { difficulty: "Easy", question: "What is the LCM of 12 and 18?", options: ["24", "36", "48", "72"], correct: 1, explanation: "LCM(12,18) = 36" },
    { difficulty: "Medium", question: "What is the HCF of 48 and 72?", options: ["12", "18", "24", "36"], correct: 2, explanation: "HCF(48,72) = 24" },
    { difficulty: "Hard", question: "Find the remainder when 7³⁰ is divided by 5.", options: ["0", "1", "2", "4"], correct: 3, explanation: "7 mod 5 = 2. So 7³⁰ mod 5 = 2³⁰ mod 5. 2⁴=16≡1 mod5. 2³⁰ = 2²⁸×4 ≡ 1×4 = 4 mod5" },
  ],
  ratio: [
    { difficulty: "Easy", question: "Divide 100 in ratio 2:3.", options: ["40:60", "30:70", "45:55", "50:50"], correct: 0, explanation: "Total parts = 5. First = (2/5)×100 = 40, Second = (3/5)×100 = 60" },
    { difficulty: "Medium", question: "If A:B = 2:3 and B:C = 4:5, find A:B:C.", options: ["2:3:4", "8:12:15", "6:9:10", "4:6:5"], correct: 1, explanation: "A:B = 2:3 = 8:12, B:C = 4:5 = 12:15. So A:B:C = 8:12:15" },
    { difficulty: "Medium", question: "In a mixture of 60L, milk:water = 5:1. How much water to add to make ratio 5:2?", options: ["8L", "10L", "12L", "15L"], correct: 1, explanation: "Milk = 50, Water = 10. Need 50/(10+x) = 5/2. 100 = 50 + 5x, x = 10L" },
  ],
  average: [
    { difficulty: "Easy", question: "Average of 5, 10, 15, 20, 25?", options: ["12", "14", "15", "18"], correct: 2, explanation: "Sum = 75, Count = 5, Average = 75/5 = 15" },
    { difficulty: "Medium", question: "Average of 8 numbers is 15. One number 20 is removed. New average?", options: ["14.29", "14.5", "15", "13.5"], correct: 0, explanation: "Sum = 8×15 = 120. New sum = 100, New count = 7. Average = 100/7 ≈ 14.29" },
    { difficulty: "Hard", question: "Average of 5 numbers is 27. If one number is excluded, average becomes 25. Excluded number?", options: ["30", "32", "35", "28"], correct: 2, explanation: "Sum of 5 = 135, Sum of 4 = 100. Excluded = 135 - 100 = 35" },
  ],
  algebra: [
    { difficulty: "Easy", question: "Solve: 2x + 5 = 13", options: ["x=3", "x=4", "x=5", "x=6"], correct: 1, explanation: "2x = 8, x = 4" },
    { difficulty: "Medium", question: "If x² - 5x + 6 = 0, what are the roots?", options: ["1,6", "2,3", "-2,-3", "2,-3"], correct: 1, explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or 3" },
    { difficulty: "Hard", question: "If a+b=7 and ab=12, find a²+b².", options: ["25", "37", "49", "13"], correct: 0, explanation: "a²+b² = (a+b)² - 2ab = 49 - 24 = 25" },
  ],
  geometry: [
    { difficulty: "Easy", question: "Sum of interior angles of a triangle?", options: ["180°", "270°", "360°", "90°"], correct: 0, explanation: "Sum of interior angles of any triangle = 180°" },
    { difficulty: "Medium", question: "Area of a circle with radius 7 cm?", options: ["144 cm²", "154 cm²", "164 cm²", "174 cm²"], correct: 1, explanation: "Area = πr² = (22/7) × 49 = 154 cm²" },
    { difficulty: "Medium", question: "In a right triangle with legs 6 and 8, hypotenuse?", options: ["10", "12", "14", "9"], correct: 0, explanation: "By Pythagoras: h² = 6² + 8² = 36 + 64 = 100, h = 10" },
  ],
  trigonometry: [
    { difficulty: "Easy", question: "Value of sin 30°?", options: ["0", "1/2", "1/√2", "√3/2"], correct: 1, explanation: "sin 30° = 1/2" },
    { difficulty: "Medium", question: "Value of tan 45°?", options: ["0", "1", "√3", "1/√3"], correct: 1, explanation: "tan 45° = 1" },
    { difficulty: "Medium", question: "If sin θ = 3/5, find cos θ.", options: ["4/5", "2/5", "3/4", "5/3"], correct: 0, explanation: "sin²θ + cos²θ = 1, cos²θ = 1 - 9/25 = 16/25, cos θ = 4/5" },
  ],
  mensuration: [
    { difficulty: "Easy", question: "Volume of a cube with side 5 cm?", options: ["25 cm³", "125 cm³", "100 cm³", "150 cm³"], correct: 1, explanation: "Volume = side³ = 125 cm³" },
    { difficulty: "Medium", question: "Surface area of a sphere with radius 7 cm?", options: ["616 cm²", "516 cm²", "716 cm²", "416 cm²"], correct: 0, explanation: "SA = 4πr² = 4 × (22/7) × 49 = 616 cm²" },
    { difficulty: "Hard", question: "A cylinder with radius 7 cm and height 10 cm. Total surface area?", options: ["640 cm²", "748 cm²", "840 cm²", "548 cm²"], correct: 1, explanation: "TSA = 2πr² + 2πrh = 2×(22/7)×49 + 2×(22/7)×70 = 308 + 440 = 748 cm²" },
  ],
  "data-interpretation": [
    { difficulty: "Easy", question: "A bar graph shows sales: Jan=50, Feb=60, Mar=70. Total sales?", options: ["160", "170", "180", "190"], correct: 2, explanation: "50 + 60 + 70 = 180" },
    { difficulty: "Medium", question: "In a pie chart, a sector is 90°. What percentage does it represent?", options: ["15%", "20%", "25%", "30%"], correct: 2, explanation: "90/360 × 100 = 25%" },
    { difficulty: "Medium", question: "A table shows marks of 5 students: 85, 76, 92, 68, 79. Average?", options: ["78", "80", "82", "84"], correct: 1, explanation: "Sum = 400, Count = 5, Average = 80" },
  ],
  "data-sufficiency": [
    { difficulty: "Easy", question: "Is x > 5? (1) x > 7 (2) x < 9", options: ["Statement 1 alone", "Statement 2 alone", "Both together", "Neither"], correct: 0, explanation: "Statement 1 alone tells us x > 7 which means x > 5. Statement 2 alone is not sufficient." },
    { difficulty: "Medium", question: "What is the value of x? (1) x² = 25 (2) x > 0", options: ["Statement 1 alone", "Statement 2 alone", "Both together", "Neither"], correct: 2, explanation: "From (1), x = ±5. Using (2), x = 5. So both together are needed." },
    { difficulty: "Medium", question: "Is triangle ABC right-angled? (1) AB² + BC² = AC² (2) AB = BC", options: ["Statement 1 alone", "Statement 2 alone", "Both together", "Neither"], correct: 0, explanation: "Statement 1 satisfies Pythagoras theorem directly, so it's sufficient." },
  ],
  simplification: [
    { difficulty: "Easy", question: "Simplify: √144 + √169", options: ["23", "25", "27", "29"], correct: 1, explanation: "12 + 13 = 25" },
    { difficulty: "Medium", question: "Simplify: (27)^(2/3)", options: ["3", "6", "9", "18"], correct: 2, explanation: "(27)^(2/3) = (3³)^(2/3) = 3² = 9" },
    { difficulty: "Hard", question: "Simplify: (2√3 + 3√2)(2√3 - 3√2)", options: ["-6", "0", "6", "12"], correct: 0, explanation: "(2√3)² - (3√2)² = 12 - 18 = -6" },
  ],
  pipes: [
    { difficulty: "Easy", question: "Pipe A fills a tank in 12 hours. Part filled in 3 hours?", options: ["1/4", "1/3", "1/2", "2/3"], correct: 0, explanation: "In 1 hour: 1/12. In 3 hours: 3/12 = 1/4" },
    { difficulty: "Medium", question: "Pipe A fills in 8 hours, Pipe B fills in 12 hours. Together in how many hours?", options: ["4.8h", "5h", "6h", "7.2h"], correct: 0, explanation: "1/8 + 1/12 = 5/24. So time = 24/5 = 4.8 hours" },
    { difficulty: "Hard", question: "A pipe fills in 10 hours. Due to leak, it takes 15 hours. Leak alone empties in how many hours?", options: ["20", "25", "30", "35"], correct: 2, explanation: "Fill rate = 1/10, Net rate = 1/15. Leak = 1/10 - 1/15 = 1/30. So 30 hours." },
  ],
};

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topic as string;
  const meta = TOPIC_META[topicId];
  const sampleQs = SAMPLE_QUESTIONS[topicId] || [];
  const content = APTITUDE_CONTENT[topicId] || GENERIC_APTITUDE_THEORY;
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [openSection, setOpenSection] = useState<string>("theory");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!data.onboarded) { router.push("/assessment"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("topic load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (!meta) {
    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Topic not found</h2>
          <Link href="/interview-preparation/aptitude" className="text-indigo-400 hover:underline">Back to Aptitude</Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const sections = [
    { id: "theory", label: "Theory & Concepts", icon: BookOpen },
    { id: "formulas", label: "Formula Sheet", icon: Lightbulb },
    { id: "practice", label: "Practice Problems", icon: HelpCircle },
    { id: "tips", label: "Tips & Tricks", icon: Zap },
    { id: "watch", label: "Video Tutorials", icon: Video },
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link href="/interview-preparation/aptitude" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Aptitude
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{meta.title}</h1>
                <p className="text-sm text-slate-400">Master the fundamentals with theory, practice, and smart techniques</p>
              </div>
            </div>
          </motion.div>

          {/* Section Tabs */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
            {sections.map(s => (
              <button key={s.id} onClick={() => setOpenSection(s.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  openSection === s.id ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:text-white bg-white/[0.02] border border-white/5"
                }`}>
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Theory Section */}
          {openSection === "theory" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <h2 className="font-semibold mb-4">{meta.title} — Theory & Concepts</h2>
                <div className="space-y-5 text-sm text-slate-300 leading-relaxed">
                  {content.theory.map((sec, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-200 mb-1.5">{sec.heading}</h3>
                          <p className="text-sm text-slate-400">{sec.body}</p>
                          {sec.example && (
                            <div className="mt-2 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Example</span>
                              <p className="text-sm text-slate-300 mt-1 font-mono">{sec.example}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Formulas Section */}
          {openSection === "formulas" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <h2 className="font-semibold mb-4">Formula Sheet — {meta.title}</h2>
                <div className="space-y-3">
                  {content.formulas.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-xs text-indigo-400 font-medium mb-1">{f.name}</div>
                      <div className="text-sm font-mono text-slate-200">{f.formula}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Practice Section */}
          {openSection === "practice" && sampleQs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="space-y-4">
                {sampleQs.map((q, i) => {
                  const selected = selectedAnswers[i];
                  const isCorrect = selected === q.correct;
                  const showExp = showExplanations[i];
                  return (
                    <div key={i} className="p-5 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          q.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                          q.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>{q.difficulty}</span>
                        <span className="text-[10px] text-slate-500">Question {i + 1} of {sampleQs.length}</span>
                      </div>
                      <p className="text-sm font-medium mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, oi) => (
                          <button key={oi} onClick={() => {
                            setSelectedAnswers(prev => ({ ...prev, [i]: oi }));
                            setShowExplanations(prev => ({ ...prev, [i]: true }));
                          }}
                            className={`p-3 rounded-xl text-sm text-left transition-all border ${
                              selected === oi
                                ? isCorrect ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400"
                                : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                            }`}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </button>
                        ))}
                      </div>
                      {showExp && (
                        <div className={`p-3 rounded-xl text-sm ${isCorrect ? "bg-green-500/5 border border-green-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                            <span className={`text-xs font-medium ${isCorrect ? "text-green-400" : "text-amber-400"}`}>
                              {isCorrect ? "Correct!" : "Not quite"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {openSection === "practice" && sampleQs.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-white/5">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Practice problems coming soon for this topic.</p>
            </div>
          )}

          {/* Tips Section */}
          {openSection === "tips" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <h2 className="font-semibold mb-4">Tips & Tricks — {meta.title}</h2>
                <div className="space-y-3">
                  {content.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Video Section */}
          {openSection === "watch" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 rounded-2xl border border-white/5" style={{ background: "rgba(17,17,24,0.5)" }}>
                <h2 className="font-semibold mb-4">Video Tutorials</h2>
                <p className="text-sm text-slate-400 mb-4">Watch curated video lessons to understand concepts visually.</p>
                <div className="space-y-3">
                  {[
                    { title: `${meta.title} — Basic to Advanced`, channel: "YouTube", duration: "15 min" },
                    { title: `${meta.title} Tricks for Competitive Exams`, channel: "YouTube", duration: "20 min" },
                    { title: `${meta.title} — Previous Year Questions`, channel: "YouTube", duration: "25 min" },
                  ].map((v, i) => (
                    <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(meta.title + " aptitude tricks")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Video className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate group-hover:text-indigo-400 transition-colors">{v.title}</div>
                        <div className="text-xs text-slate-500">{v.channel} · {v.duration}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
