"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContactConfig, LinkItem, MobileConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";

export function MobileBookingBar({ cta, contact, mobile }: { cta: LinkItem; contact: ContactConfig; mobile?: MobileConfig }) {
  const [visible, setVisible] = useState(false);
  const enabled = mobile?.stickyBookingBar ?? true;
  const showCall = mobile?.showCallButton ?? true;
  const tr = useT();

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] transition md:hidden ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}>
      <div className="mx-auto flex max-w-md gap-2 rounded-full bg-[var(--color-white)] p-2 shadow-2xl shadow-black/20">
        <a href={cta?.href || "#book"} className="focus-ring min-h-12 flex-1 rounded-full bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-bold text-[var(--color-white)] active:scale-[0.98]">
          {tr(cta?.label) || tr({ de: "Beratung anfragen", en: "Request consultation" })}
        </a>
        {showCall ? (
          <a href={`tel:${contact?.phone || ""}`} className="focus-ring grid size-12 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] active:scale-[0.98]" aria-label={tr({ de: "Praxis anrufen", en: "Call clinic" })}>
            <Phone className="size-5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
