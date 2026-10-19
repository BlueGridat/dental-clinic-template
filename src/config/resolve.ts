import type { ClinicConfig, LinkItem, Localized, TestimonialItem, WorkingHour } from "./types";

type Obj = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Obj => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Recursively drop null / undefined so "unknown" never overrides a base value. */
function stripNulls<T>(value: T): T {
  if (Array.isArray(value)) return value.filter((v) => v != null).map((v) => stripNulls(v)) as T;
  if (!isPlainObject(value)) return value;
  const out: Obj = {};
  for (const [key, child] of Object.entries(value)) {
    if (child == null) continue;
    out[key] = stripNulls(child);
  }
  return out as T;
}

const isLocalizedValue = (value: Obj) => Object.keys(value).length > 0 && Object.keys(value).every((k) => k === "de" || k === "en" || k === "_type");

/** Deep merge: objects merge, arrays, primitives and localized {de,en} values from `override` replace `base`. */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override) || isLocalizedValue(override)) return (override === undefined ? base : override) as T;
  const out: Obj = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = key in out ? deepMerge(out[key], value) : value;
  }
  return out as T;
}

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const L = (de: string, en?: string): Localized => ({ de, en: en ?? de });

export function slugOf(config: Pick<ClinicConfig, "slug"> | null | undefined): string | undefined {
  const slug = config?.slug;
  if (!slug) return undefined;
  return typeof slug === "string" ? slug : slug.current;
}

export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** The query used for the Google Maps embed / directions link (null = hide). */
export function mapQueryOf(config: ClinicConfig): string | null {
  const q = config.mapQuery || config.contact?.address || config.address;
  return nonEmpty(q) ? q : null;
}

/** A link is "live" when it is not an empty / bare "#" anchor. */
function isLiveHref(href?: string) {
  return nonEmpty(href) && href !== "#";
}

/**
 * Turn a (partial) clinic document into a complete ClinicConfig by layering it on top of the
 * base config, then deriving trust/rating/reviews/team/legal/nav from the flat clinic fields.
 * Never invents facts: anything missing stays empty and its section hides.
 */
