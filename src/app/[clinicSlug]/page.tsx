import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClinicBySlug } from "@/config";
import { ClinicPage } from "@/components/ClinicPage";
import { t } from "@/i18n/translate";

// ISR: clinics added in Sanity appear without a rebuild; pages refresh at most every 60 s.
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ clinicSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clinicSlug } = await params;
  const config = await getClinicBySlug(clinicSlug);
  if (!config) return { title: "Nicht gefunden", robots: { index: false, follow: false } };
  const doctor = config.doctorNameWithTitle || config.brand.name;
  const city = config.city;
  const title = `Ordination ${doctor}${city ? ` | Zahnarzt in ${city}` : ""}`;
  const description = t(config.meta?.description, "de");
  return {
    title,
    description,
    // Per-clinic demos are private previews.
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    alternates: { canonical: `/${clinicSlug}` },
    openGraph: {
      title,
      description,
      url: `/${clinicSlug}`,
      siteName: config.brand.name,
      locale: "de_AT",
      type: "website",
      images: config.meta?.ogImage ? [{ url: config.meta.ogImage }] : undefined
    },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function ClinicSlugPage({ params }: Props) {
  const { clinicSlug } = await params;
  const config = await getClinicBySlug(clinicSlug);
  if (!config) notFound();
  return <ClinicPage config={config} scopedTheme />;
}
