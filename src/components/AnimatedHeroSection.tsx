"use client";

import type { AnimatedHeroConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";
import { ArrowButton } from "./ui";
import { RotatingWords } from "./ui/animated-hero";

export function AnimatedHeroSection({ animatedHero }: { animatedHero?: AnimatedHeroConfig }) {
  const tr = useT();

  if (!animatedHero?.enabled) return null;

  const words = safeArray(animatedHero.rotatingWords).map((word) => tr(word)).filter(Boolean);

  return (
    <section className="section-pad pt-0">
      <div className="container-page rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm sm:p-9 lg:p-12">
        <div className="mx-auto max-w-5xl text-center">
          {animatedHero.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">{tr(animatedHero.eyebrow)}</p> : null}
          <h2 className="font-heading mt-5 text-[clamp(2.4rem,6vw,5.8rem)] font-bold leading-[1.02] text-[var(--color-text)]">
            {tr(animatedHero.prefix)}{" "}
            <RotatingWords words={words} className="inline-block text-[var(--color-primary)]" />{" "}
            {tr(animatedHero.suffix)}
          </h2>
          {animatedHero.description ? <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-muted)] md:text-lg">{tr(animatedHero.description)}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {animatedHero.primaryCta ? <ArrowButton href={animatedHero.primaryCta.href} label={animatedHero.primaryCta.label} /> : null}
            {animatedHero.secondaryCta ? <ArrowButton href={animatedHero.secondaryCta.href} label={animatedHero.secondaryCta.label} variant="white" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
