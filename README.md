# Dental Clinic Landing Page Template

A production-ready, reusable Next.js landing page template for dental clinics. The site is designed so a web agency can reuse the same codebase across clients by managing content in Sanity. `clinicConfig.json` remains as the local fallback when Sanity environment variables are not configured.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

New UI primitives and 3D sections rely on these runtime packages:

- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `@radix-ui/react-slot`
- `@splinetool/react-spline`
- `@splinetool/runtime`

## How To Customize For A New Client

1. Create or select the client's Sanity dataset.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_TOKEN` in `.env.local`.
3. Run the migration script once to seed Sanity from `clinicConfig.json`.
4. Edit content in `/studio`.
5. Change `brand.colors` to re-theme the full site.
6. Change `brand.fonts.heading` and `brand.fonts.body` to load different Google Fonts.
7. Set `meta.siteUrl` to the deployed domain for Open Graph images.
8. Set `integrations.formEndpoint` to a form service URL when available.
9. Tune `effects` and `mobile` flags to enable or disable motion and mobile behavior.
10. Edit `i18n`, `trust`, `legal`, and `cookieConsent` blocks for locale, conversion, and compliance details.

When `integrations.formEndpoint` is empty, the booking form falls back to a `mailto:` link using `contact.email`.

## Services, Testimonials, And Booking

Services live in `services.items`. Each item supports:

- `title`: localized service name.
- `description`: optional localized one-line summary.
- `icon`: either an image path such as `/images/svc-cosmetic.png` or a lucide/icon key such as `sparkles`, `shield-check`, `activity`, `smile`, `baby`, or `tooth`.
- `features`: localized bullet points.
- `href`: usually `#book` for a booking-focused landing page.

Testimonials live in `testimonials.items`. Use real, licensed patient photos before launch. Each testimonial can include `treatment`, `date`, and `verified` to render credibility chips without hardcoding content in components.

The booking form is configured through `finalCta.form`. Labels, helper/error messages, submit text, success/failure text, service dropdown placeholder, and the two header badges are all localized there. Phone is required, email is optional, and the service dropdown is populated from `services.items`.

## Config-Driven Architecture

- Sanity contains all clinic-specific data: metadata, name, colors, fonts, copy, doctors, images, hours, contact details, links, FAQs, testimonials, and integrations.
- `clinicConfig.json` is kept as a fallback for local development and builds without Sanity credentials.
- `src/config/types.ts` defines the full `ClinicConfig` interface.
- `src/config/index.ts` fetches the singleton Sanity document, normalizes Sanity image assets into CDN URL strings, falls back to JSON when needed, builds Google Fonts URLs, and injects CSS custom properties.
- `src/app/layout.tsx` applies theme CSS variables to `:root`, so colors and typography update from CMS data or the JSON fallback.
- Tailwind v4 tokens are bridged in `src/app/globals.css` with `@theme inline`. Config values such as `brand.colors.primary`, `surface`, `white`, `text`, and `textMuted` become runtime CSS vars first, then feed utility tokens like `bg-primary`, `bg-card`, `text-muted-foreground`, `border-border`, and `ring-ring`. This keeps shadcn-compatible primitives in `src/components/ui/` re-themeable from `clinicConfig.json`.
- Section components receive config data through props and do not hardcode clinic-specific values.
- Desktop and mobile use the same config data but can render different layouts. Mobile-specific components live in `src/components/mobile`. Breakpoint-specific hero, services, why-choose-us, and testimonial trees are loaded through client-side dynamic imports so phones do not download desktop-only section code and desktop browsers do not download mobile-only section code.

## Sanity CMS

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

Seed a dataset from the fallback config:

```bash
npx tsx scripts/migrate-to-sanity.ts
```

The app reads one singleton document with `_id: "clinicConfig"` and `_type: "clinicConfig"`. The Studio is embedded at `/studio`. This template expects one Sanity project with one dataset per deployed dental client, selected by `NEXT_PUBLIC_SANITY_DATASET`.

## Motion And Mobile Flags

`clinicConfig.json` includes two optional blocks. If a key is missing, the app uses safe defaults.

