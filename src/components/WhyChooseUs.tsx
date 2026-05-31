import type { WhyChooseUsConfig } from "@/config/types";
import { cx, safeArray } from "@/lib/utils";
import { IconResolver } from "./IconResolver";
import { SpotlightCard } from "./motion/SpotlightCard";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { SectionHeading } from "./ui";

export function WhyChooseUs({ data }: { data: WhyChooseUsConfig }) {
  return (
    <section className="section-pad hidden pt-0 md:block">
      <div className="container-page rounded-[2rem] bg-[var(--color-white)] p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_1fr_0.72fr]">
          <SectionHeading tag={data?.tag} title={data?.heading || "Why choose us"} />
          <div className="grid gap-4 text-base leading-7 text-[var(--color-text)]">
            {safeArray(data?.intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {data?.sideText ? <p className="self-end text-base leading-7 text-[var(--color-text)]">{data.sideText}</p> : null}
        </div>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {safeArray(data?.items).map((item) => (
            <StaggerItem key={item.title}>
              <SpotlightCard className={cx("h-full min-h-64 rounded-[1.8rem] border border-black/15 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl", item.highlight ? "bg-[var(--color-accent)]" : "bg-[var(--color-white)]")}>
                <span className="grid size-11 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-white)]">
                  <IconResolver name={item.icon} className="size-5" />
                </span>
                <h3 className="mt-12 text-xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--color-text)]">{item.text}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
