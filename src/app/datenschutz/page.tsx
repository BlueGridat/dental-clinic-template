import { clinicConfig } from "@/config";
import { LegalPage } from "@/components/LegalPage";

export default function DatenschutzPage() {
  return <LegalPage title={clinicConfig.legal?.privacyTitle} body={clinicConfig.legal?.privacyBody} />;
}
