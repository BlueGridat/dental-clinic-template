"use client";

import Image from "next/image";
import { ChevronDown, Play } from "lucide-react";
import { useState } from "react";
import type { FaqConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { cx, fallbackImage, safeArray } from "@/lib/utils";
import { ArrowButton, SectionHeading } from "./ui";

export function Faq({ faq }: { faq: FaqConfig }) {
  const [openIndex, setOpenIndex] = useState(0);
  const items = safeArray(faq?.items);
  const tr = useT();

  return (
    <section className="section-pad pt-0">
      <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionHeading tag={faq?.tag} title={faq?.heading || "FAQ"} />
          <div className="mt-8 grid gap-3">
            {items.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={tr(item.q)} className="rounded-[1.5rem] bg-[var(--color-white)] p-2 shadow-sm">
                  <button
                    type="button"
                    className="focus-ring flex w-full items-center justify-between gap-4 rounded-[1.2rem] px-5 py-4 text-left font-heading font-bold"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    <span>{tr(item.q)}</span>
                    <ChevronDown className={cx("size-5 shrink-0 transition", open && "rotate-180")} />
                  </button>
                  {open ? <p className="px-5 pb-5 text-sm leading-7 text-[var(--color-text-muted)]">{tr(item.a)}</p> : null}
                </div>
              );
            })}
          </div>
          <ArrowButton href={faq?.cta?.href || "#book"} label={faq?.cta?.label || { de: "Frage im Erstgespräch klären", en: "Ask at your first consultation" }} className="mt-7" />
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[var(--color-white)] p-3 shadow-sm">
          <Image src={fallbackImage(faq?.video)} alt="" fill className="object-cover p-3" sizes="(min-width: 1024px) 45vw, 100vw" />
          <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] shadow-lg">
            <Play className="size-8 fill-current" aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  );
}
