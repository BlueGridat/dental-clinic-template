import Image from "next/image";
import type { TestimonialsConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { RatingStars, SectionHeading } from "./ui";

export function Testimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  return (
    <section className="section-pad pt-0">
      <div className="container-page">
        <SectionHeading tag={testimonials?.tag} title={testimonials?.heading || "Patient reviews"} description={testimonials?.subheading} align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {safeArray(testimonials?.items).map((item) => (
            <MotionReveal key={`${item.name}-${item.quote}`}>
              <article className="h-full rounded-[2rem] bg-[var(--color-white)] p-7 shadow-sm">
                <RatingStars rating={item.rating} />
                <blockquote className="mt-6 text-xl font-semibold leading-9 text-[var(--color-text)]">&ldquo;{item.quote}&rdquo;</blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <Image src={fallbackImage(item.image)} alt={item.name} width={58} height={58} className="size-14 rounded-full object-cover" />
                  <p className="font-heading font-bold">{item.name}</p>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
