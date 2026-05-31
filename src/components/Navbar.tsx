"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import type { BrandConfig, NavConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { ArrowButton } from "./ui";

export function Navbar({ brand, nav }: { brand: BrandConfig; nav: NavConfig }) {
  const [open, setOpen] = useState(false);
  const links = safeArray(nav?.links);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/90 px-0 pt-4 backdrop-blur-xl">
      <nav className="container-page flex min-h-16 items-center justify-between gap-4 rounded-[1.7rem] bg-[var(--color-white)] px-4 shadow-sm sm:px-5" aria-label="Primary navigation">
        <Link href="#" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)]">
            {brand.logoImage ? (
              <Image src={fallbackImage(brand.logoImage)} width={28} height={28} alt="" />
            ) : (
              <Stethoscope className="size-5" aria-hidden="true" />
            )}
          </span>
          <span className="text-base font-bold">{brand.logoText || brand.name}</span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <Link key={`${link.label}-${link.href}`} href={link.href || "#"} className="focus-ring rounded-full text-sm font-semibold text-[var(--color-text)] transition hover:text-[var(--color-text-muted)]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <ArrowButton href={nav?.cta?.href || "#book"} label={nav?.cta?.label || "Book"} />
        </div>

        <button
          type="button"
          className="focus-ring grid size-11 place-items-center rounded-full bg-[var(--color-white)] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="container-page pb-5 lg:hidden">
          <div className="rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm">
            <div className="grid gap-2">
              {links.map((link) => (
                <Link key={`${link.label}-mobile`} href={link.href || "#"} onClick={() => setOpen(false)} className="focus-ring rounded-2xl px-4 py-3 font-semibold">
                  {link.label}
                </Link>
              ))}
            </div>
            <ArrowButton className="mt-3 w-full justify-center" href={nav?.cta?.href || "#book"} label={nav?.cta?.label || "Book"} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
