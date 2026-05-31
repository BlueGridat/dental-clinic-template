"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Stethoscope, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clinicConfig, getEffectsConfig } from "@/config";
import type { BrandConfig, ContactConfig, NavConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { ArrowButton } from "./ui";
import { MobileMenu } from "./mobile/MobileMenu";

export function Navbar({ brand, nav, contact }: { brand: BrandConfig; nav: NavConfig; contact: ContactConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = safeArray(nav?.links);
  const reactive = getEffectsConfig(clinicConfig).reactiveNavbar;

  useEffect(() => {
    if (!reactive) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-progress", `${max > 0 ? window.scrollY / max : 0}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reactive]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-0 pt-[calc(12px+env(safe-area-inset-top))] md:sticky md:bg-[var(--color-surface)]/90 md:pt-4 md:backdrop-blur-xl">
      <div className="container-page relative">
        <div className="absolute inset-x-5 -bottom-px h-px origin-left scale-x-[var(--scroll-progress,0)] bg-[var(--color-accent)]" />
      </div>
      <nav className={`container-page flex items-center justify-between gap-4 rounded-[1.7rem] bg-transparent px-0 transition-all duration-300 md:bg-[var(--color-white)] md:px-5 ${scrolled ? "min-h-14 md:shadow-lg md:shadow-black/10" : "min-h-16 md:shadow-sm"}`} aria-label="Primary navigation">
        <Link href="#" className="focus-ring flex items-center gap-3 rounded-full">
          <span className={`grid place-items-center rounded-full bg-[var(--color-white)] text-[var(--color-primary)] shadow-sm transition-all duration-300 md:bg-[var(--color-surface)] md:shadow-none ${scrolled ? "size-9" : "size-10"}`}>
            {brand.logoImage ? (
              <Image src={fallbackImage(brand.logoImage)} width={28} height={28} alt="" />
            ) : (
              <Stethoscope className="size-5" aria-hidden="true" />
            )}
          </span>
          <span className="hidden text-base font-bold md:inline">{brand.logoText || brand.name}</span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <Link key={`${link.label}-${link.href}`} href={link.href || "#"} className="focus-ring group relative rounded-full text-sm font-semibold text-[var(--color-text)] transition hover:text-[var(--color-text-muted)]">
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-accent)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <ArrowButton href={nav?.cta?.href || "#book"} label={nav?.cta?.label || "Book"} />
        </div>

        <button
          type="button"
          className="focus-ring grid size-12 place-items-center rounded-full bg-[var(--color-white)] shadow-sm lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} nav={nav} contact={contact} />
    </header>
  );
}
