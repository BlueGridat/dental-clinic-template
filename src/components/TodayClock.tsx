"use client";

import { useEffect, useState } from "react";
import { useLocale, useT } from "@/i18n/LocaleProvider";

export function TodayClock() {
  const [now, setNow] = useState<Date | null>(null);
  const { locale } = useLocale();
  const tr = useT();

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const label = now
    ? `${tr({ de: "Heute", en: "Today" })} ${now.toLocaleDateString(locale === "de" ? "de-AT" : "en-US", { weekday: "long" })}, ${now.toLocaleTimeString(locale === "de" ? "de-AT" : "en-US", { hour: "2-digit", minute: "2-digit" })}`
    : tr({ de: "Heute", en: "Today" });

  return <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-[var(--color-primary)]">{label}</span>;
}
