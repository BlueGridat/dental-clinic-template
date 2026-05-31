"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import { cx } from "@/lib/utils";

export function MobileCarousel({ children, className }: { children: React.ReactNode[]; className?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const tr = useT();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={className}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button key={index} type="button" onClick={() => emblaApi?.scrollTo(index)} className={cx("size-2.5 rounded-full transition", selected === index ? "w-6 bg-[var(--color-primary)]" : "bg-black/20")} aria-label={`${tr({ de: "Zu Folie", en: "Go to slide" })} ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