```json
"effects": {
  "magneticButtons": true,
  "cursorGlow": true,
  "auroraBlobs": true,
  "pointerParallax": true,
  "spotlightCards": true,
  "tiltImages": true,
  "heroParallax": true,
  "statCountUp": true,
  "customCursor": false,
  "reactiveNavbar": true
},
"mobile": {
  "stickyBookingBar": true,
  "fullscreenMenu": true,
  "showCallButton": true
}
```

Pointer effects automatically disable for coarse pointers and `prefers-reduced-motion: reduce`. The custom cursor is off by default.

## Innovation And Animated Hero

Two opt-in sections are available in `clinicConfig.json`:

- `innovation` renders a dark, brand-colored 3D technology panel. Set `innovation.enabled` to `true`, provide localized `eyebrow`, `heading`, `subheading`, and `body`, and set `fallbackImage` to a client-owned image. Replace `splineSceneUrl` with the client's verified Spline `.splinecode` URL. The current sample URL returns `200`, but agencies should still swap it for a client-approved scene before launch.
- `animatedHero` renders a secondary animated statement with localized rotating words and CTAs. Set `animatedHero.enabled` to `true` and edit `prefix`, `rotatingWords`, `suffix`, `description`, `primaryCta`, and `secondaryCta`.

Both sections ship disabled by default. The Spline scene lazy-loads only after the Innovation panel approaches the viewport, and the fallback image is used for reduced motion, coarse pointers, or Save-Data connections. The animated words render the first word statically when motion is reduced.

## Localization

The default locale is German (`de`) with English (`en`) available through the segmented language toggle. Text fields accept either a plain string or localized objects:

```json
"heading": {
  "de": "Ihr perfektes Lächeln beginnt hier",
  "en": "Your perfect smile starts here"
}
```

Use `i18n.defaultLocale`, `i18n.locales`, and `i18n.labels` to control the toggle. The current implementation is client-side and updates `<html lang>`. For stronger indexable German SEO later, upgrade to locale routes such as `/de` and `/en` with `next-intl`; the `Localized` content model already supports this without content rework.

Metadata currently points hreflang alternates at the canonical root because there are no separate locale routes yet, and the client syncs `<html lang>` after the user switches languages. The recommended routing upgrade is to add `/de` and `/en` App Router segments, move `LocaleProvider` initialization from the route param, and then update `metadata.alternates.languages` to `{ de: "/de", en: "/en", "x-default": "/" }`.

## Trust, Legal, And Consent

- `trust` powers the hero trust strip: Google-style rating, review count, open-now label, credentials, and directions CTA.
- `legal` powers `/impressum` and `/datenschutz` pages. Replace the sample text with legally reviewed Austrian clinic details before launch.
- `cookieConsent` controls the GDPR-style cookie banner.
- `finalCta.form.privacyConsentLabel` controls the booking privacy checkbox.

## Image Swapping

Place client images in `public/images` and update the matching config path. The template ships with placeholders:

- `hero.jpg`
- `about-doctor.jpg`
- `appointment.jpg`
- `dr-austin.jpg`, `dr-fletcher.jpg`, `dr-aysha.jpg`
- `patient-1.jpg`, `patient-2.jpg`
- `faq-video.jpg`
- `svc-cosmetic.png`, `svc-implants.png`, `svc-restorative.png`
- `og.jpg`

Recommended sizes are at least 1200px wide for hero/banner images, 700px wide for doctor photos, and 320px for service icons.

## Sections

The landing page includes:

1. Navbar
2. Responsive hero with parallax cards on desktop and a mobile-native card layout
3. Optional animated hero statement
4. Trust strip
5. Services desktop grid or mobile swipe carousel
6. Stats / expertise
7. Appointment banner
8. Filterable doctor carousel
9. Optional Innovation / Spline panel
10. Why choose us
11. Testimonials desktop grid or mobile swipe carousel
12. FAQ accordion
13. Final CTA booking form
14. Footer

## Notes For Agencies

Keep all client-specific edits in Sanity after migration. The same codebase can be deployed for another clinic by pointing `NEXT_PUBLIC_SANITY_DATASET` at that client's dataset.
