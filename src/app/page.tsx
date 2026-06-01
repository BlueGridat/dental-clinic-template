import { clinicConfig } from "@/config";
import { AboutStats } from "@/components/AboutStats";
import { AnimatedHeroSection } from "@/components/AnimatedHeroSection";
import { AppointmentBanner } from "@/components/AppointmentBanner";
import { ClientEffects } from "@/components/ClientEffects";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Innovation } from "@/components/Innovation";
import { Navbar } from "@/components/Navbar";
import { TeamCarousel } from "@/components/TeamCarousel";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { TrustStrip } from "@/components/TrustStrip";
import { ResponsiveHero, ResponsiveServices, ResponsiveTestimonials, ResponsiveWhyChooseUs } from "@/components/ResponsiveSections";
import { t } from "@/i18n/translate";

export default function Home() {
  const config = clinicConfig;

  return (
    <div className="site-shell">
      <CursorGlow />
      <div className="relative z-10">
        <Navbar brand={config.brand} nav={config.nav} contact={config.contact} />
        <main>
          <h1 className="sr-only">{t(config.hero.heading, config.i18n?.defaultLocale ?? "de")}</h1>
          <ResponsiveHero hero={config.hero} contact={config.contact} />
          <AnimatedHeroSection animatedHero={config.animatedHero} />
          <TrustStrip trust={config.trust} contact={config.contact} />
          <ResponsiveServices services={config.services} />
          <AboutStats about={config.about} />
          <AppointmentBanner banner={config.appointmentBanner} />
          <TeamCarousel team={config.team} />
          <Innovation innovation={config.innovation} />
          <ResponsiveWhyChooseUs data={config.whyChooseUs} />
          <ResponsiveTestimonials testimonials={config.testimonials} />
          <Faq faq={config.faq} />
          <FinalCta finalCta={config.finalCta} integrations={config.integrations} contact={config.contact} />
        </main>
        <Footer footer={config.footer} contact={config.contact} brand={config.brand} />
        <ClientEffects config={config} />
      </div>
    </div>
  );
}
