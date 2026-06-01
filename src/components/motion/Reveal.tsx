"use client";

import { motion, type Variants } from "framer-motion";
import { motionTokens, useReducedMotionSafe } from "@/lib/motion";

const variants: Record<string, Variants> = {
  "fade-up": { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 1 }, show: { opacity: 1 } },
  "scale-in": { hidden: { opacity: 1, scale: 1 }, show: { opacity: 1, scale: 1 } },
  "blur-in": { hidden: { opacity: 1, filter: "blur(0px)", y: 0 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } }
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
      transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease, delay }}
    >
      {children}
    </motion.div>
  );
}
