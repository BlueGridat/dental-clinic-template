import { getClinicConfig } from "@/config";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 60;

export default async function ImpressumPage() {
  const config = await getClinicConfig();
  return <LegalPage title={config.legal?.impressumTitle} body={config.legal?.impressumBody} />;
}
