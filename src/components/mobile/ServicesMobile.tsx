import Image from "next/image";
import { Check } from "lucide-react";
import type { ServicesConfig } from "@/config/types";
import { fallbackImage, safeArray } from "@/lib/utils";
import { SectionHeading } from "../ui";
import { MobileCarousel } from "./MobileCarousel";

export function ServicesMobile({ services }: { services: ServicesConfig }) {
  return (
    <section id="services-mobile" className="section-pad md:hidden">
      <div className="px-4">
        <SectionHeading tag={services?.tag} title={services?.heading || "Services"} description={services?.description} />
        <MobileCarousel className="mt-7">
          {safeArray(services?.items).map((service) => (
            <article key={`${service.title}-mobile`} className="min-w-0 flex-[0_0_86%] rounded-[2rem] bg-[var(--color-white)] p-4 shadow-sm">
              <div className="grid aspect-[1.25] place-items-center rounded-[1.5rem] bg-[var(--color-surface)]">
                <Image src={fallbackImage(service.icon, "/images/svc-cosmetic.png")} alt="" width={110} height={110} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
              <ul className="mt-4 grid gap-2">
                {safeArray(service.features).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4" /> {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </MobileCarousel>
      </div>
    </section>
  );
}
