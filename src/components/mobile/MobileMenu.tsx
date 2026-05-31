"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ContactConfig, NavConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";
import { LanguageToggle } from "../LanguageToggle";
import { ArrowButton } from "../ui";

export function MobileMenu({
  open,
  onClose,
  nav,
  contact
}: {
  open: boolean;
  onClose: () => void;
  nav: NavConfig;
  contact: ContactConfig;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const tr = useT();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] bg-[var(--color-primary)] px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))] text-[var(--color-white)] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <LanguageToggle className="bg-white/10 text-white" />
            <button ref={closeRef} type="button" onClick={onClose} className="focus-ring grid size-12 place-items-center rounded-full bg-white/10" aria-label={tr({ de: "Menü schließen", en: "Close menu" })}>
              <X className="size-6" />
            </button>
          </div>

          <motion.div className="mt-12 grid gap-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            {safeArray(nav?.links).map((link) => (
              <motion.div key={`${tr(link.label)}-overlay`} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <Link href={link.href || "#"} onClick={onClose} className="focus-ring block min-h-14 rounded-2xl px-2 py-3 font-heading text-4xl font-bold active:scale-[0.98]">
                  {tr(link.label)}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="absolute inset-x-5 bottom-[calc(24px+env(safe-area-inset-bottom))] grid gap-3">
            <ArrowButton href={nav?.cta?.href || "#book"} label={nav?.cta?.label || "Book"} variant="white" className="w-full justify-center" />
            <div className="grid grid-cols-2 gap-3 text-center text-sm font-bold">
              <a href={`tel:${contact?.phone || ""}`} className="focus-ring rounded-full bg-white/10 px-4 py-4 active:scale-[0.98]">{tr({ de: "Anrufen", en: "Call" })}</a>
              <a href={`mailto:${contact?.email || ""}`} className="focus-ring rounded-full bg-white/10 px-4 py-4 active:scale-[0.98]">{tr({ de: "E-Mail", en: "Email" })}</a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
