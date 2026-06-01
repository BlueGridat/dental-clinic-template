"use client";

import { createContext, useContext, useMemo } from "react";
import type { ClinicConfig } from "./types";
import { defaultEffects, defaultI18n, defaultMobile } from "./defaults";

type ConfigContextValue = {
  config: ClinicConfig;
  effects: ReturnType<typeof buildEffectsConfig>;
  mobile: ReturnType<typeof buildMobileConfig>;
  i18n: ReturnType<typeof buildI18nConfig>;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

function buildEffectsConfig(config: ClinicConfig) {
  return { ...defaultEffects, ...(config.effects ?? {}) };
}

function buildMobileConfig(config: ClinicConfig) {
  return { ...defaultMobile, ...(config.mobile ?? {}) };
}

function buildI18nConfig(config: ClinicConfig) {
  return {
    defaultLocale: config.i18n?.defaultLocale ?? defaultI18n.defaultLocale,
    locales: config.i18n?.locales ?? defaultI18n.locales,
    labels: { ...defaultI18n.labels, ...(config.i18n?.labels ?? {}) }
  };
}

export function ConfigProvider({ children, config }: { children: React.ReactNode; config: ClinicConfig }) {
  const value = useMemo(
    () => ({
      config,
      effects: buildEffectsConfig(config),
      mobile: buildMobileConfig(config),
      i18n: buildI18nConfig(config)
    }),
    [config]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useClinicConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useClinicConfig must be used inside ConfigProvider.");
  return context.config;
}

export function useEffectsConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useEffectsConfig must be used inside ConfigProvider.");
  return context.effects;
}

export function useMobileConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useMobileConfig must be used inside ConfigProvider.");
  return context.mobile;
}

export function useI18nConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useI18nConfig must be used inside ConfigProvider.");
  return context.i18n;
}
