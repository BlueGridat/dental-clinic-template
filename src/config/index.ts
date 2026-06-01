import { cache } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import rawConfig from "../../clinicConfig.json";
import type { ClinicConfig, EffectsConfig, MobileConfig } from "./types";
import { defaultEffects, defaultI18n, defaultMobile } from "./defaults";

const apiVersion = "2024-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const fallbackConfig = rawConfig as ClinicConfig;

const client =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false
      })
    : null;

const imageBuilder =
  client && projectId && dataset
    ? imageUrlBuilder({
        projectId,
        dataset
      })
    : null;

const clinicConfigQuery = `*[_type == "clinicConfig" && _id == "clinicConfig"][0]`;

const fallbackColors: ClinicConfig["brand"]["colors"] = {
  primary: "#131C15",
  accent: "#A9EAF7",
  surface: "#F4F5F7",
  white: "#FFFFFF",
  text: "#131C15",
  textMuted: "#6B7280"
};

type SanityObject = Record<string, unknown>;

function isSanityImage(value: unknown): value is { asset: unknown } {
  return Boolean(value && typeof value === "object" && "asset" in value && (value as SanityObject)._type === "image");
}

function imageUrlFor(source: { asset: unknown }): string {
  if (!imageBuilder) return "";
  return imageBuilder.image(source).url();
}

function normalizeSanityValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSanityValue(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (isSanityImage(value)) {
    return imageUrlFor(value);
  }

  const normalized: SanityObject = {};
  for (const [key, childValue] of Object.entries(value)) {
    if (key === "_id" || key === "_type" || key === "_createdAt" || key === "_updatedAt" || key === "_rev" || key === "_key") {
      continue;
    }
    normalized[key] = normalizeSanityValue(childValue);
  }
  return normalized;
}

export const getClinicConfig = cache(async (): Promise<ClinicConfig> => {
  if (!client) return fallbackConfig;

  try {
    const sanityConfig = await client.fetch<unknown>(clinicConfigQuery, {}, { cache: "no-store" });
    if (!sanityConfig) return fallbackConfig;
    return normalizeSanityValue(sanityConfig) as ClinicConfig;
  } catch (error) {
    console.warn("Falling back to clinicConfig.json because Sanity config could not be fetched.", error);
    return fallbackConfig;
  }
});

export function getEffectsConfig(config: ClinicConfig): Required<EffectsConfig> {
  return { ...defaultEffects, ...(config.effects ?? {}) };
}

export function getMobileConfig(config: ClinicConfig): Required<MobileConfig> {
  return { ...defaultMobile, ...(config.mobile ?? {}) };
}

export function getI18nConfig(config: ClinicConfig) {
  return {
    defaultLocale: config.i18n?.defaultLocale ?? defaultI18n.defaultLocale,
    locales: config.i18n?.locales ?? defaultI18n.locales,
    labels: { ...defaultI18n.labels, ...(config.i18n?.labels ?? {}) }
  };
}

export function getGoogleFontUrl(config: ClinicConfig) {
  const fonts = [config.brand?.fonts?.heading || "Unbounded", config.brand?.fonts?.body || "Inter"];
  const families = Array.from(new Set(fonts)).map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&subset=latin-ext&display=swap`;
}

export function getThemeCss(config: ClinicConfig) {
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