export function resolveClinicConfig(base: ClinicConfig, doc?: Partial<ClinicConfig> | null, opts: { basePath?: string; isClinicDemo?: boolean } = {}): ClinicConfig {
  const clean = stripNulls((doc ?? {}) as Obj) as Partial<ClinicConfig>;
  const c = deepMerge(base, clean) as ClinicConfig;
  const isClinic = Boolean(doc && (clean.slug || clean.clinicName));
  const basePath = opts.basePath ?? "";
  c.basePath = basePath;
  c.isClinicDemo = opts.isClinicDemo ?? isClinic;

  const city = nonEmpty(clean.city) ? clean.city : null;
  const district = nonEmpty(clean.district) ? clean.district : null;
  const doctor = nonEmpty(clean.doctorNameWithTitle) ? clean.doctorNameWithTitle : null;
  const name = clean.brand?.name || clean.clinicName || (doctor ? `Ordination ${doctor}` : base.brand.name);
  const place = city ? (district ? `${city}-${district}` : city) : null;

  // ---- Brand / meta ----
  if (isClinic) {
    c.brand = { ...c.brand, name };
    if (!clean.brand?.logoText) c.brand.logoText = L(name);
    if (!clean.footer?.wordmark) c.footer = { ...c.footer, wordmark: L(name) };
    if (!clean.footer?.copyright) c.footer = { ...c.footer, copyright: L(`© ${new Date().getFullYear()} ${name}`, `© ${new Date().getFullYear()} ${name}`) };
    if (!clean.meta?.siteTitle) {
      c.meta = { ...c.meta, siteTitle: L(`Ordination ${doctor ?? name}${city ? ` | Zahnarzt in ${city}` : ""}`, `${doctor ?? name}${city ? ` | Dentist in ${city}` : ""}`) };
    }
    if (!clean.meta?.description) {
      c.meta = {
        ...c.meta,
        description: L(
          `${name}${doctor && !name.includes(doctor) ? ` – ${doctor}` : ""}${place ? `, Zahnarztpraxis in ${place}` : ""}. Leistungen, Öffnungszeiten, Kontakt und Terminanfrage.`,
          `${name}${place ? `, dental practice in ${place}` : ""}. Services, opening hours, contact and appointment requests.`
        )
      };
    }
    if (!clean.hero?.subtitle) {
      c.hero = {
        ...c.hero,
        subtitle: L(
          `${doctor ? `Ordination ${doctor}` : name}${place ? ` in ${place}` : ""}: Wir nehmen uns Zeit, erklären jeden Schritt verständlich und planen Behandlungen erst, wenn Sie sich sicher fühlen.`,
          `${doctor ? `The practice of ${doctor}` : name}${place ? ` in ${place}` : ""}: we take time, explain each step clearly, and only plan treatment once you feel ready.`
        )
      };
    }
  }

  // ---- Contact / hours ----
  c.contact = { ...{ phone: "", email: "", address: "", workingHours: [] as WorkingHour[] }, ...(c.contact ?? {}) };
  if (!nonEmpty(c.contact.address) && nonEmpty(clean.address)) c.contact.address = clean.address;
  if (Array.isArray(clean.openingHours) && clean.openingHours.length) c.contact.workingHours = clean.openingHours as WorkingHour[];
  c.contact.workingHours = (c.contact.workingHours ?? []).filter((h) => h && nonEmpty(h.hours));

  // ---- Rating (only real, sourced values) ----
  const trust = { ...(c.trust ?? {}) };
  if (typeof clean.rating === "number" && clean.rating > 0) {
    const value = `${String(clean.rating).replace(".", ",")}/5`;
    const source = clean.reviewSource || "";
    trust.ratingValue = value;
    trust.ratingLabel = source ? L(`${source} Bewertung`, `${source} rating`) : L("Bewertung", "Rating");
    trust.reviewCount = typeof clean.reviewCount === "number" ? L(`${clean.reviewCount} Bewertungen`, `${clean.reviewCount} reviews`) : null;
    c.about = { ...c.about, rating: { value, label: trust.ratingLabel, stars: Math.round(clean.rating) } };
  } else if (isClinic && !clean.trust?.ratingValue) {
    trust.ratingValue = null;
    trust.ratingLabel = null;
    trust.reviewCount = null;
    if (!clean.about?.rating) c.about = { ...c.about, rating: null };
  }
  if (!nonEmpty(trust.ratingValue)) {
    trust.ratingValue = null;
    trust.reviewCount = null;
  }
  if (!c.about?.rating?.value) c.about = { ...c.about, rating: null };

  // ---- Directions / map ----
  const mapQuery = mapQueryOf(c);
  trust.directionsCta = {
    label: trust.directionsCta?.label || L("Route planen", "Get directions"),
    href: isLiveHref(trust.directionsCta?.href) ? (trust.directionsCta?.href as string) : mapQuery ? mapsSearchUrl(mapQuery) : ""
  };
  if (!c.contact.workingHours.length) trust.openNowLabel = null;
  // Template "credentials" are marketing claims; a real clinic only shows its own.
  if (isClinic && !clean.trust?.credentials?.length) trust.credentials = [];
  if (isClinic && !clean.trust?.sinceLabel) trust.sinceLabel = null;
  c.trust = trust;

  // ---- Reviews: only items with a source URL are ever rendered ----
  if (Array.isArray(clean.reviews)) {
    c.testimonials = {
      ...c.testimonials,
      items: clean.reviews
        .filter((r) => r && nonEmpty(r.text) && nonEmpty(r.author) && nonEmpty(r.url))
        .map<TestimonialItem>((r) => ({ name: r.author, quote: r.text, rating: typeof r.rating === "number" ? r.rating : 0, image: "", sourceLabel: r.source, sourceUrl: r.url, verified: false }))
    };
  }
  c.testimonials = { ...c.testimonials, items: (c.testimonials?.items ?? []).filter((item) => nonEmpty(item.sourceUrl)) };

  // ---- Team ----
  const doctors = (c.team?.doctors ?? []).filter((d) => d && nonEmpty(d.name));
  if (!doctors.length && doctor) doctors.push({ name: doctor, role: L("Zahnmedizin", "Dentistry"), category: L(""), image: "" });
  c.team = { ...c.team, doctors, filters: doctors.length > 1 ? c.team?.filters ?? [] : [] };

  // ---- Kassen ----
  c.kassenList = (clean.kassenList ?? c.kassenList ?? []).filter(nonEmpty);

  // ---- Impressum (structured, only verified lines) ----
  if (isClinic && !clean.legal?.impressumBody?.length) {
    const imp = clean.impressum ?? {};
    const lines: string[] = [];
    lines.push(`Medieninhaber und für den Inhalt verantwortlich: ${imp.responsible || doctor || name}${name && name !== (imp.responsible || doctor) ? `, ${name}` : ""}`);
    const addr = imp.address || c.contact.address;
    if (nonEmpty(addr)) lines.push(`Anschrift: ${addr}`);
    const contactBits = [c.contact.phone && `Tel. ${c.contact.phone}`, c.contact.email && `E-Mail: ${c.contact.email}`].filter(Boolean);
    if (contactBits.length) lines.push(contactBits.join(" · "));
    if (nonEmpty(imp.berufsbezeichnung)) lines.push(`Berufsbezeichnung: ${imp.berufsbezeichnung}`);
    if (nonEmpty(imp.kammer)) lines.push(`Kammerzugehörigkeit: ${imp.kammer}`);
    if (nonEmpty(imp.aufsichtsbehoerde)) lines.push(`Aufsichtsbehörde: ${imp.aufsichtsbehoerde}`);
    if (nonEmpty(imp.uid)) lines.push(`UID-Nummer: ${imp.uid}`);
    lines.push("Berufsrechtliche Vorschriften: Zahnärztegesetz (ZÄG), abrufbar unter www.ris.bka.gv.at");
    for (const extra of imp.extra ?? []) if (nonEmpty(extra)) lines.push(extra);
    lines.push("Hinweis: Diese Seite ist eine nicht öffentliche Demo-Vorschau von BlueGrid (bluegrid.at). Alle Angaben stammen aus öffentlich zugänglichen Verzeichnissen und werden vor einer Veröffentlichung mit der Ordination abgestimmt.");
    c.legal = { ...c.legal, impressumBody: lines.map((line) => L(line)) };
  }

  // ---- Navigation & footer: only links to sections/pages that exist ----
  const hasDoctors = c.team.doctors.length > 0;
  const hasReviews = c.testimonials.items.length > 0;
  const hasServices = (c.services?.items ?? []).length > 0;
  const sectionExists = (href: string) => {
    if (href === "#doctors") return hasDoctors;
    if (href === "#reviews") return hasReviews;
    if (href === "#services") return hasServices;
    if (href === "#pricing") return false;
    return true;
  };
  const fixLink = (link: LinkItem): LinkItem => {
    const href = link.href === "/impressum" || link.href === "/datenschutz" ? `${basePath}${link.href}` : link.href;
    return { ...link, href };
  };
  const okLink = (link: LinkItem) => link && isLiveHref(link.href) && sectionExists(link.href);

  c.nav = { ...c.nav, homeHref: basePath || "/", links: (c.nav?.links ?? []).filter(okLink).map(fixLink) };

  const hasCustomFooter = Array.isArray(clean.footer?.columns) && clean.footer.columns.length > 0;
  const columns = hasCustomFooter
    ? c.footer.columns
    : [
        {
          title: L("Praxis", "Practice"),
          links: [
            { label: L("Über uns", "About us"), href: "#about" },
            { label: L("Unser Team", "Our team"), href: "#doctors" },
            { label: L("Bewertungen", "Reviews"), href: "#reviews" },
            { label: L("Kontakt & Anfahrt", "Contact & directions"), href: "#contacts" }
          ]
        },
        {
          title: L("Leistungen", "Services"),
          links: (c.services?.items ?? []).slice(0, 4).map((item) => ({ label: item.title, href: "#services" }))
        },
        {
          title: L("Rechtliches", "Legal"),
          links: [
            { label: L("Impressum", "Legal notice"), href: "/impressum" },
            { label: L("Datenschutz", "Privacy policy"), href: "/datenschutz" }
          ]
        }
      ];
  c.footer = {
    ...c.footer,
    columns: columns.map((col) => ({ ...col, links: (col.links ?? []).filter(okLink).map(fixLink) })).filter((col) => col.links.length > 0)
  };

  if (c.faq?.cta && !isLiveHref(c.faq.cta.href)) c.faq = { ...c.faq, cta: { ...c.faq.cta, href: "#book" } };

  return c;
}
