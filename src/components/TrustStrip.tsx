"use client";

import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { ContactConfig, TrustConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";

export function TrustStrip({ trust, contact }: { trust?: TrustConfig; contact: ContactConfig }) {
  const tr = useT();
  const credentials = safeArray(trust?.credentials);

  return (
    <section className="container-page pb-8">
      <div className="grid gap-3 rounded-[1.6rem] bg-[var(--color-white)] p-3 shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-center md:px-5">
        <div className="flex items-center gap-3 rounded-[1.1rem] bg-[var(--color-surface)] px-4 py-3">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
            <Star className="size-5 fill-current" />
          </span>
          <div>
            <p className="text-sm font-bold">{trust?.ratingValue || "4.8/5"} · {tr(trust?.ratingLabel) || "Google rating"}</p>
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">{tr(trust?.reviewCount)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
          <span className="rounded-full bg-[var(--color-accent)] px-3 py-2">{tr(trust?.openNowLabel) || "Open today"}</span>
          <span className="rounded-full bg-[var(--color-surface)] px-3 py-2">{tr(trust?.sinceLabel)}</span>
          {credentials.slice(0, 2).map((item) => (
            <span key={tr(item)} className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-3 py-2">
              <ShieldCheck className="size-3.5" /> {tr(item)}
            </span>
          ))}
        </div>
        <a href={trust?.directionsCta?.href || "#contacts"} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-white)] transition active:scale-[0.98]">
          <MapPin className="size-4" />
          {tr(trust?.directionsCta?.label) || contact.address}
        </a>
      </div>
    </section>
  );
}
