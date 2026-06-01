"use client";

import Link from "next/link";
import type { Localized } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";

export function LegalPage({ title, body }: { title?: Localized; body?: Localized[] }) {
  const tr = useT();

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-5 py-10">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-[var(--color-white)] p-6 shadow-sm md:p-10">
        <Link href="/" className="focus-ring inline-flex min-h-11 items-center rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-white)]">
          {tr({ de: "Zurück zur Website", en: "Back to site" })}
        </Link>
        <h1 className="font-heading mt-8 text-4xl font-bold leading-tight text-[var(--color-text)] md:text-6xl">{tr(title)}</h1>
        <div className="mt-8 grid gap-5 text-base leading-8 text-[var(--color-text)]">
          {(body || []).map((paragraph) => (
            <p key={tr(paragraph)}>{tr(paragraph)}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
