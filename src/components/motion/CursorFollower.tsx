"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { clinicConfig, getEffectsConfig } from "@/config";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";

export function CursorFollower() {
  const enabled = getEffectsConfig(clinicConfig).customCursor;
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const [active, setActive] = useState(false);
  const x = useSpring(useMotionValue(-40), { stiffness: 260, damping: 28 });
  const y = useSpring(useMotionValue(-40), { stiffness: 260, damping: 28 });

  useEffect(() => {
    if (!enabled || reduced || !pointerFine) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX - 12);
      y.set(event.clientY - 12);
    };
    const over = (event: PointerEvent) => setActive(Boolean((event.target as HTMLElement).closest("a,button,input")));
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [enabled, pointerFine, reduced, x, y]);

  if (!enabled || reduced || !pointerFine) return null;
  return <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-[var(--color-primary)] mix-blend-multiply" style={{ x, y, width: active ? 40 : 24, height: active ? 40 : 24 }} />;
}
