"use client";

import { useEffect, useState } from "react";

export function TodayClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const label = now
    ? `Today ${now.toLocaleDateString(undefined, { weekday: "long" })}, ${now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
    : "Today";

  return <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-[var(--color-primary)]">{label}</span>;
}
