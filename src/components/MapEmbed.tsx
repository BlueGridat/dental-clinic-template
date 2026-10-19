"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { mapsEmbedUrl, mapsSearchUrl } from "@/config/resolve";
import { useT } from "@/i18n/LocaleProvider";

/** Click-to-load Google Maps embed (no third-party request until the visitor opts in). */
export function MapEmbed({ query, address }: { query: string; address?: string }) {
  const [loaded, setLoaded] = useState(false);
  const tr = useT();
  return (
    <section id="map" className="container-page pb-12">
      <div className="overflow-hidden rounded-[2rem] bg-[var(--color-white)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 md:p-8">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">{tr({ de: "Anfahrt", en: "Directions" })}</h2>
            {address ? <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">{address}</p> : null}
          </div>
          <a href={mapsSearchUrl(query)} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-white)]">
            <MapPin className="size-4" /> {tr({ de: "In Google Maps öffnen", en: "Open in Google Maps" })}
          </a>
        </div>
        <div className="relative aspect-[16/9] w-full bg-[var(--color-surface)] md:aspect-[21/8]">
          {loaded ? (
            <iframe title={tr({ de: "Karte", en: "Map" })} src={mapsEmbedUrl(query)} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <button type="button" onClick={() => setLoaded(true)} className="focus-ring absolute inset-0 grid place-items-center p-6 text-center text-sm font-bold text-[var(--color-primary)]">
              <span className="max-w-md">
                {tr({ de: "Karte laden – dabei werden Daten an Google übertragen.", en: "Load map – this sends data to Google." })}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
