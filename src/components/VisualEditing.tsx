"use client";

import { useEffect } from "react";

export function VisualEditing() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING !== "true") return;

    let cleanup: (() => void) | undefined;
    let mounted = true;

    // @ts-expect-error This package chunk is intentionally loaded directly to avoid bundling optional Node-only optimistic editing internals.
    import("../../node_modules/@sanity/visual-editing/dist/_chunks-es/enableVisualEditing.js").then(({ enableVisualEditing }) => {
      if (!mounted) return;
      cleanup = enableVisualEditing();
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  return null;
}
