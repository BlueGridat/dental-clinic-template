export type Locale = "de" | "en";
export type Localized<T = string> = T | Partial<Record<Locale, T>>;

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
  trust?: TrustConfig;
  legal?: LegalConfig;
  cookieConsent?: CookieConsentConfig;
  integrations: IntegrationsConfig;
  effects?: EffectsConfig;
  mobile?: MobileConfig;
  i18n?: I18nConfig;
}

export interface MetaConfig {
  siteTitle: Localized;
  description: Localized;
  siteUrl?: string;
  ogImage: string;
  favicon: string;
}

export interface BrandConfig {
  name: string;
  logoText: Localized;
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
  days: Localized;
  hours: string;
}

export interface LinkItem {
  label: Localized;
  href: string;
}

export interface NavConfig {
  links: LinkItem[];
  cta: LinkItem;
}

export interface HeroConfig {
  heading: Localized;
  subtitle: Localized;
  image: string;
  cta: LinkItem;
}

export interface ServicesConfig {
  tag: Localized;
  heading: Localized;
  description: Localized;
  cta: LinkItem;
  items: ServiceItem[];
}

export interface ServiceItem {
  title: Localized;
  icon: string;
  features: Localized[];
  href: string;
}

export interface AboutConfig {
  tag: Localized;
  heading: Localized;
  image: string;
  rating: {
    value: string;
    label: Localized;
    stars: number;
  };
  badge: Localized;
  stats: StatItem[];
}

export interface StatItem {
  value: string;
  label: Localized;
}

export interface AppointmentBannerConfig {
  heading: Localized;
  description: Localized;
  image: string;
  cta: LinkItem;
}

export interface TeamConfig {
  tag: Localized;
  heading: Localized;
  description: Localized;
  filters: Localized[];
  doctors: DoctorItem[];
}

export interface DoctorItem {
  name: string;
  role: Localized;
  category: Localized;
  image: string;
}

export interface WhyChooseUsConfig {
  tag: Localized;
  heading: Localized;
  intro: Localized[];
  sideText: Localized;
  items: WhyChooseUsItem[];
}

export interface WhyChooseUsItem {
  icon: string;
  title: Localized;
  text: Localized;
  highlight: boolean;
}

export interface TestimonialsConfig {
  tag: Localized;
  heading: Localized;
  subheading: Localized;
  items: TestimonialItem[];
}

export interface TestimonialItem {
  quote: Localized;
  name: string;
  rating: number;
  image: string;
}

export interface FaqConfig {
  tag: Localized;
  heading: Localized;
  video: string;
  cta: LinkItem;
  items: FaqItem[];
}

export interface FaqItem {
  q: Localized;
  a: Localized;
}

export interface FinalCtaConfig {
  heading: Localized;
  description: Localized;
  form: {
    nameLabel: Localized;
    phoneLabel: Localized;
    emailLabel?: Localized;
    callbackLabel?: Localized;
    privacyConsentLabel?: Localized;
    submitLabel: Localized;
  };
}

export interface FooterConfig {
  columns: FooterColumn[];
  wordmark: Localized;
  copyright: Localized;
}

export interface FooterColumn {
  title: Localized;
  links: LinkItem[];
}

export interface IntegrationsConfig {
  formEndpoint: string;
}

export interface EffectsConfig {
  magneticButtons?: boolean;
  cursorGlow?: boolean;
  auroraBlobs?: boolean;
  pointerParallax?: boolean;
  spotlightCards?: boolean;
  tiltImages?: boolean;
  heroParallax?: boolean;
  statCountUp?: boolean;
  customCursor?: boolean;
  reactiveNavbar?: boolean;
}

export interface MobileConfig {
  stickyBookingBar?: boolean;
  fullscreenMenu?: boolean;
  showCallButton?: boolean;
}

export interface I18nConfig {
  defaultLocale?: Locale;
  locales?: Locale[];
  labels?: Partial<Record<Locale, string>>;
}

export interface TrustConfig {
  ratingLabel?: Localized;
  ratingValue?: string;
  reviewCount?: Localized;
  openNowLabel?: Localized;
  sinceLabel?: Localized;
  credentials?: Localized[];
  directionsCta?: LinkItem;
}

export interface LegalConfig {
  impressumTitle?: Localized;
  impressumBody?: Localized[];
  privacyTitle?: Localized;
  privacyBody?: Localized[];
}

export interface CookieConsentConfig {
  enabled?: boolean;
  message?: Localized;
  acceptLabel?: Localized;
  declineLabel?: Localized;
}
