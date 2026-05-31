"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion";

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
      }}
    >
      {children}
    </motion.div>
  );
}
