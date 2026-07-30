"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Brain, Shield, BookOpen, School, Loader2, Zap, TrendingUp, Globe, LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const FEATURES = [
  { icon: Brain, titleKey: "landing.feature1Title", descKey: "landing.feature1Desc", color: "rgba(99,102,241,0.15)" },
  { icon: Zap, titleKey: "landing.feature2Title", descKey: "landing.feature2Desc", color: "rgba(168,85,247,0.15)" },
  { icon: School, titleKey: "landing.feature3Title", descKey: "landing.feature3Desc", color: "rgba(6,182,212,0.15)" },
  { icon: Shield, titleKey: "landing.feature4Title", descKey: "landing.feature4Desc", color: "rgba(244,63,94,0.15)" },
  { icon: BookOpen, titleKey: "landing.feature5Title", descKey: "landing.feature5Desc", color: "rgba(16,185,129,0.15)" },
  { icon: Globe, titleKey: "landing.feature6Title", descKey: "landing.feature6Desc", color: "rgba(245,158,11,0.15)" },
];

const CRISES = [
  { titleKey: "landing.crisis1Title", valueKey: "landing.crisis1Value", descKey: "landing.crisis1Desc", color: "text-red-400" },
  { titleKey: "landing.crisis2Title", valueKey: "landing.crisis2Value", descKey: "landing.crisis2Desc", color: "text-amber-400" },
  { titleKey: "landing.crisis3Title", valueKey: "landing.crisis3Value", descKey: "landing.crisis3Desc", color: "text-purple-400" },
  { titleKey: "landing.crisis4Title", valueKey: "landing.crisis4Value", descKey: "landing.crisis4Desc", color: "text-indigo-400" },
];

export default function LandingPage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);
  const { t, locale, setLocale } = useLanguage();

  const getVal = (key: string) => {
    const keys = key.split(".");
    let val: any = t;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === "string" ? val : key;
  };

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) {
        router.push("/assessment");
      }
    } catch (e) { console.error("startDemo", e);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg">Compass</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Globe className="w-3.5 h-3.5" />
              {locale === "en" ? "हिंदी" : "EN"}
            </button>
            <button
              onClick={startDemo}
              disabled={demoLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {demoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
              {getVal("landing.demo")}
            </button>
            <Link href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-colors">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
            {getVal("landing.badge")}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
            <span className="text-red-400">{getVal("landing.heroTitle1")}</span><br />
            <span className="text-amber-400">{getVal("landing.heroTitle2")}</span><br />
            <span className="gradient-text">{getVal("landing.heroTitle3")}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            {getVal("landing.heroSub")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startDemo}
              disabled={demoLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-semibold transition-all glow-sm group disabled:opacity-50"
            >
              {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {demoLoading ? (locale === "hi" ? "डेमो सेटअप हो रहा है..." : "Setting up demo...") : getVal("landing.ctaButton")}
            </button>
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all group">
              <UserPlus className="w-4 h-4" /> {locale === "hi" ? "खाता बनाएं" : "Create Account"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { labelKey: "landing.stat1Label", valueKey: "landing.stat1Value", color: "text-red-400" },
              { labelKey: "landing.stat2Label", valueKey: "landing.stat2Value", color: "text-amber-400" },
              { labelKey: "landing.stat3Label", valueKey: "landing.stat3Value", color: "text-purple-400" },
              { labelKey: "landing.stat4Label", valueKey: "landing.stat4Value", color: "text-indigo-400" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{getVal(stat.valueKey)}</div>
                <div className="text-xs text-slate-500">{getVal(stat.labelKey)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Crisis Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{getVal("landing.impactTitle")}</h2>
            <p className="text-slate-400 max-w-lg mx-auto">{getVal("landing.impactSub")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CRISES.map((crisis, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/5 text-center" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className={`text-4xl font-bold ${crisis.color} mb-2`}>{getVal(crisis.valueKey)}</div>
                <div className="font-semibold text-sm mb-1">{getVal(crisis.titleKey)}</div>
                <div className="text-xs text-slate-500">{getVal(crisis.descKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Compass */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{getVal("landing.whyTitle")}</h2>
            <p className="text-slate-400 max-w-lg mx-auto">{getVal("landing.whySub")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }} className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color }}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5">{getVal(f.titleKey)}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{getVal(f.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-10 rounded-2xl border border-indigo-500/20 relative overflow-hidden" style={{ background: "rgba(99,102,241,0.05)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-20" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-3">{getVal("landing.ctaTitle")}</h2>
              <p className="text-slate-400 mb-6">{getVal("landing.ctaSub")}</p>
              <button
                onClick={startDemo}
                disabled={demoLoading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all glow-sm disabled:opacity-50"
              >
                {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {demoLoading ? (locale === "hi" ? "सेटअप हो रहा है..." : "Setting up...") : getVal("landing.ctaButton")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2"><Compass className="w-3.5 h-3.5" /> Compass</div>
          <div>{getVal("landing.footer")}</div>
        </div>
      </footer>
    </div>
  );
}
