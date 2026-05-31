"use client";

import Image from "next/image";
import type { AboutConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { CountUpValue } from "./CountUpValue";
import { RatingStars, SectionHeading } from "./ui";

export function AboutStats({ about }: { about: AboutConfig }) {
  const tr = useT();
  return (
    <section id="about" className="section-pad pt-0">
      <div className="container-page grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <MotionReveal className="space-y-8">
          <SectionHeading tag={about?.tag} title={about?.heading || "Expertise you can trust"} />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {safeArray(about?.stats).map((stat) => (
              <StaggerItem key={`${stat.value}-${tr(stat.label)}`} className="rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <p className="font-heading text-4xl font-bold"><CountUpValue value={stat.value} /></p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">{tr(stat.label)}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </MotionReveal>
        <MotionReveal className="relative mx-auto w-full max-w-xl">
          <div className="aspect-square overflow-hidden rounded-full bg-[var(--color-accent)] p-4">
            <div className="relative h-full overflow-hidden rounded-full bg-[var(--color-white)]">
              <Image src={fallbackImage(about?.image)} alt="" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </div>
          <div className="absolute bottom-8 left-0 rounded-[1.5rem] bg-[var(--color-white)] p-5 shadow-lg">
            <p className="text-sm font-bold">{tr(about?.rating?.label) || "Patient rate"}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-heading text-2xl font-bold">{about?.rating?.value || "5/5"}</span>
              <RatingStars rating={about?.rating?.stars || 5} />
            </div>
          </div>
          <div className="absolute right-2 top-10 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-bold">{tr(about?.badge) || "Expert care"}</div>
        </MotionReveal>
      </div>
    </section>
  );
}
