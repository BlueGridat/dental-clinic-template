import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { draftMode } from "next/headers";
import rawConfig from "../../clinicConfig.json";
import type { ClinicConfig, EffectsConfig, MobileConfig } from "./types";

import { defaultEffects, defaultI18n, defaultMobile } from "./defaults";

import { resolveClinicConfig } from "./resolve";

const apiVersion = "2024-01-01";
// Project ID / dataset are public identifiers, so they are safe code defaults.
// Env vars can override them (e.g. for another project) but are not required on Vercel.
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvyxwo8y";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
/**
 * Optional slug rendered on "/". Unset by default: the root must never show a real practice
 * without its consent, so "/" renders the neutral sample from clinicConfig.json.
 */
export const ROOT_CLINIC_SLUG = process.env.NEXT_PUBLIC_ROOT_CLINIC_SLUG?.trim() || "";
export const REVALIDATE_SECONDS = 60;

const fallbackConfig = rawConfig as unknown as ClinicConfig;

// Public dataset: reads need no token. useCdn=false so new clinics show up within the ISR window.
const client = createClient({ projectId: sanityProjectId, dataset: sanityDataset, apiVersion, useCdn: false });

const imageBuilder = createImageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset });

const clinicConfigQuery = `*[_type == "clinicConfig" && _id == "clinicConfig"][0]`;
const clinicBySlugQuery = `*[_type == "clinic" && slug.current == $clinicSlug][0]`;

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

function isDynamicServerError(error: unknown) {
  return Boolean(error && typeof error === "object" && "digest" in error && (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE");
}

async function sanityFetch<T>(query: string, params: Record<string, string> = {}, tags: string[] = []): Promise<T | null> {
  let draft = false;
  try {
    draft = (await draftMode()).isEnabled;
  } catch {
    draft = false;
  }
  const useDrafts = draft && Boolean(process.env.SANITY_API_TOKEN);
  const fetchClient = useDrafts
    ? client.withConfig({ token: process.env.SANITY_API_TOKEN, perspective: "drafts", useCdn: false })
    : client;
  return fetchClient.fetch<T>(query, params, useDrafts ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS, tags } });
}

/** Fetch one clinic document by slug and resolve it into a full config. null = not found. */
export async function getClinicBySlug(clinicSlug: string): Promise<ClinicConfig | null> {
  if (!/^[a-z0-9][a-z0-9-]{0,95}$/.test(clinicSlug)) return null;
  try {
    const doc = await sanityFetch<unknown>(clinicBySlugQuery, { clinicSlug }, ["clinic", `clinic:${clinicSlug}`]);
    if (!doc) return null;
    return resolveClinicConfig(fallbackConfig, normalizeSanityValue(doc) as Partial<ClinicConfig>, { basePath: `/${clinicSlug}`, isClinicDemo: true });
  } catch (error) {
    if (isDynamicServerError(error)) throw error;
    console.warn(`Could not fetch clinic "${clinicSlug}" from Sanity.`, error);
    return null;
  }
}

/**
 * Config for "/" (and the root legal pages): the ROOT_CLINIC_SLUG clinic only if that env var is set and the doc exists,
 * else the legacy clinicConfig singleton, else the placeholder-free clinicConfig.json.
 */
export async function getClinicConfig(): Promise<ClinicConfig> {
  try {
    const rootDoc = ROOT_CLINIC_SLUG
      ? await sanityFetch<unknown>(clinicBySlugQuery, { clinicSlug: ROOT_CLINIC_SLUG }, ["clinic", `clinic:${ROOT_CLINIC_SLUG}`])
      : null;
    if (rootDoc) return resolveClinicConfig(fallbackConfig, normalizeSanityValue(rootDoc) as Partial<ClinicConfig>, { basePath: "", isClinicDemo: true });
    const singleton = await sanityFetch<unknown>(clinicConfigQuery, {}, ["clinicConfig"]);
    if (singleton) return resolveClinicConfig(fallbackConfig, normalizeSanityValue(singleton) as Partial<ClinicConfig>, { basePath: "", isClinicDemo: false });
  } catch (error) {
    if (isDynamicServerError(error)) throw error;
    console.warn("Falling back to clinicConfig.json because Sanity config could not be fetched.", error);
  }
  return resolveClinicConfig(fallbackConfig, null, { basePath: "", isClinicDemo: false });
}

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
export { resolveClinicConfig } from "./resolve";
