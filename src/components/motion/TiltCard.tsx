"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { useEffectsConfig } from "@/config/ConfigProvider";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useEffectsConfig().tiltImages;
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });

  if (!enabled || reduced || !pointerFine) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
        rotateX.set(((event.clientY - rect.top) / rect.height - 0.5) * -10);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
