import Image from "next/image";
import type { TestimonialsConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { SpotlightCard } from "./motion/SpotlightCard";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { RatingStars, SectionHeading } from "./ui";

export function Testimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  return (
    <section className="section-pad hidden pt-0 md:block">
      <div className="container-page">
        <SectionHeading tag={testimonials?.tag} title={testimonials?.heading || "Patient reviews"} description={testimonials?.subheading} align="center" />
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          {safeArray(testimonials?.items).map((item) => (
            <StaggerItem key={`${item.name}-${item.quote}`}>
              <SpotlightCard className="h-full rounded-[2rem] bg-[var(--color-white)] p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <RatingStars rating={item.rating} />
                <blockquote className="mt-6 text-xl font-semibold leading-9 text-[var(--color-text)]">&ldquo;{item.quote}&rdquo;</blockquote>
                <div className="mt-8 flex items-center gap-4">
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
