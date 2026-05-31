"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ContactConfig, HeroConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { TodayClock } from "../TodayClock";

export function HeroMobile({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="md:hidden">
      <div className="relative min-h-[82svh] overflow-hidden bg-[var(--color-primary)]">
        <Image src={fallbackImage(hero?.image)} alt="" fill priority className="object-cover opacity-85" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/70" />
        <div className="relative flex min-h-[82svh] flex-col justify-end px-5 pb-7 pt-24 text-[var(--color-white)]">
          <h1 className="font-heading text-4xl font-bold leading-[1.02]">{hero?.heading || "Dental care for confident smiles"}</h1>
          <p className="mt-4 text-base font-medium leading-7 text-white/85">{hero?.subtitle || ""}</p>
          <div className="mt-6 grid gap-3">
            <a href={hero?.cta?.href || "#book"} className="focus-ring min-h-14 rounded-full bg-[var(--color-accent)] px-5 py-4 text-center font-bold text-[var(--color-primary)] active:scale-[0.98]">
              {hero?.cta?.label || "Book"}
            </a>
            <button type="button" onClick={() => setOpen((value) => !value)} className="focus-ring flex min-h-12 items-center justify-between rounded-full bg-white/15 px-4 text-sm font-bold backdrop-blur active:scale-[0.98]" aria-expanded={open}>
              <TodayClock />
              <ChevronDown className={`size-5 transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open ? (
              <div className="rounded-3xl bg-white/15 p-4 text-sm backdrop-blur">
                {safeArray(contact?.workingHours).map((item) => (
                  <div key={`${item.days}-mobile`} className="flex justify-between gap-4 py-2">
                    <span>{item.days}</span>
                    <strong>{item.hours}</strong>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
