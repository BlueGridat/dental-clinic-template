import Image from "next/image";
import type { ContactConfig, HeroConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { TodayClock } from "./TodayClock";
import { ArrowButton } from "./ui";

export function Hero({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  return (
    <section className="container-page pb-8 pt-4 lg:pb-12">
      <div className="grid gap-5 rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm lg:grid-cols-[1fr_0.95fr] lg:p-6">
        <MotionReveal className="flex flex-col justify-between gap-8 px-2 py-4 sm:px-6 lg:px-8 lg:py-10">
          <div className="space-y-6">
            <h1 className="font-heading max-w-4xl text-[clamp(3rem,7.1vw,6.25rem)] font-bold leading-[0.98] tracking-normal text-[var(--color-text)]">
              {hero?.heading || "Dental care for confident smiles"}
            </h1>
            <p className="max-w-xl text-base font-medium leading-7 text-[var(--color-text)] sm:text-lg">{hero?.subtitle || ""}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.9fr_1fr]">
            <article className="rounded-[2rem] bg-[var(--color-surface)] p-5">
              <h2 className="mb-4 text-lg font-bold">Working Hours</h2>
              <dl className="grid gap-2.5">
                {safeArray(contact?.workingHours).map((item) => (
                  <div key={`${item.days}-${item.hours}`} className="flex items-center justify-between gap-4 text-sm">
                    <dt className="font-medium">{item.days}</dt>
                    <dd className="font-semibold text-[var(--color-primary)]">{item.hours}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 rounded-full bg-[var(--color-white)] p-1 text-center">
                <TodayClock />
              </div>
            </article>

            <article className="flex min-h-44 flex-col items-center justify-center rounded-[2rem] bg-[var(--color-accent)] p-6 text-center">
              <ArrowButton href={hero?.cta?.href || "#book"} label="" ariaLabel={hero?.cta?.label || "Book"} variant="white" className="mb-5 !gap-0 !p-2 [&>span:first-child]:hidden" />
              <h2 className="text-xl font-bold leading-tight">{hero?.cta?.label || "Book an Appointment"}</h2>
            </article>
          </div>
        </MotionReveal>

        <MotionReveal className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-[var(--color-accent)] sm:min-h-[620px]">
          <Image src={fallbackImage(hero?.image)} alt="" fill priority className="object-cover" sizes="(min-width: 1024px) 48vw, 100vw" />
        </MotionReveal>
      </div>
    </section>
  );
}
