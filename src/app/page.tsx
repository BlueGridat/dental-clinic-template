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

export default function Home() {
  const config = clinicConfig;

  return (
    <div className="site-shell">
      <Navbar brand={config.brand} nav={config.nav} />
      <main>
        <Hero hero={config.hero} contact={config.contact} />
        <Services services={config.services} />
        <AboutStats about={config.about} />
        <AppointmentBanner banner={config.appointmentBanner} />
        <TeamCarousel team={config.team} />
        <WhyChooseUs data={config.whyChooseUs} />
        <Testimonials testimonials={config.testimonials} />
        <Faq faq={config.faq} />
        <FinalCta finalCta={config.finalCta} integrations={config.integrations} contact={config.contact} />
      </main>
      <Footer footer={config.footer} contact={config.contact} brand={config.brand} />
    </div>
  );
}
