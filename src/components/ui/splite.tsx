"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => <SplineFallback />
});

function SplineFallback() {
  return (
    <div className="grid h-full min-h-[360px] place-items-center bg-secondary">
      <div className="size-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary" aria-label="Loading 3D scene" />
    </div>
  );
}

export function SplineScene({ scene, className }: { scene: string; className?: string }) {
  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
