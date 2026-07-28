"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all"
      title={locale === "en" ? "हिंदी में बदलें" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "en" ? "हिंदी" : "EN"}
    </button>
  );
}
