"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/LanguageProvider";
import Sidebar from "@/components/Sidebar";
import { CAREER_DATABASE } from "@/lib/careers";
import PageTour from "@/components/PageTour";

export default function AutomationShieldPage() {
  const { t, locale } = useLanguage();
  const { user, loading, logout } = useAuth();
  const [filter, setFilter] = useState<"all" | "safe" | "risky" | "critical">("all");

  const isHi = locale === "hi";

  const careers = CAREER_DATABASE.map(c => ({
    ...c,
    riskLevel: c.aiRiskScore <= 0.15 ? "safe" : c.aiRiskScore <= 0.4 ? "risky" : "critical",
  }));

  const filtered = filter === "all" ? careers : careers.filter(c => c.riskLevel === filter);
  const sorted = [...filtered].sort((a, b) => a.aiRiskScore - b.aiRiskScore);

  const safeCount = careers.filter(c => c.riskLevel === "safe").length;
  const riskyCount = careers.filter(c => c.riskLevel === "risky").length;
  const criticalCount = careers.filter(c => c.riskLevel === "critical").length;

  const riskColor = (level: string) => {
    switch (level) {
      case "safe": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "risky": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "critical": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-white/5 border-white/10";
    }
  };

  const riskIcon = (level: string) => {
    switch (level) {
      case "safe": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "risky": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "critical": return <Zap className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const riskLabel = (level: string) => {
    if (level === "safe") return isHi ? "AI-सुरक्षित" : "AI-Safe";
    if (level === "risky") return isHi ? "AI-जोखिम" : "AI-Risky";
    return isHi ? "गंभीर जोखिम" : "Critical Risk";
  };

  const growthIcon = (outlook: string) => {
    switch (outlook) {
      case "booming": return <TrendingUp className="w-3.5 h-3.5 text-green-400" />;
      case "growing": return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case "declining": return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
      default: return <ArrowRight className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

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
          <motion.div data-tour="shield-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">{(t as any).shield?.title || "Automation Shield"}</h1>
            <p className="text-slate-400 text-sm mb-6">{(t as any).shield?.subtitle || "Career automation risk analysis"}</p>
          </motion.div>

          {/* Stats */}
          <div data-tour="shield-stats" className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <div className="text-2xl font-bold text-green-400">{safeCount}</div>
              <div className="text-xs text-green-400/70">{(t as any).shield?.safe || "AI-Safe"}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
              <div className="text-2xl font-bold text-amber-400">{riskyCount}</div>
              <div className="text-xs text-amber-400/70">{(t as any).shield?.risky || "AI-Risky"}</div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
              <div className="text-xs text-red-400/70">{(t as any).shield?.critical || "Critical"}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {(["all", "safe", "risky", "critical"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  filter === f ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.05]"
                }`}>
                {f === "all" ? (isHi ? "सभी" : "All") : riskLabel(f)}
              </button>
            ))}
          </div>

          {/* Career Grid */}
          <div data-tour="shield-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((career, i) => (
              <motion.div key={career.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${riskColor(career.riskLevel).split(" ").slice(1).join(" ")}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{career.title}</h3>
                  {riskIcon(career.riskLevel)}
                </div>

                {/* Risk Score Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{(t as any).shield?.riskScore || "Risk Score"}</span>
                    <span className={`font-bold ${career.aiRiskScore <= 0.15 ? "text-green-400" : career.aiRiskScore <= 0.4 ? "text-amber-400" : "text-red-400"}`}>
                      {Math.round(career.aiRiskScore * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full ${career.aiRiskScore <= 0.15 ? "bg-green-500" : career.aiRiskScore <= 0.4 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${career.aiRiskScore * 100}%` }} />
                  </div>
                </div>

                {/* Growth */}
                <div className="flex items-center gap-2 mb-2">
                  {growthIcon(career.growthOutlook)}
                  <span className="text-xs text-slate-400 capitalize">{career.growthOutlook}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-400">₹{(career.salaryMin / 100000).toFixed(1)}L - ₹{(career.salaryMax / 100000).toFixed(1)}L</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{career.futureOutlook}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div data-tour="shield-cta" className="mt-8 p-6 rounded-2xl border border-indigo-500/20 text-center" style={{ background: "rgba(99,102,241,0.05)" }}>
            <Shield className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
            <h3 className="font-semibold mb-2">{isHi ? "अपने करियर की AI जोखिम जांचें" : "Check Your Career's AI Risk"}</h3>
            <p className="text-sm text-slate-400 mb-4">{isHi ? "जानें आपका चुना हुआ करियर AI सुरक्षित है या नहीं।" : "Find out if your chosen career is AI-safe."}</p>
            <Link href="/paths" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all font-semibold text-sm">
              {isHi ? "करियर पाथ देखें" : "View Career Paths"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PageTour id="shield" steps={[
            { target: "[data-tour='shield-header']", title: "Automation Shield", body: "See how AI will reshape each career over the next decade." },
            { target: "[data-tour='shield-stats']", title: "Risk overview", body: "Safe, risky and critical careers at a glance." },
            { target: "[data-tour='shield-grid']", title: "Explore careers", body: "Every card shows the AI risk score, growth outlook and salary range." },
            { target: "[data-tour='shield-cta']", title: "Check your own", body: "Find your own career's AI risk in the career paths explorer." },
          ]} />
        </div>
      </main>
    </div>
  );
}
