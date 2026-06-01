import { clinicConfig } from "@/config";
import { LegalPage } from "@/components/LegalPage";

export default function ImpressumPage() {
  return <LegalPage title={clinicConfig.legal?.impressumTitle} body={clinicConfig.legal?.impressumBody} />;
}
