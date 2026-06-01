"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, Localized } from "@/config/types";
import { useI18nConfig } from "@/config/ConfigProvider";
import { t } from "./translate";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const i18n = useI18nConfig();
  const [locale, setLocaleState] = useState<Locale>(i18n.defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem("clinic-locale") as Locale | null;
    if (stored && i18n.locales.includes(stored)) setLocaleState(stored);
  }, [i18n.locales]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("clinic-locale", locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (nextLocale: Locale) => {
        if (i18n.locales.includes(nextLocale)) setLocaleState(nextLocale);
      }
    }),
    [i18n.locales, locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) return { locale: "de" as Locale, setLocale: () => undefined };
  return context;
}

export function useT() {
  const { locale } = useLocale();
  const i18n = useI18nConfig();
  return (value: Localized | undefined | null) => t(value, locale, i18n.defaultLocale);
}
