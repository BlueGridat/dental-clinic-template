"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Localized } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { useReducedMotionSafe } from "@/lib/motion";
import { cx } from "@/lib/utils";
import { MagneticButton } from "./motion/MagneticButton";

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-[var(--color-white)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)] shadow-sm">
      {children}
    </span>
  );
}

export function SectionHeading({
  tag,
  title,
  description,
  align = "left"
}: {
  tag?: Localized;
  title: Localized;
  description?: Localized;
  align?: "left" | "center";
}) {
  const tr = useT();
  return (
    <div className={cx("space-y-5", align === "center" && "mx-auto max-w-3xl text-center")}>
      {tag ? <Tag>{tr(tag)}</Tag> : null}
      <h2 className="font-heading text-3xl font-bold leading-[1.05] text-[var(--color-text)] md:text-5xl">
        {tr(title)}
      </h2>
      {description ? <p className="text-base leading-7 text-[var(--color-text-muted)] md:text-lg">{tr(description)}</p> : null}
    </div>
  );
}

export function ArrowButton({
  href,
  label,
  variant = "dark",
  className,
  ariaLabel
}: {
  href: string;
  label: Localized;
  variant?: "dark" | "white";
  className?: string;
  ariaLabel?: Localized;
}) {
  const tr = useT();
  const renderedLabel = tr(label);
  return (
    <MagneticButton className="inline-flex">
      <Link
        href={href || "#"}
        aria-label={tr(ariaLabel) || renderedLabel}
        className={cx(
          "focus-ring group inline-flex min-h-12 items-center gap-3 rounded-full px-5 py-2.5 text-sm font-bold transition duration-300 ease-out hover:-translate-y-0.5",
          variant === "dark"
            ? "bg-[var(--color-primary)] text-[var(--color-white)]"
            : "bg-[var(--color-white)] text-[var(--color-primary)]",
          className
        )}
      >
        <span>{renderedLabel}</span>
        <span
          className={cx(
            "grid size-8 place-items-center rounded-full transition duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12",
            variant === "dark" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"
          )}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </MagneticButton>
  );
}

export function RatingStars({ rating = 5 }: { rating?: number }) {
  const reduced = useReducedMotionSafe();
  const tr = useT();
  return (
    <span className="flex gap-1" aria-label={`${rating} ${tr({ de: "von 5 Sternen", en: "out of 5 stars" })}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.span
          key={index}
          className={index < rating ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}
          initial={reduced ? false : { opacity: 0, scale: 0.85 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04, duration: 0.25 }}
        >
          &#9733;
        </motion.span>
      ))}
    </span>
  );
}
