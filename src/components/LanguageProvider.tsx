"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLocale, setLocale, Locale, useTranslations } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof useTranslations>;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: useTranslations("en"),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getLocale());
    setMounted(true);
  }, []);

  const handleSetLocale = (l: Locale) => {
    setLocaleState(l);
    setLocale(l);
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: "en", setLocale: handleSetLocale, t: useTranslations("en") }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t: useTranslations(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
