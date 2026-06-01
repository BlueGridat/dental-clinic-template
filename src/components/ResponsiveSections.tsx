"use client";

import dynamic from "next/dynamic";
import type { ContactConfig, HeroConfig, ServicesConfig, TestimonialsConfig, WhyChooseUsConfig } from "@/config/types";
import { useIsMobile } from "@/lib/motion";

const HeroDesktop = dynamic(() => import("@/components/Hero").then((mod) => mod.Hero), {
  ssr: false,
  loading: () => <div className="hidden min-h-[760px] md:block" />
});
const HeroMobile = dynamic(() => import("@/components/mobile/HeroMobile").then((mod) => mod.HeroMobile), {
  ssr: false,
  loading: () => <div className="min-h-[720px] md:hidden" />
});
const ServicesDesktop = dynamic(() => import("@/components/Services").then((mod) => mod.Services), {
  ssr: false,
  loading: () => <div className="hidden min-h-[620px] md:block" />
});
const ServicesMobile = dynamic(() => import("@/components/mobile/ServicesMobile").then((mod) => mod.ServicesMobile), {
  ssr: false,
  loading: () => <div className="min-h-[560px] md:hidden" />
});
const WhyChooseUsDesktop = dynamic(() => import("@/components/WhyChooseUs").then((mod) => mod.WhyChooseUs), {
  ssr: false,
  loading: () => <div className="hidden min-h-[560px] md:block" />
});
const WhyChooseUsMobile = dynamic(() => import("@/components/mobile/WhyChooseUsMobile").then((mod) => mod.WhyChooseUsMobile), {
  ssr: false,
  loading: () => <div className="min-h-[460px] md:hidden" />
});
const TestimonialsDesktop = dynamic(() => import("@/components/Testimonials").then((mod) => mod.Testimonials), {
  ssr: false,
  loading: () => <div className="hidden min-h-[520px] md:block" />
});
const TestimonialsMobile = dynamic(() => import("@/components/mobile/TestimonialsMobile").then((mod) => mod.TestimonialsMobile), {
  ssr: false,
  loading: () => <div className="min-h-[480px] md:hidden" />
});

export function ResponsiveHero({ hero, contact }: { hero: HeroConfig; contact: ContactConfig }) {
  const isMobile = useIsMobile();
  return isMobile ? <HeroMobile hero={hero} contact={contact} /> : <HeroDesktop hero={hero} contact={contact} />;
}

export function ResponsiveServices({ services }: { services: ServicesConfig }) {
  const isMobile = useIsMobile();
  return isMobile ? <ServicesMobile services={services} /> : <ServicesDesktop services={services} />;
}

export function ResponsiveWhyChooseUs({ data }: { data: WhyChooseUsConfig }) {
  const isMobile = useIsMobile();
  return isMobile ? <WhyChooseUsMobile data={data} /> : <WhyChooseUsDesktop data={data} />;
}

export function ResponsiveTestimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  const isMobile = useIsMobile();
  return isMobile ? <TestimonialsMobile testimonials={testimonials} /> : <TestimonialsDesktop testimonials={testimonials} />;
}
