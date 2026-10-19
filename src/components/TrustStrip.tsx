"use client";

import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { ContactConfig, TrustConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";

export function TrustStrip({ trust, contact, kassenList = [] }: { trust?: TrustConfig; contact: ContactConfig; kassenList?: string[] }) {
  const tr = useT();
  const credentials = safeArray(trust?.credentials);
  const hasRating = Boolean(trust?.ratingValue);
  const hasHours = safeArray(contact?.workingHours).length > 0;
  const directionsHref = trust?.directionsCta?.href;
  const chips = [
    hasHours && trust?.openNowLabel ? { key: "open", label: tr(trust.openNowLabel), accent: true } : null,
    trust?.sinceLabel ? { key: "since", label: tr(trust.sinceLabel), accent: false } : null
  ].filter(Boolean) as { key: string; label: string; accent: boolean }[];

  if (!hasRating && !chips.length && !credentials.length && !kassenList.length && !directionsHref) return null;

  return (
    <section className="container-page pb-8">
      <div className="grid gap-3 rounded-[1.6rem] bg-[var(--color-white)] p-3 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center md:px-5">
        {hasRating ? (
          <div className="flex items-center gap-3 rounded-[1.1rem] bg-[var(--color-surface)] px-4 py-3">
            <span className="grid size-10 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
              <Star className="size-5 fill-current" />
            </span>
            <div>
              <p className="text-sm font-bold">
                {trust?.ratingValue}
                {trust?.ratingLabel ? ` · ${tr(trust.ratingLabel)}` : ""}
              </p>
              {trust?.reviewCount ? <p className="text-xs font-semibold text-[var(--color-text-muted)]">{tr(trust.reviewCount)}</p> : null}
            </div>
          </div>
        ) : (
          <span className="hidden md:block" />
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
          {chips.map((chip) => (
            <span key={chip.key} className={`rounded-full px-3 py-2 ${chip.accent ? "bg-[var(--color-accent)]" : "bg-[var(--color-surface)]"}`}>
              {chip.label}
            </span>
          ))}
          {kassenList.length ? (
            <span className="rounded-full bg-[var(--color-accent)] px-3 py-2" data-testid="kassen-chip">
              {tr({ de: "Kassen", en: "Insurers" })}: {kassenList.join(" · ")}
            </span>
          ) : null}
          {credentials.slice(0, 2).map((item) => (
            <span key={tr(item)} className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-3 py-2">
              <ShieldCheck className="size-3.5" /> {tr(item)}
            </span>
          ))}
        </div>
        {directionsHref ? (
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-white)] transition active:scale-[0.98]">
            <MapPin className="size-4" />
            {tr(trust?.directionsCta?.label) || contact.address}
          </a>
        ) : null}
      </div>
    </section>
  );
}
