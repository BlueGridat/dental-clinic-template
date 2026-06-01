"use client";

import dynamic from "next/dynamic";
import type { ClinicConfig } from "@/config/types";
import { CookieConsent } from "./CookieConsent";
import { MobileBookingBar } from "./mobile/MobileBookingBar";

const CursorFollower = dynamic(() => import("@/components/motion/CursorFollower").then((mod) => mod.CursorFollower), {
  ssr: false
});

export function ClientEffects({ config }: { config: ClinicConfig }) {
  return (
    <>
      <MobileBookingBar cta={config.nav.cta} contact={config.contact} mobile={config.mobile} />
      <CookieConsent config={config.cookieConsent} />
      <CursorFollower />
    </>
  );
}
