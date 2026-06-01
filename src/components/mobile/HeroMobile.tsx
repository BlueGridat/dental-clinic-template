"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ContactConfig, HeroConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { TodayClock } from "../TodayClock";
import { Reveal } from "../motion/Reveal";

export function HeroMobile({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  const [open, setOpen] = useState(false);
  const tr = useT();

  return (
    <section className="px-4 pb-5 pt-20 md:hidden">
      <div className="rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm">
        <Reveal variant="fade-up">
          <p className="font-heading text-[clamp(2.35rem,11vw,3.55rem)] font-bold leading-[1.02] text-[var(--color-text)]" role="presentation" aria-hidden="true">
            {tr(hero?.heading) || "Dental care for confident smiles"}
          </p>
          <p className="mt-4 text-base font-medium leading-7 text-[var(--color-text)]">{tr(hero?.subtitle)}</p>
        </Reveal>

        <Reveal variant="scale-in" delay={0.1} className="relative mt-5 aspect-[1.42] overflow-hidden rounded-[1.5rem] bg-[var(--color-accent)]">
          <Image src={fallbackImage(hero?.image)} alt={tr(hero?.heading) || "Dental clinic hero image"} fill priority className="object-cover" sizes="100vw" />
        </Reveal>

        <Reveal variant="fade-up" delay={0.18} className="mt-4 grid grid-cols-[1fr_0.92fr] gap-3">
          <article className="rounded-[1.35rem] bg-[var(--color-surface)] p-4">
            <h2 className="text-lg font-bold">{tr({ de: "Öffnungszeiten", en: "Working Hours" })}</h2>
            <dl className="mt-3 grid gap-2 text-sm leading-5">
              {safeArray(contact?.workingHours).map((item) => (
                <div key={`${tr(item.days)}-compact`} className="grid gap-0.5">
                  <dt>{tr(item.days)}</dt>
                  <dd className="font-semibold">{item.hours}</dd>
                </div>
              ))}
            </dl>
          </article>

          <a href={hero?.cta?.href || "#book"} className="focus-ring flex flex-col items-center justify-center rounded-[1.35rem] bg-[var(--color-accent)] p-4 text-center font-bold text-[var(--color-primary)] active:scale-[0.98]">
            <span className="mb-4 grid size-14 place-items-center rounded-full bg-[var(--color-white)]">
              <ArrowUpRight className="size-5" />
            </span>
            {tr(hero?.cta?.label) || "Book"}
          </a>
        </Reveal>

        <div className="mt-3">
          <button type="button" onClick={() => setOpen((value) => !value)} className="focus-ring flex min-h-12 w-full items-center justify-between rounded-full border border-black/10 bg-[var(--color-white)] px-5 text-sm font-bold text-[var(--color-text-muted)] active:scale-[0.98]" aria-expanded={open}>
            <TodayClock />
            <ChevronDown className={`size-5 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open ? (
            <div className="mt-2 rounded-3xl bg-[var(--color-surface)] p-4 text-sm">
              {safeArray(contact?.workingHours).map((item) => (
                <div key={`${tr(item.days)}-expanded`} className="flex justify-between gap-4 py-2">
                  <span>{tr(item.days)}</span>
                  <strong>{item.hours}</strong>
                </div>
              ))}
            </div>
          ) : null}
          </div>
      </div>
    </section>
  );
}
