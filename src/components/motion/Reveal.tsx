"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion";

const variants: Record<string, Variants> = {
  "fade-up": { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  "scale-in": { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } },
  "blur-in": { hidden: { opacity: 0, filter: "blur(12px)", y: 12 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } }
};

export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "fade-up" | "fade" | "scale-in" | "blur-in";
  delay?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotionSafe();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
