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
  const [{ target, suffix }] = useState(() => parseValue(value));
  const reduced = useReducedMotionSafe();
  const enabled = getEffectsConfig(clinicConfig).statCountUp;
  const animate = enabled && !reduced;
  const [current, setCurrent] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate) {
      setCurrent(target);
      return;
    }
    if (!inView) return;

    let frame = 0;
    const total = 44;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setCurrent(target * Math.min(progress, 1));
      if (frame < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, inView, target]);

  const decimals = value.includes(".") ? 1 : 0;

  return (
    <span ref={ref} className={className}>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
