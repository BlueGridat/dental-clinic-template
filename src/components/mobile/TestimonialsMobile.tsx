"use client";

import Image from "next/image";
import type { TestimonialsConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { RatingStars, SectionHeading } from "../ui";
import { MobileCarousel } from "./MobileCarousel";
import { Reveal } from "../motion/Reveal";

export function TestimonialsMobile({ testimonials }: { testimonials: TestimonialsConfig }) {
  const tr = useT();
  return (
    <section className="section-pad pt-0 md:hidden">
      <div className="px-4">
        <Reveal variant="fade-up">
          <SectionHeading tag={testimonials?.tag} title={testimonials?.heading || "Reviews"} description={testimonials?.subheading} />
        </Reveal>
        <Reveal variant="fade-up" delay={0.1}>
          <MobileCarousel className="mt-7">
          {safeArray(testimonials?.items).map((item) => (
            <article key={`${item.name}-mobile`} className="min-w-0 flex-[0_0_88%] rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm">
              <RatingStars rating={item.rating} />
              <blockquote className="mt-5 text-lg font-semibold leading-8">&ldquo;{tr(item.quote)}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image src={fallbackImage(item.image)} alt={item.name} width={52} height={52} className="size-13 rounded-full object-cover" />
                <p className="font-bold">{item.name}</p>
              </div>
            </article>
          ))}
        </MobileCarousel>
        </Reveal>
      </div>
    </section>
  );
}
