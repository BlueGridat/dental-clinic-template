export interface ClinicConfig {
  meta: MetaConfig;
  brand: BrandConfig;
  contact: ContactConfig;
  nav: NavConfig;
  hero: HeroConfig;
  services: ServicesConfig;
  about: AboutConfig;
  appointmentBanner: AppointmentBannerConfig;
  team: TeamConfig;
  whyChooseUs: WhyChooseUsConfig;
  testimonials: TestimonialsConfig;
  faq: FaqConfig;
  finalCta: FinalCtaConfig;
  footer: FooterConfig;
  integrations: IntegrationsConfig;
}

export interface MetaConfig {
  siteTitle: string;
  description: string;
  siteUrl?: string;
  ogImage: string;
  favicon: string;
}

export interface BrandConfig {
  name: string;
  logoText: string;
  logoIcon: string;
  logoImage: string;
  colors: {
    primary: string;
    accent: string;
    surface: string;
    white: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface ContactConfig {
  phone: string;
  email: string;
  address: string;
  workingHours: WorkingHour[];
}

export interface WorkingHour {
  days: string;
  hours: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface NavConfig {
  links: LinkItem[];
  cta: LinkItem;
}

export interface HeroConfig {
  heading: string;
  subtitle: string;
  image: string;
  cta: LinkItem;
}

export interface ServicesConfig {
  tag: string;
  heading: string;
  description: string;
  cta: LinkItem;
  items: ServiceItem[];
}

export interface ServiceItem {
  title: string;
  icon: string;
  features: string[];
  href: string;
}

export interface AboutConfig {
  tag: string;
  heading: string;
  image: string;
  rating: {
    value: string;
    label: string;
    stars: number;
  };
  badge: string;
  stats: StatItem[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AppointmentBannerConfig {
  heading: string;
  description: string;
  image: string;
  cta: LinkItem;
}

export interface TeamConfig {
  tag: string;
  heading: string;
  description: string;
  filters: string[];
  doctors: DoctorItem[];
}

export interface DoctorItem {
  name: string;
  role: string;
  category: string;
  image: string;
}

export interface WhyChooseUsConfig {
  tag: string;
  heading: string;
  intro: string[];
  sideText: string;
  items: WhyChooseUsItem[];
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  text: string;
  highlight: boolean;
}

export interface TestimonialsConfig {
  tag: string;
  heading: string;
  subheading: string;
  items: TestimonialItem[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  rating: number;
  image: string;
}

export interface FaqConfig {
  tag: string;
  heading: string;
  video: string;
  cta: LinkItem;
  items: FaqItem[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FinalCtaConfig {
  heading: string;
  description: string;
  form: {
    nameLabel: string;
    phoneLabel: string;
    submitLabel: string;
  };
}

export interface FooterConfig {
  columns: FooterColumn[];
  wordmark: string;
  copyright: string;
}

export interface FooterColumn {
  title: string;
  links: LinkItem[];
}

export interface IntegrationsConfig {
  formEndpoint: string;
}
