"use client";

import { useRef, useState } from "react";
import { useEffectsConfig } from "@/config/ConfigProvider";
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
  const [{ target, suffix }] = useState(() => parseValue(value));
  const reduced = useReducedMotionSafe();
  const enabled = useEffectsConfig().statCountUp;
  void enabled;
  void reduced;

  const decimals = value.includes(".") ? 1 : 0;

  return (
    <span ref={ref} className={className}>
      {target.toFixed(decimals)}
      {suffix}
    </span>
  );
}
