"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export const motionTokens = {
  duration: {
    fast: 0.3,
    base: 0.45,
    slow: 0.6
  },
  ease: [0.22, 1, 0.36, 1] as const,
  offset: {
    tinyY: 8,
    y: 14,
    blur: 6,
    scaleFrom: 1.04
  },
  stagger: 0.07
};

export function useReducedMotionSafe() {
  return Boolean(useReducedMotion());
}

export function usePointerFine() {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isFine;
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
