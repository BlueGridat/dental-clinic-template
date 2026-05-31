import rawConfig from "../../clinicConfig.json";
import type { CSSProperties } from "react";
import type { ClinicConfig } from "./types";

export const clinicConfig = rawConfig as ClinicConfig;

const fallbackColors: ClinicConfig["brand"]["colors"] = {
  primary: "#131C15",
  accent: "#A9EAF7",
  surface: "#F4F5F7",
  white: "#FFFFFF",
  text: "#131C15",
  textMuted: "#6B7280"
};

export function getThemeStyle(config: ClinicConfig = clinicConfig): CSSProperties {
  const colors = { ...fallbackColors, ...(config.brand?.colors ?? {}) };
  const heading = config.brand?.fonts?.heading || "Unbounded";
  const body = config.brand?.fonts?.body || "Inter";

  return {
    "--color-primary": colors.primary,
    "--color-accent": colors.accent,
    "--color-surface": colors.surface,
    "--color-white": colors.white,
    "--color-text": colors.text,
    "--color-text-muted": colors.textMuted,
    "--font-heading": `"${heading}", sans-serif`,
    "--font-body": `"${body}", sans-serif`
  } as CSSProperties;
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
