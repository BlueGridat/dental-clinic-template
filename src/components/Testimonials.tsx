"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { TestimonialsConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { SpotlightCard } from "./motion/SpotlightCard";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { RatingStars, SectionHeading } from "./ui";

export function Testimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  const tr = useT();
  return (
    <section className="section-pad hidden pt-0 md:block">
      <div className="container-page">
        <SectionHeading tag={testimonials?.tag} title={testimonials?.heading || { de: "Was ruhige Behandlung verändert", en: "What calm care changes" }} description={testimonials?.subheading} align="center" />
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          {safeArray(testimonials?.items).map((item) => (
            <StaggerItem key={`${item.name}-${tr(item.quote)}`}>
              <SpotlightCard className="flex h-full flex-col rounded-[2rem] bg-[var(--color-white)] p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <RatingStars rating={item.rating} />
                  {item.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
                      <BadgeCheck className="size-3.5" />
                      {tr({ de: "Verifiziert", en: "Verified patient" })}
                    </span>
                  ) : null}
                </div>
                {(item.treatment || item.date) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.treatment ? <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold text-[var(--color-text)]">{tr(item.treatment)}</span> : null}
                    {item.date ? <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">{tr(item.date)}</span> : null}
                  </div>
                ) : null}
                <blockquote className="mt-6 text-xl font-semibold leading-9 text-[var(--color-text)]">&ldquo;{tr(item.quote)}&rdquo;</blockquote>
                <div className="mt-auto flex items-center gap-4 pt-8">
                  <Image src={fallbackImage(item.image)} alt={item.name} width={58} height={58} className="size-14 rounded-full object-cover" />
                  <p className="font-heading font-bold">{item.name}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
