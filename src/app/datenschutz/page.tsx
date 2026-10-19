import { getClinicConfig } from "@/config";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 60;

export default async function DatenschutzPage() {
  const config = await getClinicConfig();
  return <LegalPage title={config.legal?.privacyTitle} body={config.legal?.privacyBody} />;
}
