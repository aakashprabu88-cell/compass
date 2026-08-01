"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion";
import { Compass, ArrowRight, Brain, Shield, Mic, Briefcase, Loader2, Zap, Globe, LogIn, UserPlus, Clapperboard } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageTour from "@/components/PageTour";

const CompassCanvas = dynamic(() => import("@/components/Compass3D"), { ssr: false, loading: () => null });

const BOOT_STEPS = [
  { label: "Initializing", text: "Sparks, meet gravity" },
  { label: "Aligning field", text: "Plotting your true north" },
  { label: "Compass AI online", text: "Ready to guide your career" },
];

const FEATURES = [
  { icon: Brain, titleKey: "landing.feature1Title", descKey: "landing.feature1Desc", color: "rgba(99,102,241,0.15)" },
  { icon: Zap, titleKey: "landing.feature2Title", descKey: "landing.feature2Desc", color: "rgba(168,85,247,0.15)" },
  { icon: Mic, titleKey: "landing.feature3Title", descKey: "landing.feature3Desc", color: "rgba(6,182,212,0.15)" },
  { icon: Shield, titleKey: "landing.feature4Title", descKey: "landing.feature4Desc", color: "rgba(244,63,94,0.15)" },
  { icon: Briefcase, titleKey: "landing.feature5Title", descKey: "landing.feature5Desc", color: "rgba(16,185,129,0.15)" },
  { icon: Globe, titleKey: "landing.feature6Title", descKey: "landing.feature6Desc", color: "rgba(245,158,11,0.15)" },
];

const CRISES = [
  { titleKey: "landing.crisis1Title", valueKey: "landing.crisis1Value", descKey: "landing.crisis1Desc", color: "text-red-400", glow: "rgba(248,113,113,0.5)" },
  { titleKey: "landing.crisis2Title", valueKey: "landing.crisis2Value", descKey: "landing.crisis2Desc", color: "text-amber-400", glow: "rgba(251,191,36,0.5)" },
  { titleKey: "landing.crisis3Title", valueKey: "landing.crisis3Value", descKey: "landing.crisis3Desc", color: "text-purple-400", glow: "rgba(192,132,252,0.5)" },
  { titleKey: "landing.crisis4Title", valueKey: "landing.crisis4Value", descKey: "landing.crisis4Desc", color: "text-indigo-400", glow: "rgba(129,140,248,0.5)" },
];

const STEPS = [
  {
    no: "01", key: "ASSESS",
    titleEn: "Map your strengths",
    titleHi: "अपनी ताकत पहचानें",
    descEn: "An AI-guided assessment builds a precise graph of your skills and ideal paths in minutes.",
    descHi: "AI-मार्गदर्शित मूल्यांकन मिनटों में आपके कौशल और आदर्श करियर पथ बनाता है।",
  },
  {
    no: "02", key: "UPSKILL",
    titleEn: "Follow your path",
    titleHi: "अपने रास्ते पर चलें",
    descEn: "Courses, aptitude drills and interview prep — sequenced exactly to close your gaps.",
    descHi: "कोर्स, योग्यता अभ्यास और इंटरव्यू तैयारी — आपकी कमियों को भरने के लिए।",
  },
  {
    no: "03", key: "LAND",
    titleEn: "Real offers, faster",
    titleHi: "वास्तविक नौकरी, जल्दी",
    descEn: "Matched openings, AI-drafted outreach and mock interviews until you get hired.",
    descHi: "मिलान वाली नौकरियाँ, AI-आउटरीच और मॉक इंटरव्यू जब तक आपको नौकरी न मिले।",
  },
];

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
    </svg>
  );
}

function OrbitRing({ sizePct, duration, border, dotColor, tilt }: { sizePct: number; duration: number; border: string; dotColor: string; tilt: string }) {
  const inset = `${(100 - sizePct) / 2}%`;
  return (
    <motion.div className="absolute inset-0" style={{ transform: tilt, transformStyle: "preserve-3d" }}
      animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      <div className="absolute rounded-full" style={{ inset, border }} />
      <div className="absolute w-[2.2%] h-[2.2%] rounded-full" style={{ left: "50%", top: inset, transform: "translate(-50%,-50%)", background: dotColor, boxShadow: `0 0 16px ${dotColor}` }} />
    </motion.div>
  );
}

