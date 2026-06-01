import type { Locale, Localized } from "@/config/types";

export function t(value: Localized | undefined | null, locale: Locale, defaultLocale: Locale = "de"): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value[defaultLocale] ?? Object.values(value).find(Boolean) ?? "";
}
