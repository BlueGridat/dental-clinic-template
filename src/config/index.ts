import rawConfig from "../../clinicConfig.json";
import type { ClinicConfig, EffectsConfig, Locale, MobileConfig } from "./types";

export const clinicConfig = rawConfig as ClinicConfig;

const fallbackColors: ClinicConfig["brand"]["colors"] = {
  primary: "#131C15",
  accent: "#A9EAF7",
  surface: "#F4F5F7",
  white: "#FFFFFF",
  text: "#131C15",
  textMuted: "#6B7280"
};

export const defaultEffects: Required<EffectsConfig> = {
  magneticButtons: true,
  cursorGlow: true,
  auroraBlobs: true,
  pointerParallax: true,
  spotlightCards: true,
  tiltImages: true,
  heroParallax: true,
  statCountUp: true,
  customCursor: false,
  reactiveNavbar: true
};

export const defaultMobile: Required<MobileConfig> = {
  stickyBookingBar: true,
  fullscreenMenu: true,
  showCallButton: true
};

export const defaultI18n = {
  defaultLocale: "de" as Locale,
  locales: ["de", "en"] as Locale[],
  labels: { de: "DE", en: "EN" } as Record<Locale, string>
};

export function getEffectsConfig(config: ClinicConfig = clinicConfig): Required<EffectsConfig> {
  return { ...defaultEffects, ...(config.effects ?? {}) };
}

export function getMobileConfig(config: ClinicConfig = clinicConfig): Required<MobileConfig> {
  return { ...defaultMobile, ...(config.mobile ?? {}) };
}

export function getI18nConfig(config: ClinicConfig = clinicConfig) {
  return {
    defaultLocale: config.i18n?.defaultLocale ?? defaultI18n.defaultLocale,
    locales: config.i18n?.locales ?? defaultI18n.locales,
    labels: { ...defaultI18n.labels, ...(config.i18n?.labels ?? {}) }
  };
}

export function getGoogleFontUrl(config: ClinicConfig = clinicConfig) {
  const fonts = [config.brand?.fonts?.heading || "Unbounded", config.brand?.fonts?.body || "Inter"];
  const families = Array.from(new Set(fonts)).map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&subset=latin-ext&display=swap`;
}

export function getThemeCss(config: ClinicConfig = clinicConfig) {
  const colors = { ...fallbackColors, ...(config.brand?.colors ?? {}) };
  const heading = config.brand?.fonts?.heading || "Unbounded";
  const body = config.brand?.fonts?.body || "Inter";

  return `:root {
    --color-primary: ${colors.primary};
    --brand-primary: ${colors.primary};
    --color-accent: ${colors.accent};
    --color-surface: ${colors.surface};
    --color-white: ${colors.white};
    --color-text: ${colors.text};
    --color-text-muted: ${colors.textMuted};
    --brand-border: color-mix(in srgb, ${colors.primary} 10%, transparent);
    --brand-input: color-mix(in srgb, ${colors.primary} 10%, transparent);
    --brand-ring: ${colors.accent};
    --font-heading: "${heading}", sans-serif;
    --font-body: "${body}", sans-serif;
  }`;
}

export type { ClinicConfig };
