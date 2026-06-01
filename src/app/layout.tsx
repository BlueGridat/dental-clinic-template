import type { Metadata } from "next";
import "./globals.css";
import { clinicConfig, getGoogleFontUrl, getI18nConfig, getThemeCss } from "@/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { t } from "@/i18n/translate";

const i18n = getI18nConfig(clinicConfig);
const metaTitle = t(clinicConfig.meta?.siteTitle, i18n.defaultLocale);
const metaDescription = t(clinicConfig.meta?.description, i18n.defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(clinicConfig.meta?.siteUrl || "http://localhost:3000"),
  title: metaTitle || clinicConfig.brand?.name || "Dental Clinic",
  description: metaDescription || "",
  alternates: {
    languages: {
      de: "/",
      en: "/",
      "x-default": "/"
    }
  },
  icons: clinicConfig.meta?.favicon ? [{ rel: "icon", url: clinicConfig.meta.favicon }] : undefined,
  openGraph: {
    title: metaTitle || clinicConfig.brand?.name || "Dental Clinic",
    description: metaDescription || "",
    images: clinicConfig.meta?.ogImage ? [{ url: clinicConfig.meta.ogImage }] : undefined,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle || clinicConfig.brand?.name || "Dental Clinic",
    description: metaDescription || "",
    images: clinicConfig.meta?.ogImage ? [clinicConfig.meta.ogImage] : undefined
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={i18n.defaultLocale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={getGoogleFontUrl(clinicConfig)} />
        <style dangerouslySetInnerHTML={{ __html: getThemeCss(clinicConfig) }} />
      </head>
      <body><LocaleProvider>{children}</LocaleProvider></body>
    </html>
  );
}
