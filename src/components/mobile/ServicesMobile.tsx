"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { ServicesConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { SectionHeading } from "../ui";
import { MobileCarousel } from "./MobileCarousel";
import { Reveal } from "../motion/Reveal";

export function ServicesMobile({ services }: { services: ServicesConfig }) {
  const tr = useT();
  return (
    <section id="services-mobile" className="section-pad md:hidden">
      <div className="px-4">
        <Reveal variant="fade-up">
          <SectionHeading tag={services?.tag} title={services?.heading || "Services"} description={services?.description} />
        </Reveal>
        <Reveal variant="fade-up" delay={0.1}>
          <MobileCarousel className="mt-7">
          {safeArray(services?.items).map((service) => (
            <article key={`${tr(service.title)}-mobile`} className="min-w-0 flex-[0_0_86%] rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm">
              <div className="grid aspect-[1.25] place-items-center rounded-[1.5rem] bg-[var(--color-surface)]">
                <Image src={fallbackImage(service.icon, "/images/svc-cosmetic.png")} alt="" width={110} height={110} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{tr(service.title)}</h3>
              <ul className="mt-4 grid gap-2">
                {safeArray(service.features).map((feature) => (
                  <li key={tr(feature)} className="flex items-center gap-2 text-sm">
                    <Check className="size-4" /> {tr(feature)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </MobileCarousel>
        </Reveal>
      </div>
    </section>
  );
}
