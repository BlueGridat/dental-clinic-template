"use client";

import Link from "next/link";
import type { BrandConfig, ContactConfig, FooterConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";

export function Footer({ footer, contact, brand }: { footer: FooterConfig; contact: ContactConfig; brand: BrandConfig }) {
  const tr = useT();
  return (
    <footer id="contacts" className="bg-[var(--color-primary)] text-[var(--color-white)]">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <h2 className="font-heading text-3xl font-bold">{brand?.name || tr(footer?.wordmark)}</h2>
            <address className="mt-6 grid gap-3 not-italic text-white/70">
              <span>{contact?.address}</span>
              <a href={`tel:${contact?.phone || ""}`} className="focus-ring rounded-full hover:text-white">{contact?.phone}</a>
              <a href={`mailto:${contact?.email || ""}`} className="focus-ring rounded-full hover:text-white">{contact?.email}</a>
            </address>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {safeArray(footer?.columns).map((column) => (
              <div key={tr(column.title)}>
                <h3 className="font-heading font-bold">{tr(column.title)}</h3>
                <ul className="mt-5 grid gap-3 text-sm text-white/65">
                  {safeArray(column.links).map((link) => (
                    <li key={`${tr(column.title)}-${tr(link.label)}`}>
                      <Link href={link.href || "#"} className="focus-ring rounded-full hover:text-white">{tr(link.label)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 break-words font-heading text-[clamp(2.4rem,13vw,10rem)] font-bold leading-none text-white/10">{tr(footer?.wordmark) || brand?.name}</p>
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/60">{tr(footer?.copyright)}</div>
      </div>
    </footer>
  );
}
