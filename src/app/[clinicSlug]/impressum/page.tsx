import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClinicBySlug, getThemeCss } from "@/config";
import { ConfigProvider } from "@/config/ConfigProvider";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ clinicSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clinicSlug } = await params;
  const config = await getClinicBySlug(clinicSlug);
  return { title: config ? `Impressum | ${config.brand.name}` : "Nicht gefunden", robots: { index: false, follow: false } };
}

export default async function ClinicLegalPage({ params }: Props) {
  const { clinicSlug } = await params;
  const config = await getClinicBySlug(clinicSlug);
  if (!config) notFound();
  return (
    <ConfigProvider config={config}>
      <style dangerouslySetInnerHTML={{ __html: getThemeCss(config) }} />
      <LegalPage title={config.legal?.impressumTitle} body={config.legal?.impressumBody} homeHref={`/${clinicSlug}`} />
    </ConfigProvider>
  );
}
