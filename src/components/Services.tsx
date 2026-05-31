"use client";

import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServicesConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage, safeArray } from "@/lib/utils";
import { SpotlightCard } from "./motion/SpotlightCard";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { ArrowButton, SectionHeading } from "./ui";

export function Services({ services }: { services: ServicesConfig }) {
  const tr = useT();
  return (
    <section id="services" className="section-pad hidden pt-8 md:block">
      <div className="container-page rounded-[2rem] bg-[var(--color-white)] p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.72fr_0.55fr_auto] lg:items-end">
          <SectionHeading tag={services?.tag} title={services?.heading || "Services"} />
          <p className="text-sm font-medium leading-7 text-[var(--color-text)]">{tr(services?.description)}</p>
          <ArrowButton href={services?.cta?.href || "#services"} label={services?.cta?.label || "Explore"} />
        </div>
        <Stagger className="snap-x-cards flex gap-5 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {safeArray(services?.items).map((service) => (
            <StaggerItem key={tr(service.title)} className="min-w-[280px] flex-1">
              <SpotlightCard className="group flex h-full flex-col rounded-[1.8rem] border border-black/10 bg-[var(--color-white)] p-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="relative mb-5 grid aspect-[1.25] place-items-center overflow-hidden rounded-[1.5rem] bg-[var(--color-surface)]">
                  <Image src={fallbackImage(service.icon, "/images/svc-cosmetic.png")} alt="" width={110} height={110} className="object-contain transition duration-500 ease-out group-hover:scale-105" />
                </div>
                <h3 className="text-lg font-bold leading-tight">{tr(service.title)}</h3>
                <ul className="my-5 grid gap-2">
                  {safeArray(service.features).map((feature) => (
                    <li key={tr(feature)} className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)]">
                      <span className="grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--color-primary)] text-[var(--color-primary)]">
                        <Check className="size-3" />
                      </span>
                      {tr(feature)}
                    </li>
                  ))}
                </ul>
                <a href={service.href || "#"} className="focus-ring group mt-auto inline-flex items-center justify-between gap-3 rounded-full border border-[var(--color-primary)] px-4 py-2.5 text-sm font-bold transition duration-300 ease-out active:scale-[0.98]">
                  {tr({ de: "Mehr entdecken", en: "Explore more" })}
                  <span className="grid size-6 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-white)] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12">
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </a>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
