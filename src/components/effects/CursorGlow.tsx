"use client";

import { useEffect, useRef } from "react";
import { clinicConfig, getEffectsConfig } from "@/config";
import { usePointerFine, useReducedMotionSafe } from "@/lib/motion";

export function CursorGlow() {
  const primaryRef = useRef<HTMLDivElement>(null);
  const auroraARef = useRef<HTMLDivElement>(null);
  const auroraBRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const pointerFine = usePointerFine();
  const effects = getEffectsConfig(clinicConfig);

  useEffect(() => {
    if (!effects.cursorGlow || reduced || !pointerFine) return;

    const target = { x: 0.5, y: 0.18 };
    const current = { x: 0.5, y: 0.18 };
    let raf = 0;
    let drift = 0;

    const onPointerMove = (event: PointerEvent) => {
      const shell = primaryRef.current?.closest(".site-shell");
      const rect = shell?.getBoundingClientRect();
      if (!rect) return;
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = (event.clientY - rect.top) / rect.height;
    };

    const render = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      drift += 0.006;

      const x = current.x * 100;
      const y = current.y * 100;
      primaryRef.current?.style.setProperty("transform", `translate3d(calc(${x}% - 50%), calc(${y}% - 50%), 0)`);

      if (effects.auroraBlobs) {
        auroraARef.current?.style.setProperty("transform", `translate3d(calc(${25 + x * 0.08}% - 50%), calc(${18 + Math.sin(drift) * 4}% - 50%), 0)`);
        auroraBRef.current?.style.setProperty("transform", `translate3d(calc(${78 - x * 0.05}% - 50%), calc(${74 + Math.cos(drift * 0.8) * 3}% - 50%), 0)`);
      }

      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, [effects.auroraBlobs, effects.cursorGlow, pointerFine, reduced]);

  if (!effects.cursorGlow || reduced || !pointerFine) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        ref={primaryRef}
        className="absolute left-0 top-0 h-[48vmax] w-[48vmax] rounded-full bg-[var(--color-accent)] opacity-55 blur-[96px] will-change-transform"
        style={{ transform: "translate3d(10%, -20%, 0)", mixBlendMode: "multiply" }}
      />
      {effects.auroraBlobs ? (
        <>
          <div ref={auroraARef} className="absolute left-0 top-0 h-[34vmax] w-[34vmax] rounded-full bg-[var(--color-white)] opacity-45 blur-[84px] will-change-transform" />
          <div ref={auroraBRef} className="absolute left-0 top-0 h-[28vmax] w-[28vmax] rounded-full bg-[var(--color-accent)] opacity-30 blur-[72px] will-change-transform" />
        </>
      ) : null}
    </div>
  );
}
