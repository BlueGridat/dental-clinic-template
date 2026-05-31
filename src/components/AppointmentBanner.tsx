import Image from "next/image";
import type { AppointmentBannerConfig } from "@/config/types";
import { fallbackImage } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { TiltCard } from "./motion/TiltCard";
import { ArrowButton } from "./ui";

export function AppointmentBanner({ banner }: { banner: AppointmentBannerConfig }) {
  return (
    <section className="container-page pb-16">
      <MotionReveal>
        <div className="grid overflow-hidden rounded-[2rem] bg-[var(--color-accent)] lg:grid-cols-[1fr_420px]">
          <div className="p-7 sm:p-10 lg:p-14">
            <h2 className="font-heading max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{banner?.heading || "Book your appointment"}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-primary)]/75">{banner?.description || ""}</p>
            <ArrowButton href={banner?.cta?.href || "#book"} label={banner?.cta?.label || "Book"} className="mt-8" />
          </div>
          <TiltCard className="relative min-h-72 overflow-hidden">
            <Image src={fallbackImage(banner?.image)} alt="" fill className="object-cover transition duration-500 ease-out hover:scale-105" sizes="(min-width: 1024px) 420px, 100vw" />
          </TiltCard>
        </div>
      </MotionReveal>
    </section>
  );
}
