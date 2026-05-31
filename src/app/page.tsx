import { clinicConfig } from "@/config";
import { AboutStats } from "@/components/AboutStats";
import { AppointmentBanner } from "@/components/AppointmentBanner";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { TeamCarousel } from "@/components/TeamCarousel";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { MobileBookingBar } from "@/components/mobile/MobileBookingBar";
import { HeroMobile } from "@/components/mobile/HeroMobile";
import { ServicesMobile } from "@/components/mobile/ServicesMobile";
import { TestimonialsMobile } from "@/components/mobile/TestimonialsMobile";
import { WhyChooseUsMobile } from "@/components/mobile/WhyChooseUsMobile";
import { CursorFollower } from "@/components/motion/CursorFollower";

export default function Home() {
  const config = clinicConfig;

  return (
    <div className="site-shell">
      <Navbar brand={config.brand} nav={config.nav} contact={config.contact} />
      <main>
        <HeroMobile hero={config.hero} contact={config.contact} />
        <Hero hero={config.hero} contact={config.contact} />
        <ServicesMobile services={config.services} />
        <Services services={config.services} />
        <AboutStats about={config.about} />
        <AppointmentBanner banner={config.appointmentBanner} />
        <TeamCarousel team={config.team} />
        <WhyChooseUsMobile data={config.whyChooseUs} />
        <WhyChooseUs data={config.whyChooseUs} />
        <TestimonialsMobile testimonials={config.testimonials} />
        <Testimonials testimonials={config.testimonials} />
        <Faq faq={config.faq} />
        <FinalCta finalCta={config.finalCta} integrations={config.integrations} contact={config.contact} />
      </main>
      <Footer footer={config.footer} contact={config.contact} brand={config.brand} />
      <MobileBookingBar cta={config.nav.cta} contact={config.contact} mobile={config.mobile} />
      <CursorFollower />
    </div>
  );
}
