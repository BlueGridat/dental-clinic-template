"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { clinicConfig, getEffectsConfig } from "@/config";
import { useReducedMotionSafe } from "@/lib/motion";

function parseValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return {
    target: match ? Number(match[1]) : 0,
    suffix: match ? match[2] : value
  };
}

export function CountUpValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotionSafe();
  const enabled = getEffectsConfig(clinicConfig).statCountUp;
  const [{ target, suffix }] = useState(() => parseValue(value));
  const [current, setCurrent] = useState(enabled && !reduced ? 0 : target);

  useEffect(() => {
    if (!enabled || reduced || !inView) {
      if (inView) setCurrent(target);
      return;
    }

    let frame = 0;
    const total = 44;
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setCurrent(target * Math.min(progress, 1));
      if (frame < total) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, inView, reduced, target]);

  const decimals = value.includes(".") ? 1 : 0;

  return (
    <span ref={ref} className={className}>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
