"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { ClinicConfig } from "@/config/types";
import { CookieConsent } from "./CookieConsent";
import { MobileBookingBar } from "./mobile/MobileBookingBar";

const CursorFollower = dynamic(() => import("@/components/motion/CursorFollower").then((mod) => mod.CursorFollower), {
  ssr: false
});

function HashScrollRestorer() {
  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 250);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 900);
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}

export function ClientEffects({ config }: { config: ClinicConfig }) {
  return (
    <>
      <HashScrollRestorer />
      <MobileBookingBar cta={config.nav.cta} contact={config.contact} mobile={config.mobile} />
      <CookieConsent config={config.cookieConsent} />
      <CursorFollower />
    </>
  );
}
