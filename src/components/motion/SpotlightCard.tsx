"use client";

import { useRef } from "react";
import { useEffectsConfig } from "@/config/ConfigProvider";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";
import { cx } from "@/lib/utils";

export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useEffectsConfig().spotlightCards;
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();

  return (
    <div
      ref={ref}
      className={cx("spotlight-card", enabled && !reduced && pointerFine && "spotlight-card-enabled", className)}
      onMouseMove={(event) => {
        if (!enabled || reduced || !pointerFine) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || !ref.current) return;
        ref.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
