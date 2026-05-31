import type { Metadata } from "next";
import "./globals.css";
import { clinicConfig, getGoogleFontUrl, getThemeCss } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(clinicConfig.meta?.siteUrl || "http://localhost:3000"),
  title: clinicConfig.meta?.siteTitle || clinicConfig.brand?.name || "Dental Clinic",
  description: clinicConfig.meta?.description || "",
  icons: clinicConfig.meta?.favicon ? [{ rel: "icon", url: clinicConfig.meta.favicon }] : undefined,
  openGraph: {
    title: clinicConfig.meta?.siteTitle || clinicConfig.brand?.name || "Dental Clinic",
    description: clinicConfig.meta?.description || "",
    images: clinicConfig.meta?.ogImage ? [{ url: clinicConfig.meta.ogImage }] : undefined,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: clinicConfig.meta?.siteTitle || clinicConfig.brand?.name || "Dental Clinic",
    description: clinicConfig.meta?.description || "",
    images: clinicConfig.meta?.ogImage ? [clinicConfig.meta.ogImage] : undefined
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={getGoogleFontUrl(clinicConfig)} />
        <style dangerouslySetInnerHTML={{ __html: getThemeCss(clinicConfig) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
