# Dental Clinic Landing Page Template

A production-ready, reusable Next.js landing page template for dental clinics. The site is designed so a web agency can reuse the same codebase across clients by editing only `clinicConfig.json` and replacing files in `public/images`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How To Customize For A New Client

1. Edit `clinicConfig.json`.
2. Replace image files in `public/images` with the client's real assets.
3. Keep image paths in config pointed at `/images/...`.
4. Change `brand.colors` to re-theme the full site.
5. Change `brand.fonts.heading` and `brand.fonts.body` to load different Google Fonts.
6. Set `meta.siteUrl` to the deployed domain for Open Graph images.
7. Set `integrations.formEndpoint` to a form service URL when available.
8. Tune `effects` and `mobile` flags to enable or disable motion and mobile behavior.
9. Edit `i18n`, `trust`, `legal`, and `cookieConsent` blocks for locale, conversion, and compliance details.

When `integrations.formEndpoint` is empty, the booking form falls back to a `mailto:` link using `contact.email`.

## Config-Driven Architecture

- `clinicConfig.json` contains all clinic-specific data: metadata, name, colors, fonts, copy, doctors, images, hours, contact details, links, FAQs, testimonials, and integrations.
- `src/config/types.ts` defines the full `ClinicConfig` interface.
- `src/config/index.ts` imports and type-checks the JSON, builds Google Fonts URLs, and injects CSS custom properties.
- `src/app/layout.tsx` applies theme CSS variables to `:root`, so colors and typography update from JSON.
- Section components receive config data through props and do not hardcode clinic-specific values.
- Desktop and mobile use the same config data but can render different layouts. Mobile-specific components live in `src/components/mobile`.

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

## Localization

The default locale is German (`de`) with English (`en`) available through the segmented language toggle. Text fields accept either a plain string or localized objects:

```json
"heading": {
  "de": "Ihr perfektes Lächeln beginnt hier",
  "en": "Your perfect smile starts here"
}
```

Use `i18n.defaultLocale`, `i18n.locales`, and `i18n.labels` to control the toggle. The current implementation is client-side and updates `<html lang>`. For stronger indexable German SEO later, upgrade to locale routes such as `/de` and `/en` with `next-intl`; the `Localized` content model already supports this without content rework.

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
2. Desktop hero with parallax cards and mobile hero with image overlay
3. Services desktop grid and mobile swipe carousel
4. Stats / expertise
5. Appointment banner
6. Filterable doctor carousel
7. Why choose us
8. Testimonials desktop grid and mobile swipe carousel
9. FAQ accordion
10. Final CTA booking form
11. Footer

## Notes For Agencies

Keep all client-specific edits in `clinicConfig.json` and `public/images`. The same codebase can be deployed for another clinic by replacing those assets and config values only.
