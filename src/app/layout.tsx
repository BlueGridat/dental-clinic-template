import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "@/config/ConfigProvider";
import { getClinicConfig, getGoogleFontUrl, getI18nConfig, getThemeCss } from "@/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { t } from "@/i18n/translate";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getClinicConfig();
  const i18n = getI18nConfig(config);
  const metaTitle = t(config.meta?.siteTitle, i18n.defaultLocale);
  const metaDescription = t(config.meta?.description, i18n.defaultLocale);

  return {
    metadataBase: new URL(config.meta?.siteUrl || "http://localhost:3000"),
    title: metaTitle || config.brand?.name || "Dental Clinic",
    description: metaDescription || "",
    alternates: {
      languages: {
        de: "/",
        en: "/",
        "x-default": "/"
      }
    },
    icons: config.meta?.favicon ? [{ rel: "icon", url: config.meta.favicon }] : undefined,
    openGraph: {
      title: metaTitle || config.brand?.name || "Dental Clinic",
      description: metaDescription || "",
      images: config.meta?.ogImage ? [{ url: config.meta.ogImage }] : undefined,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle || config.brand?.name || "Dental Clinic",
      description: metaDescription || "",
      images: config.meta?.ogImage ? [config.meta.ogImage] : undefined
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = await getClinicConfig();
  const i18n = getI18nConfig(config);

  return (
    <html lang={i18n.defaultLocale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={getGoogleFontUrl(config)} />
        <style dangerouslySetInnerHTML={{ __html: getThemeCss(config) }} />
      </head>
      <body>
        <ConfigProvider config={config}>
          <LocaleProvider>{children}</LocaleProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
