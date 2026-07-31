"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, ChevronRight, Lightbulb, Clock, Target, Layers, Database, Flame } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { HACKATHON_IDEAS, HACKATHON_CATEGORIES, HACKATHON_WINNING_TIPS } from "@/data/hackathon-ideas";

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-400",
  Advanced: "bg-red-500/10 text-red-400",
};

export default function HackathonPage() {
  const { t, locale } = useLanguage();
  const { user, loading: authLoading, logout } = useAuth({ requireAuth: true, requireOnboarded: false });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const isHi = locale === "hi";

  const filtered = HACKATHON_IDEAS.filter(idea => {
    const matchesFilter = filter === "all" || idea.category === filter;
    const matchesSearch = search === "" ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.tagline.toLowerCase().includes(search.toLowerCase()) ||
      idea.stack.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (authLoading) return (
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
            <h1 className="text-2xl font-bold mb-1">{isHi ? "हैकाथॉन जीतने वाले आइडियाज" : "Hackathon Winning Ideas"}</h1>
            <p className="text-slate-400 text-sm mb-6">{isHi
              ? "वास्तविक समस्याएं, तैयार टेक स्टैक, और जजों को लुभाने वाला कोण। स्मार्ट इंडिया हैकाथॉन के लिए डिज़ाइन किया गया।"
              : "Real problems, ready tech stacks, and a judged winning angle for each. Built for Smart India Hackathon and beyond."}</p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isHi ? "खोजें (शीर्षक, टैग, तकनीक)..." : "Search by title, tagline, or tech stack..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "all" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
              }`}>
              <Layers className="w-3 h-3" />
              {isHi ? "सभी" : "All"}
            </button>
            {HACKATHON_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button key={cat.key} onClick={() => setFilter(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === cat.key ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
                  }`}>
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Ideas */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {filtered.map(idea => (
              <motion.div key={idea.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[idea.difficulty]}`}>{idea.difficulty}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {idea.timeToBuild}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 ml-auto">
                    {HACKATHON_CATEGORIES.find(c => c.key === idea.category)?.label}
                  </span>
                </div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-indigo-400 shrink-0" />
                  {idea.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{idea.tagline}</p>

                <details className="group mt-auto">
                  <summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors list-none flex items-center gap-1">
                    {isHi ? "पूरा आइडिया देखें" : "View full idea"}
                    <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-1">
                        <Flame className="w-3 h-3 text-red-400" /> {isHi ? "समस्या" : "Problem"}
                      </div>
                      <p className="text-xs text-slate-400">{idea.problem}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-1">
                        <Lightbulb className="w-3 h-3 text-amber-400" /> {isHi ? "समाधान" : "Solution"}
                      </div>
                      <p className="text-xs text-slate-400">{idea.solution}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-1">
                        <Target className="w-3 h-3 text-emerald-400" /> {isHi ? "मुख्य विशेषताएं" : "Key Features"}
                      </div>
                      <ul className="space-y-1">
                        {idea.features.map((f, i) => (
                          <li key={i} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-indigo-400">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1.5">{isHi ? "टेक स्टैक" : "Tech Stack"}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.stack.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-1">
                        <Target className="w-3 h-3 text-rose-400" /> {isHi ? "प्रभाव" : "Impact"}
                      </div>
                      <p className="text-xs text-slate-400">{idea.impact}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="text-[11px] font-semibold text-indigo-300 mb-1">{isHi ? "🏆 जीतने का कोण" : "🏆 Winning Angle"}</div>
                      <p className="text-xs text-slate-400">{idea.winningAngle}</p>
                    </div>
                    {idea.datasets && (
                      <div className="flex items-start gap-1.5">
                        <Database className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-slate-500">
                          <span className="text-slate-400">{isHi ? "डेटा स्रोत:" : "Data sources:"}</span> {idea.datasets}
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 mb-10">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-sm text-slate-500">{isHi ? "कोई आइडिया नहीं मिला" : "No ideas found matching your search"}</p>
            </div>
          )}

          {/* Winning Tips */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold mb-1">{isHi ? "हैकाथॉन कैसे जीतें" : "How Hackathons Are Won"}</h2>
            <p className="text-slate-400 text-sm mb-4">{isHi ? "जज हमेशा क्या देखते हैं — वही सबसे ज्यादा मायने रखता है।" : "What judges actually look for — more than the code."}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HACKATHON_WINNING_TIPS.map((tip, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white mb-3">{i + 1}</div>
                  <h3 className="font-semibold text-sm mb-1">{tip.title}</h3>
                  <p className="text-xs text-slate-400">{tip.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
