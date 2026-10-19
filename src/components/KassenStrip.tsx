"use client";

import { ShieldCheck } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

/** Kassenverträge (ÖGK, BVAEB, SVS, KFA …). Hidden when the list is empty/unknown. */
export function KassenStrip({ kassenList }: { kassenList: string[] }) {
  const tr = useT();
  if (!kassenList?.length) return null;
  return (
    <section id="kassen" className="container-page pb-12">
      <div className="rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm md:p-8">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">{tr({ de: "Kassen & Versicherungen", en: "Health insurers" })}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{tr({ de: "Wir rechnen direkt ab mit:", en: "We bill directly with:" })}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {kassenList.map((kasse) => (
            <li key={kasse} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
              <ShieldCheck className="size-4" /> {kasse}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
