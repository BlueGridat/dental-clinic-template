"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ContactConfig, HeroConfig, ServicesConfig, TestimonialsConfig, WhyChooseUsConfig } from "@/config/types";

const HeroDesktop = dynamic(() => import("@/components/Hero").then((mod) => mod.Hero), {
  loading: () => null
});
const HeroMobile = dynamic(() => import("@/components/mobile/HeroMobile").then((mod) => mod.HeroMobile), {
  loading: () => null
});
const ServicesDesktop = dynamic(() => import("@/components/Services").then((mod) => mod.Services), {
  loading: () => null
});
const ServicesMobile = dynamic(() => import("@/components/mobile/ServicesMobile").then((mod) => mod.ServicesMobile), {
  loading: () => null
});
const WhyChooseUsDesktop = dynamic(() => import("@/components/WhyChooseUs").then((mod) => mod.WhyChooseUs), {
  loading: () => null
});
const WhyChooseUsMobile = dynamic(() => import("@/components/mobile/WhyChooseUsMobile").then((mod) => mod.WhyChooseUsMobile), {
  loading: () => null
});
const TestimonialsDesktop = dynamic(() => import("@/components/Testimonials").then((mod) => mod.Testimonials), {
  loading: () => null
});
const TestimonialsMobile = dynamic(() => import("@/components/mobile/TestimonialsMobile").then((mod) => mod.TestimonialsMobile), {
  loading: () => null
});

function useBreakpointReady(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function ResponsiveHero({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  const isMobile = useBreakpointReady();
  if (isMobile === null) return null;
  return isMobile ? <HeroMobile hero={hero} contact={contact} /> : <HeroDesktop hero={hero} contact={contact} />;
}

export function ResponsiveServices({ services }: { services: ServicesConfig }) {
  const isMobile = useBreakpointReady();
  if (isMobile === null) return null;
  return isMobile ? <ServicesMobile services={services} /> : <ServicesDesktop services={services} />;
}

export function ResponsiveWhyChooseUs({ data }: { data: WhyChooseUsConfig }) {
  const isMobile = useBreakpointReady();
  if (isMobile === null) return null;
  return isMobile ? <WhyChooseUsMobile data={data} /> : <WhyChooseUsDesktop data={data} />;
}

export function ResponsiveTestimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  const isMobile = useBreakpointReady();
  if (isMobile === null) return null;
  return isMobile ? <TestimonialsMobile testimonials={testimonials} /> : <TestimonialsDesktop testimonials={testimonials} />;
}
