import type { EffectsConfig, Locale, MobileConfig } from "./types";

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
