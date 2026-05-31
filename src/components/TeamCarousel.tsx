"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TeamConfig } from "@/config/types";
import { cx, fallbackImage, safeArray } from "@/lib/utils";
import { SectionHeading } from "./ui";

export function TeamCarousel({ team }: { team: TeamConfig }) {
  const filters = safeArray(team?.filters);
  const [activeFilter, setActiveFilter] = useState(filters[0] || "All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const doctors = useMemo(() => {
    const items = safeArray(team?.doctors);
    return activeFilter === "All" ? items : items.filter((doctor) => doctor.category === activeFilter);
  }, [activeFilter, team?.doctors]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: doctors.length > 2 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.reInit();
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, doctors.length]);

  return (
    <section id="doctors" className="section-pad">
      <div className="container-page rounded-[2rem] bg-[var(--color-white)] p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_0.65fr_auto] lg:items-end">
          <SectionHeading tag={team?.tag} title={team?.heading || "Doctors"} description={team?.description} />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible" role="tablist" aria-label="Doctor specialties">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter}
                className={cx("focus-ring min-h-11 shrink-0 rounded-full px-5 py-2 text-sm font-bold transition active:scale-[0.98] md:min-h-0 md:px-4 md:text-xs", activeFilter === filter ? "bg-[var(--color-accent)] text-[var(--color-primary)] md:bg-[var(--color-primary)] md:text-[var(--color-white)]" : "bg-[var(--color-surface)] text-[var(--color-primary)]")}
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedIndex(0);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {doctors.map((doctor) => (
              <article key={`${doctor.name}-${doctor.role}`} className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_38%] lg:flex-[0_0_24%]">
                <div className="relative aspect-[1.03] overflow-hidden rounded-[1.55rem] bg-[var(--color-surface)]">
                  <Image src={fallbackImage(doctor.image)} alt={doctor.name} fill className="object-cover" sizes="(min-width: 1024px) 360px, 85vw" />
                </div>
                <div className="pt-4 text-center">
                  <h3 className="text-base font-bold">{doctor.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{doctor.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="font-heading text-xl font-bold">{doctors.length ? `${selectedIndex + 1} / ${doctors.length}` : "0 / 0"}</p>
          <div className="flex gap-3">
            <button type="button" onClick={scrollPrev} className="focus-ring grid size-12 place-items-center rounded-full bg-[var(--color-white)]" aria-label="Previous doctors">
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={scrollNext} className="focus-ring grid size-12 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-white)]" aria-label="Next doctors">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
