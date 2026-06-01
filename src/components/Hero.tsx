"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { clinicConfig, getEffectsConfig } from "@/config";
import type { ContactConfig, HeroConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";
import { MotionReveal } from "./MotionReveal";
import { TodayClock } from "./TodayClock";
import { TiltCard } from "./motion/TiltCard";
import { ArrowButton } from "./ui";

export function Hero({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  const ref = useRef<HTMLElement>(null);
  const enabled = getEffectsConfig(clinicConfig).heroParallax;
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const tr = useT();
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const cardX = useTransform(px, (value) => value * -8);
  const cardY = useTransform(py, (value) => value * -6);
  const imageX = useTransform(px, (value) => value * 10);
  const imageY = useTransform(py, (value) => value * 8);

  return (
    <section
      ref={ref}
      className="container-page hidden pb-8 pt-4 md:block lg:pb-12"
      onMouseMove={(event) => {
        if (!enabled || reduced || !pointerFine) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div className="grid gap-5 rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm lg:grid-cols-[1fr_0.95fr] lg:p-6">
        <MotionReveal className="flex flex-col justify-between gap-8 px-2 py-4 sm:px-6 lg:px-8 lg:py-10">
          <div className="space-y-6">
            <p className="font-heading max-w-4xl text-[clamp(3rem,7.1vw,6.25rem)] font-bold leading-[0.98] tracking-normal text-[var(--color-text)]" role="presentation" aria-hidden="true">
              {tr(hero?.heading) || "Dental care for confident smiles"}
            </p>
            <p className="max-w-xl text-base font-medium leading-7 text-[var(--color-text)] sm:text-lg">{tr(hero?.subtitle)}</p>
          </div>

          <motion.div className="grid gap-4 sm:grid-cols-[0.9fr_1fr]" style={enabled && !reduced && pointerFine ? { x: cardX, y: cardY } : undefined}>
            <article className="rounded-[2rem] bg-[var(--color-surface)] p-5">
              <h2 className="mb-4 text-lg font-bold">{tr({ de: "Öffnungszeiten", en: "Working Hours" })}</h2>
              <dl className="grid gap-2.5">
                {safeArray(contact?.workingHours).map((item) => (
                <div key={`${tr(item.days)}-${item.hours}`} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="font-medium">{tr(item.days)}</dt>
                    <dd className="font-semibold text-[var(--color-primary)]">{item.hours}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 rounded-full bg-[var(--color-white)] p-1 text-center">
                <TodayClock />
              </div>
            </article>

            <article className="flex min-h-44 flex-col items-center justify-center rounded-[2rem] bg-[var(--color-accent)] p-6 text-center">
              <ArrowButton href={hero?.cta?.href || "#book"} label="" ariaLabel={hero?.cta?.label || { de: "Termin buchen", en: "Book" }} variant="white" className="mb-5 !gap-0 !p-2 [&>span:first-child]:hidden" />
              <h2 className="text-xl font-bold leading-tight">{tr(hero?.cta?.label) || "Book an Appointment"}</h2>
            </article>
          </motion.div>
        </MotionReveal>

        <TiltCard className="relative">
          <MotionReveal className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-[var(--color-accent)] sm:min-h-[620px]">
            <motion.div className="absolute -inset-3" style={enabled && !reduced && pointerFine ? { x: imageX, y: imageY } : undefined}>
              <Image src={fallbackImage(hero?.image)} alt={tr(hero?.heading) || "Dental clinic hero image"} fill priority className="object-cover" sizes="(min-width: 1024px) 48vw, 100vw" />
            </motion.div>
          </MotionReveal>
        </TiltCard>
      </div>
    </section>
  );
}

