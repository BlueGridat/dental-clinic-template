"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { useEffectsConfig } from "@/config/ConfigProvider";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";

export function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useEffectsConfig().magneticButtons;
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18, mass: 0.25 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18, mass: 0.25 });

  if (!enabled || reduced || !pointerFine) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(((event.clientX - rect.left) / rect.width - 0.5) * 18);
        y.set(((event.clientY - rect.top) / rect.height - 0.5) * 18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
