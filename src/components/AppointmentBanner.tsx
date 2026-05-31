import Image from "next/image";
import type { AppointmentBannerConfig } from "@/config/types";
import { fallbackImage } from "@/lib/utils";
import { MotionReveal } from "./MotionReveal";
import { TiltCard } from "./motion/TiltCard";
import { ArrowButton } from "./ui";

export function AppointmentBanner({ banner }: { banner: AppointmentBannerConfig }) {
  return (
    <section className="container-page pb-12 md:pb-16">
      <MotionReveal>
        <div className="grid overflow-hidden rounded-[2rem] bg-[var(--color-accent)] p-4 md:p-0 lg:grid-cols-[1fr_420px]">
          <div className="p-3 text-center md:p-10 md:text-left lg:p-14">
            <h2 className="font-heading mx-auto max-w-3xl text-3xl font-bold leading-tight md:mx-0 md:text-5xl">{banner?.heading || "Book your appointment"}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--color-primary)]/75 md:mx-0 md:mt-5 md:text-lg md:leading-8">{banner?.description || ""}</p>
            <ArrowButton href={banner?.cta?.href || "#book"} label={banner?.cta?.label || "Book"} variant="white" className="mt-7 w-full justify-center md:mt-8 md:w-auto" />
          </div>
          <TiltCard className="relative min-h-96 overflow-hidden rounded-[1.6rem] md:min-h-72 md:rounded-none">
            <Image src={fallbackImage(banner?.image)} alt="" fill className="object-cover transition duration-500 ease-out hover:scale-105" sizes="(min-width: 1024px) 420px, 100vw" />
          </TiltCard>
        </div>
      </MotionReveal>
    </section>
  );
}
