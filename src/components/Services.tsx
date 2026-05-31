import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServicesConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { ArrowButton, SectionHeading } from "./ui";

export function Services({ services }: { services: ServicesConfig }) {
  return (
    <section id="services" className="section-pad pt-8">
      <div className="container-page rounded-[2rem] bg-[var(--color-white)] p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.72fr_0.55fr_auto] lg:items-end">
          <SectionHeading tag={services?.tag} title={services?.heading || "Services"} />
          <p className="text-sm font-medium leading-7 text-[var(--color-text)]">{services?.description}</p>
          <ArrowButton href={services?.cta?.href || "#services"} label={services?.cta?.label || "Explore"} />
        </div>
        <div className="flex gap-5 overflow-x-auto pb-3">
          {safeArray(services?.items).map((service) => (
            <MotionReveal key={service.title} className="min-w-[280px] flex-1">
              <article className="flex h-full flex-col rounded-[1.8rem] border border-black/10 bg-[var(--color-white)] p-4">
                <div className="relative mb-5 grid aspect-[1.25] place-items-center overflow-hidden rounded-[1.5rem] bg-[var(--color-surface)]">
                  <Image src={fallbackImage(service.icon, "/images/svc-cosmetic.png")} alt="" width={110} height={110} className="object-contain" />
                </div>
                <h3 className="text-lg font-bold leading-tight">{service.title}</h3>
                <ul className="my-5 grid gap-2">
                  {safeArray(service.features).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)]">
                      <span className="grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--color-primary)] text-[var(--color-primary)]">
                        <Check className="size-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={service.href || "#"} className="focus-ring mt-auto inline-flex items-center justify-between gap-3 rounded-full border border-[var(--color-primary)] px-4 py-2.5 text-sm font-bold">
                  Explore more
                  <span className="grid size-6 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-white)]">
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </a>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
