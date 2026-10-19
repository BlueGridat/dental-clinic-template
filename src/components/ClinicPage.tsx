import type { ClinicConfig } from "@/config/types";
import { getGoogleFontUrl, getThemeCss } from "@/config";
import { ConfigProvider } from "@/config/ConfigProvider";
import { AboutStats } from "@/components/AboutStats";
import { AnimatedHeroSection } from "@/components/AnimatedHeroSection";
import { AppointmentBanner } from "@/components/AppointmentBanner";
import { ClientEffects } from "@/components/ClientEffects";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Innovation } from "@/components/Innovation";
import { KassenStrip } from "@/components/KassenStrip";
import { MapEmbed } from "@/components/MapEmbed";
import { Navbar } from "@/components/Navbar";
import { TeamCarousel } from "@/components/TeamCarousel";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { TrustStrip } from "@/components/TrustStrip";
import { ResponsiveHero, ResponsiveServices, ResponsiveTestimonials, ResponsiveWhyChooseUs } from "@/components/ResponsiveSections";
import { mapQueryOf } from "@/config/resolve";
import { t } from "@/i18n/translate";

/**
 * Renders the full landing page for one resolved clinic config.
 * `scopedTheme` re-applies brand colours/fonts for per-clinic pages (the root layout themes "/").
 */
export function ClinicPage({ config, scopedTheme = false }: { config: ClinicConfig; scopedTheme?: boolean }) {
  const mapQuery = mapQueryOf(config);
  return (
    <ConfigProvider config={config}>
      {scopedTheme ? (
        <>
          {/* React 19 hoists stylesheet links with a precedence into <head>. */}
          <link rel="stylesheet" href={getGoogleFontUrl(config)} precedence="default" />
          <style dangerouslySetInnerHTML={{ __html: getThemeCss(config) }} />
        </>
      ) : null}
      <div className="site-shell">
        <CursorGlow />
        <div className="relative z-10">
          <Navbar brand={config.brand} nav={config.nav} contact={config.contact} />
          <main>
            <h1 className="sr-only">{t(config.hero.heading, config.i18n?.defaultLocale ?? "de")}</h1>
            <ResponsiveHero hero={config.hero} contact={config.contact} />
            <AnimatedHeroSection animatedHero={config.animatedHero} />
            <TrustStrip trust={config.trust} contact={config.contact} kassenList={config.kassenList ?? []} />
            <ResponsiveServices services={config.services} />
            <AboutStats about={config.about} />
            <AppointmentBanner banner={config.appointmentBanner} />
            <TeamCarousel team={config.team} />
            <Innovation innovation={config.innovation} />
            <ResponsiveWhyChooseUs data={config.whyChooseUs} />
            <ResponsiveTestimonials testimonials={config.testimonials} />
            <Faq faq={config.faq} />
            <KassenStrip kassenList={config.kassenList ?? []} />
            {mapQuery ? <MapEmbed query={mapQuery} address={config.contact.address} /> : null}
            <FinalCta finalCta={config.finalCta} integrations={config.integrations} contact={config.contact} services={config.services} />
          </main>
          <Footer footer={config.footer} contact={config.contact} brand={config.brand} />
          <ClientEffects config={config} />
        </div>
      </div>
    </ConfigProvider>
  );
}
