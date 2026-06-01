"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion";

export function RotatingWords({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotionSafe();
  const safeWords = words.length ? words : [""];

  useEffect(() => {
    if (reduced || safeWords.length <= 1) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % safeWords.length), 2200);
    return () => window.clearInterval(timer);
  }, [reduced, safeWords.length]);

  if (reduced) return <span className={className}>{safeWords[0]}</span>;

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={safeWords[index]}
          className="inline-block"
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {safeWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
