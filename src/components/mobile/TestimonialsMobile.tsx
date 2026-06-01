"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { TestimonialsConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { dataSanity } from "@/lib/sanityData";
import { RatingStars, SectionHeading } from "../ui";
import { MobileCarousel } from "./MobileCarousel";

export function TestimonialsMobile({ testimonials }: { testimonials: TestimonialsConfig }) {
  const tr = useT();
  return (
    <section data-sanity={dataSanity("testimonials")} className="section-pad pt-0 md:hidden">
      <div className="px-4">
        <SectionHeading tag={testimonials?.tag} title={testimonials?.heading || "Reviews"} description={testimonials?.subheading} />
        <MobileCarousel className="mt-7">
          {safeArray(testimonials?.items).map((item) => (
            <article key={`${item.name}-mobile`} className="min-w-0 flex-[0_0_88%] rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <RatingStars rating={item.rating} />
                {item.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)]">
                    <BadgeCheck className="size-3" />
                    {tr({ de: "Verifiziert", en: "Verified" })}
                  </span>
                ) : null}
              </div>
              {(item.treatment || item.date) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.treatment ? <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-bold">{tr(item.treatment)}</span> : null}
                  {item.date ? <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] font-semibold text-[var(--color-text-muted)]">{tr(item.date)}</span> : null}
                </div>
              ) : null}
              <blockquote className="mt-5 text-lg font-semibold leading-8">&ldquo;{tr(item.quote)}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image src={fallbackImage(item.image)} alt={item.name} width={52} height={52} className="size-13 rounded-full object-cover" />
                <p className="font-bold">{item.name}</p>
              </div>
            </article>
          ))}
        </MobileCarousel>
      </div>
    </section>
  );
}
