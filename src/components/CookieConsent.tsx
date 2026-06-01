"use client";

import { useEffect, useState } from "react";
import type { CookieConsentConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";

export function CookieConsent({ config }: { config?: CookieConsentConfig }) {
  const [visible, setVisible] = useState(false);
  const tr = useT();

  useEffect(() => {
    if (config?.enabled === false) return;
    setVisible(window.localStorage.getItem("clinic-cookie-consent") !== "set");
  }, [config?.enabled]);

  function close() {
    window.localStorage.setItem("clinic-cookie-consent", "set");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[80] mx-auto max-w-2xl rounded-[1.4rem] bg-[var(--color-white)] p-3 shadow-2xl shadow-black/20 md:p-4" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <p className="px-2 text-sm font-semibold leading-6 text-[var(--color-text)]">{tr(config?.message) || "We use necessary cookies to keep this website reliable."}</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={close} className="focus-ring min-h-11 rounded-full bg-[var(--color-surface)] px-4 text-sm font-bold text-[var(--color-primary)]">
            {tr(config?.declineLabel) || "Close"}
          </button>
          <button type="button" onClick={close} className="focus-ring min-h-11 rounded-full bg-[var(--color-primary)] px-4 text-sm font-bold text-[var(--color-white)]">
            {tr(config?.acceptLabel) || "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