function Orrery() {
  return (
    <div className="absolute inset-0" style={{ perspective: 1200 }} aria-hidden>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(18deg)" }}>
        <OrbitRing sizePct={100} duration={30} tilt="rotateX(70deg)" border="1px dashed rgba(129,140,248,0.35)" dotColor="#818cf8" />
        <OrbitRing sizePct={74} duration={40} tilt="rotateY(72deg)" border="1px solid rgba(52,211,153,0.28)" dotColor="#34d399" />
        <OrbitRing sizePct={52} duration={24} tilt="rotateX(-64deg)" border="1px solid rgba(232,121,249,0.3)" dotColor="#e879f9" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] h-[24%]">
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center"
            style={{ boxShadow: "0 0 60px rgba(129,140,248,0.6)" }}>
            <CompassIcon className="w-[45%] h-[45%] text-white" />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full border border-indigo-400/40" style={{ inset: "-12%" }} />
        </div>
      </div>
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rX.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    rY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
  };
  const reset = () => { rX.set(0); rY.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6 }} style={{ rotateX: rX, rotateY: rY, transformPerspective: 800 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);
  const [booted, setBooted] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const reducedMotion = useReducedMotion();
  const { t, locale, setLocale } = useLanguage();

  useEffect(() => {
    if (reducedMotion) { setBooted(true); return; }
    try {
      if (sessionStorage.getItem("compass_boot")) { setBooted(true); return; }
    } catch {}
    setBooted(false);
    const timer = setTimeout(() => {
      try { sessionStorage.setItem("compass_boot", "1"); } catch {}
      setBooted(true);
    }, 2150);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (booted) return;
    const iv = setInterval(() => setBootStep(s => Math.min(s + 1, BOOT_STEPS.length - 1)), 700);
    return () => clearInterval(iv);
  }, [booted]);

  const getVal = (key: string) => {
    const keys = key.split(".");
    let val: any = t;
    for (const k of keys) val = val?.[k];
    return typeof val === "string" ? val : key;
  };

  const startDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (res.ok) router.push("/assessment");
    } catch (e) { console.error("startDemo", e); }
    finally { setDemoLoading(false); }
  };

  const { scrollYProgress: pageP } = useScroll();
  const pageScaleX = useSpring(pageP, { stiffness: 120, damping: 30 });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroRotateX = useTransform(heroP, [0, 1], [0, 24]);
  const heroY = useTransform(heroP, [0, 1], [0, -130]);
  const heroScale = useTransform(heroP, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroP, [0, 0.65], [1, 0]);
  const cueO = useTransform(heroP, [0.04, 0.25], [1, 0]);
  const heroScroll = useRef(0);
  useMotionValueEvent(heroP, "change", (v) => { heroScroll.current = v; });

  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sceneP } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });
  const sceneScale = useTransform(sceneP, [0, 1], [0.72, 1.08]);
  const sceneOpacity = useTransform(sceneP, [0, 0.06, 0.94, 1], [0.3, 1, 1, 0.3]);
  const sceneScroll = useRef(0);
  useMotionValueEvent(sceneP, "change", (v) => { sceneScroll.current = v; });
  const s1o = useTransform(sceneP, [0.0, 0.1, 0.25, 0.33], [0, 1, 1, 0]);
  const s2o = useTransform(sceneP, [0.34, 0.46, 0.6, 0.68], [0, 1, 1, 0]);
  const s3o = useTransform(sceneP, [0.69, 0.82, 1], [0, 1, 1]);
  const railScale = useTransform(sceneP, [0, 1], [0, 1]);

  const crisisRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: crisisP } = useScroll({ target: crisisRef, offset: ["start start", "end end"] });
  const crisisX = useTransform(crisisP, [0, 1], ["0%", "-62%"]);

  return (
    <div className="overflow-x-clip bg-[#07070f] text-slate-200 min-h-screen">
      <AnimatePresence>
        {!booted && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05050d] px-6"
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          >
            <div className="absolute inset-0" aria-hidden style={{ background: "radial-gradient(circle at 50% 42%, rgba(99,102,241,0.12), transparent 60%)" }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute w-[180px] h-[180px] blur-2xl rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)" }} />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center"
                style={{ boxShadow: "0 0 60px rgba(129,140,248,0.55)" }}
              >
                <Compass className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            <div className="mt-12 h-12 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bootStep}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="text-[11px] tracking-[0.5em] uppercase text-indigo-300/80">{BOOT_STEPS[bootStep].label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{BOOT_STEPS[bootStep].text}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.1, ease: "easeInOut" }}
              className="mt-8 w-40 h-[2px] rounded-full origin-left bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" style={{ scaleX: pageScaleX }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: "rgba(7,7,15,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Compass</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Globe className="w-3.5 h-3.5" />
              {locale === "en" ? "हिंदी" : "EN"}
            </button>
            <Link href="/manual" className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-colors">
              <Clapperboard className="w-3.5 h-3.5 text-indigo-400" /> The Film
            </Link>
            <button onClick={startDemo} disabled={demoLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-colors disabled:opacity-50">
              {demoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
              {getVal("landing.demo")}
            </button>
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-colors">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — scroll-reactive 3D */}
      <section ref={heroRef} data-tour="landing-hero" className="relative h-screen overflow-hidden pt-16">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animationDuration: "6s" }} />

        <motion.div style={{ rotateX: heroRotateX, y: heroY, scale: heroScale, opacity: heroOpacity, transformStyle: "preserve-3d", transformPerspective: 1200 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_74%)]">
            <CompassCanvas scrollRef={heroScroll} tumble={0.35} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6" style={{ transform: "translateZ(60px)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {getVal("landing.badge")}
          </motion.div>

          <h1 className="relative font-extrabold tracking-tight leading-[1.05] text-[15vw] sm:text-7xl lg:text-8xl xl:text-[7rem] text-white" style={{ transformStyle: "preserve-3d" }}>
            {["landing.heroTitle1", "landing.heroTitle2", "landing.heroTitle3"].map((k, i) => (
              <span key={k} className="block overflow-hidden py-[0.06em] -my-[0.06em]" style={{ transform: `translateZ(${30 + i * 34}px)` }}>
                <motion.span
                  initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${i === 0 ? "text-slate-400" : i === 1 ? "text-white" : "gradient-text"}`}>
                  {getVal(k)}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="relative text-lg text-slate-400 max-w-xl mx-auto mb-8 mt-6" style={{ transform: "translateZ(40px)" }}>
            {getVal("landing.heroSub")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="relative flex flex-col sm:flex-row gap-3 justify-center" style={{ transform: "translateZ(50px)" }}>
            <button onClick={startDemo} disabled={demoLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-semibold transition-all glow-sm disabled:opacity-50">
              {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {demoLoading ? (locale === "hi" ? "डेमो सेटअप हो रहा है..." : "Setting up demo...") : getVal("landing.ctaButton")}
            </button>
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all group">
              <UserPlus className="w-4 h-4" /> {locale === "hi" ? "खाता बनाएं" : "Create Account"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: cueO }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-slate-500">
          Scroll
          <motion.div animate={{ y: [0, 18, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-transparent via-indigo-400 to-transparent" />
        </motion.div>
      </section>

      {/* Cinematic pinned scene */}
      <div ref={sceneRef} className="relative h-[340vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[520px] h-[520px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)" }} />
          </div>

          <motion.div style={{ scale: sceneScale, opacity: sceneOpacity }} className="absolute w-[min(88vw,52rem)] h-[min(88vw,52rem)]">
            <CompassCanvas scrollRef={sceneScroll} tumble={1} />
          </motion.div>

          {STEPS.map((step, i) => {
            const o = [s1o, s2o, s3o][i];
            return (
              <motion.div key={step.no} style={{ opacity: o, y: o }}
                className="absolute left-6 sm:left-16 lg:left-28 top-1/2 -translate-y-1/2 max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-extrabold text-white/15">{step.no}</span>
                  <span className="text-[11px] tracking-[0.3em] text-indigo-300">{step.key}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  {locale === "hi" ? step.titleHi : step.titleEn}
                </h3>
                <p className="text-slate-400 leading-relaxed">{locale === "hi" ? step.descHi : step.descEn}</p>
              </motion.div>
            );
          })}

          <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 h-40 w-px bg-white/10 overflow-hidden">
            <motion.div className="w-full origin-top bg-gradient-to-b from-indigo-400 to-emerald-400" style={{ scaleY: railScale }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { labelKey: "landing.stat1Label", valueKey: "landing.stat1Value", color: "text-red-400" },
            { labelKey: "landing.stat2Label", valueKey: "landing.stat2Value", color: "text-amber-400" },
            { labelKey: "landing.stat3Label", valueKey: "landing.stat3Value", color: "text-purple-400" },
            { labelKey: "landing.stat4Label", valueKey: "landing.stat4Value", color: "text-indigo-400" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }}
              className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>{getVal(stat.valueKey)}</div>
              <div className="text-xs text-slate-500">{getVal(stat.labelKey)}</div>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                className="h-px mt-4 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horizontal cinematic crisis track */}
      <div ref={crisisRef} data-tour="landing-impact" className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-10">
          <div className="px-[8vw]">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-3">
              {getVal("landing.impactTitle")}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-slate-400 max-w-lg">
              {getVal("landing.impactSub")}
            </motion.p>
          </div>

          <motion.div style={{ x: crisisX }} className="flex gap-5 w-max pl-[8vw] items-stretch">
            <div className="shrink-0 w-[76vw] sm:w-[420px] p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500">The gap</span>
                </div>
                <h3 className="text-2xl font-bold text-white leading-snug">India&apos;s hiring crisis, by the numbers</h3>
              </div>
              <p className="text-sm text-slate-500 mt-6 leading-relaxed">Millions graduate every year with skills nobody maps to roles — and employers can&apos;t find who&apos;s actually ready.</p>
            </div>

            {CRISES.map((crisis, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="shrink-0 w-[76vw] sm:w-[420px] p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="text-5xl font-extrabold mb-3" style={{ color: crisis.color === "text-red-400" ? "#f87171" : crisis.color === "text-amber-400" ? "#fbbf24" : crisis.color === "text-purple-400" ? "#c084fc" : "#818cf8", textShadow: `0 0 30px ${crisis.glow}` }}>
                    {getVal(crisis.valueKey)}
                  </div>
                  <div className="font-semibold text-white text-sm mb-2">{getVal(crisis.titleKey)}</div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{getVal(crisis.descKey)}</p>
              </motion.div>
            ))}

            <div className="shrink-0 w-[76vw] sm:w-[420px] p-8 rounded-2xl bg-gradient-to-br from-indigo-600/25 to-purple-600/15 border border-indigo-500/25 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white leading-snug mb-3">One career OS to fix it</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Assess. Upskill. Land. Compass turns the whole pipeline into one guided, scroll-friendly journey.</p>
              </div>
              <Link href="/register" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200">
                Start free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <section data-tour="landing-features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{getVal("landing.whyTitle")}</h2>
            <p className="text-slate-400 max-w-lg mx-auto">{getVal("landing.whySub")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <TiltCard key={i} className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color }}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{getVal(f.titleKey)}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{getVal(f.descKey)}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-tour="landing-cta" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
            className="relative p-10 rounded-2xl border border-indigo-500/20 overflow-hidden" style={{ background: "rgba(99,102,241,0.05)", perspective: 900 }}>
            <div className="absolute -top-10 right-0 w-56 h-56 opacity-30">
              <Orrery />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-20" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-3">{getVal("landing.ctaTitle")}</h2>
              <p className="text-slate-400 mb-6">{getVal("landing.ctaSub")}</p>
              <button onClick={startDemo} disabled={demoLoading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-xl font-semibold transition-all glow-sm disabled:opacity-50">
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
          <div className="flex items-center gap-4">
            <Link href="/manual" className="hover:text-slate-400 transition-colors flex items-center gap-1"><Clapperboard className="w-3.5 h-3.5" /> The Film</Link>
            <span>{getVal("landing.footer")}</span>
          </div>
        </div>
      </footer>

      <PageTour id="landing" steps={[
        { target: "[data-tour='landing-hero']", title: "The problem is real", body: "India's hiring crisis in numbers — Compass was built to fix it." },
        { target: "[data-tour='landing-impact']", title: "Why it matters", body: "Millions of students struggle to match skills to careers. See the gap firsthand." },
        { target: "[data-tour='landing-features']", title: "How Compass helps", body: "AI assessments, internships, interviews, resume and outreach — one career OS." },
        { target: "[data-tour='landing-cta']", title: "Start free", body: "Launch the demo to experience the full platform instantly." },
      ]} />
    </div>
  );
}
