"use client";

import { motion } from "framer-motion";
import { motionTokens, useReducedMotionSafe } from "@/lib/motion";

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: motionTokens.stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.base, ease: motionTokens.ease } }
      }}
    >
      {children}
    </motion.div>
  );
}
