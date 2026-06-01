import { getClinicConfig } from "@/config";
import { LegalPage } from "@/components/LegalPage";

export default async function DatenschutzPage() {
  const config = await getClinicConfig();
  return <LegalPage title={config.legal?.privacyTitle} body={config.legal?.privacyBody} />;
}
