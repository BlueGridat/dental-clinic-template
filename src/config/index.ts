import rawConfig from "../../clinicConfig.json";
import type { ClinicConfig, EffectsConfig, MobileConfig } from "./types";

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

export function getEffectsConfig(config: ClinicConfig = clinicConfig): Required<EffectsConfig> {
  return { ...defaultEffects, ...(config.effects ?? {}) };
}

export function getMobileConfig(config: ClinicConfig = clinicConfig): Required<MobileConfig> {
  return { ...defaultMobile, ...(config.mobile ?? {}) };
}

export function getGoogleFontUrl(config: ClinicConfig = clinicConfig) {
  const fonts = [config.brand?.fonts?.heading || "Unbounded", config.brand?.fonts?.body || "Inter"];
  const families = Array.from(new Set(fonts)).map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export function getThemeCss(config: ClinicConfig = clinicConfig) {
  const colors = { ...fallbackColors, ...(config.brand?.colors ?? {}) };
  const heading = config.brand?.fonts?.heading || "Unbounded";
  const body = config.brand?.fonts?.body || "Inter";

  return `:root {
    --color-primary: ${colors.primary};
    --color-accent: ${colors.accent};
    --color-surface: ${colors.surface};
    --color-white: ${colors.white};
    --color-text: ${colors.text};
    --color-text-muted: ${colors.textMuted};
    --font-heading: "${heading}", sans-serif;
    --font-body: "${body}", sans-serif;
  }`;
}

export type { ClinicConfig };
