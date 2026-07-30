"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Shield, ChevronRight, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { SCHEMES, GOVT_CATEGORIES, type Scheme } from "@/data/govt-schemes";

export default function GovtSchemesPage() {
  const { t, locale } = useLanguage();
  const { user, loading: authLoading, logout } = useAuth({ requireAuth: true, requireOnboarded: false });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  const isHi = locale === "hi";

  const filtered = SCHEMES.filter(s => {
    const matchesFilter = filter === "all" || s.category === filter;
    const matchesSearch = search === "" ||
      (isHi ? s.nameHi : s.name).toLowerCase().includes(search.toLowerCase()) ||
      (isHi ? s.descriptionHi : s.description).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = GOVT_CATEGORIES.map(c => ({
    ...c,
    label: (t as any).govt?.[c.key === "all" ? "all" : c.key] || c.key,
  }));

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
            <h1 className="text-2xl font-bold mb-1">{(t as any).govt?.title || "Government Schemes"}</h1>
            <p className="text-slate-400 text-sm mb-6">{(t as any).govt?.subtitle || "Financial aid, scholarships & skill programs for students"}</p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isHi ? "खोजें..." : "Search schemes..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => {
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

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(scheme => (
              <motion.div key={scheme.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center shrink-0`}>
                    <scheme.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{isHi ? scheme.nameHi : scheme.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">{isHi ? scheme.descriptionHi : scheme.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                        {scheme.amount}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                        {scheme.deadline}
                      </span>
                    </div>
                    <details className="group">
                      <summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors list-none flex items-center gap-1">
                        {(isHi ? "पात्रता देखें" : "Show eligibility")}
                        <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="text-xs text-slate-500 mt-2">{isHi ? scheme.eligibilityHi : scheme.eligibility}</p>
                    </details>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <ExternalLink className="w-3 h-3" /> {isHi ? "आवेदन करें" : "Apply"}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-sm text-slate-500">{isHi ? "कोई योजना नहीं मिली" : "No schemes found"}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
