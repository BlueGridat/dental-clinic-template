import { getClinicConfig, REVALIDATE_SECONDS } from "@/config";
import { ClinicPage } from "@/components/ClinicPage";

export const revalidate = 60; // keep in sync with REVALIDATE_SECONDS

export default async function Home() {
  void REVALIDATE_SECONDS;
  const config = await getClinicConfig();
  return <ClinicPage config={config} />;
}
