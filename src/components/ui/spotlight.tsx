import { cn } from "@/lib/utils";

export function Spotlight({ className, fill = "var(--color-accent)" }: { className?: string; fill?: string }) {
  return (
    <svg className={cn("pointer-events-none absolute z-0 h-[160%] w-[120%] opacity-45", className)} viewBox="0 0 1200 800" fill="none" aria-hidden="true">
      <g filter="url(#spotlight-blur)">
        <ellipse cx="600" cy="120" rx="360" ry="180" fill={fill} fillOpacity="0.65" />
      </g>
      <defs>
        <filter id="spotlight-blur" x="0" y="-300" width="1200" height="900" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="90" />
        </filter>
      </defs>
    </svg>
  );
}
