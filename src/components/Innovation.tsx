"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InnovationConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { fallbackImage } from "@/lib/utils";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";
import { SplineScene } from "./ui/splite";

function useSaveData() {
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSaveData(Boolean(connection?.saveData));
  }, []);

  return saveData;
}

export function Innovation({ innovation }: { innovation?: InnovationConfig }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const saveData = useSaveData();
  const tr = useT();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!innovation?.enabled) return null;

  const canRenderSpline = Boolean(innovation.splineSceneUrl) && inView && !reduced && pointerFine && !saveData;
  const fallback = fallbackImage(innovation.fallbackImage, "/images/appointment.jpg");

  return (
    <section ref={ref} className="section-pad pt-0">
      <div className="container-page overflow-hidden rounded-[2rem] bg-[var(--color-primary)] text-[var(--color-white)] shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[0.86fr_1fr]">
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-9 lg:p-12">
            {innovation.eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">{tr(innovation.eyebrow)}</p>
            ) : null}
            <h2 className="font-heading text-3xl font-bold leading-tight text-[var(--color-white)] md:text-5xl">{tr(innovation.heading)}</h2>
            {innovation.subheading ? <p className="text-lg font-semibold leading-8 text-white/90">{tr(innovation.subheading)}</p> : null}
            {innovation.body ? <p className="max-w-xl text-base leading-7 text-white/85">{tr(innovation.body)}</p> : null}
          </div>

          <div className="relative min-h-[360px] overflow-hidden bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--color-primary))] lg:min-h-[520px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--color-accent)_45%,transparent),transparent_52%)]" />
            {canRenderSpline ? (
              <SplineScene scene={innovation.splineSceneUrl || ""} className="relative z-10 h-full min-h-[360px] w-full lg:min-h-[520px]" />
            ) : (
              <Image src={fallback} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-95" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
