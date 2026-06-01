"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/config/types";
import { useI18nConfig } from "@/config/ConfigProvider";
import { useReducedMotionSafe } from "@/lib/motion";
import { cx } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleProvider";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const i18n = useI18nConfig();
  const reduced = useReducedMotionSafe();

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = i18n.locales.indexOf(locale);
    const next = event.key === "ArrowRight" ? index + 1 : index - 1;
    setLocale(i18n.locales[(next + i18n.locales.length) % i18n.locales.length]);
  }

  return (
    <div
      role="group"
      aria-label="Language"
      onKeyDown={onKeyDown}
      className={cx("inline-flex h-9 items-center gap-1 rounded-full bg-[var(--color-surface)] p-1", className)}
    >
      {i18n.locales.map((item: Locale) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(item)}
            className={cx("focus-ring relative grid h-7 min-w-10 place-items-center rounded-full px-3 text-xs font-bold transition", active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")}
          >
            {active ? (
              <motion.span
                layoutId={reduced ? undefined : "lang-pill"}
                className="absolute inset-0 rounded-full bg-[var(--color-white)] shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative">{i18n.labels[item]}</span>
          </button>
        );
      })}
    </div>
  );
}
