"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
  tag?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("space-y-5", align === "center" && "mx-auto max-w-3xl text-center")}>
      {tag ? <Tag>{tag}</Tag> : null}
      <h2 className="font-heading text-3xl font-bold leading-[1.05] text-[var(--color-text)] md:text-5xl">
        {title}
      </h2>
      {description ? <p className="text-base leading-7 text-[var(--color-text-muted)] md:text-lg">{description}</p> : null}
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
  label: string;
  variant?: "dark" | "white";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <MagneticButton className="inline-flex">
      <Link
        href={href || "#"}
        aria-label={ariaLabel || label}
        className={cx(
          "focus-ring group inline-flex min-h-12 items-center gap-3 rounded-full px-5 py-2.5 text-sm font-bold transition duration-300 ease-out hover:-translate-y-0.5",
          variant === "dark"
            ? "bg-[var(--color-primary)] text-[var(--color-white)]"
            : "bg-[var(--color-white)] text-[var(--color-primary)]",
          className
        )}
      >
        <span>{label}</span>
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
  return (
    <span className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rating ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}>
          &#9733;
        </span>
      ))}
    </span>
  );
}
