"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { WhyChooseUsConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { cx, safeArray } from "@/lib/utils";
import { IconResolver } from "../IconResolver";
import { SectionHeading } from "../ui";
import { Reveal } from "../motion/Reveal";
import { Stagger, StaggerItem } from "../motion/Stagger";

export function WhyChooseUsMobile({ data }: { data: WhyChooseUsConfig }) {
  const [openIndex, setOpenIndex] = useState(0);
  const tr = useT();

  return (
    <section className="section-pad pt-0 md:hidden">
      <div className="px-4">
        <Reveal variant="fade-up">
          <SectionHeading tag={data?.tag} title={data?.heading || "Why choose us"} />
        </Reveal>
        <Stagger className="mt-6 grid gap-3">
          {safeArray(data?.items).map((item, index) => {
            const open = openIndex === index;
            return (
              <StaggerItem key={`${tr(item.title)}-mobile`}>
                <div className={cx("rounded-[1.5rem] p-2", item.highlight ? "bg-[var(--color-accent)]" : "bg-[var(--color-white)]")}>
                  <button type="button" onClick={() => setOpenIndex(open ? -1 : index)} className="focus-ring flex min-h-14 w-full items-center justify-between gap-3 rounded-[1.2rem] px-4 text-left font-bold" aria-expanded={open}>
                    <span className="flex items-center gap-3">
                      <IconResolver name={item.icon} className="size-5" />
                      {tr(item.title)}
                    </span>
                    <ChevronDown className={cx("size-5 transition", open && "rotate-180")} />
                  </button>
                  {open ? <p className="px-4 pb-4 text-sm leading-7">{tr(item.text)}</p> : null}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
