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

When `integrations.formEndpoint` is empty, the booking form falls back to a `mailto:` link using `contact.email`.

## Config-Driven Architecture

- `clinicConfig.json` contains all clinic-specific data: metadata, name, colors, fonts, copy, doctors, images, hours, contact details, links, FAQs, testimonials, and integrations.
- `src/config/types.ts` defines the full `ClinicConfig` interface.
- `src/config/index.ts` imports and type-checks the JSON, builds Google Fonts URLs, and injects CSS custom properties.
- `src/app/layout.tsx` applies theme CSS variables to `:root`, so colors and typography update from JSON.
- Section components receive config data through props and do not hardcode clinic-specific values.

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
2. Hero with working-hours card and live clock
3. Services
4. Stats / expertise
5. Appointment banner
6. Filterable doctor carousel
7. Why choose us
8. Testimonials
9. FAQ accordion
10. Final CTA booking form
11. Footer

## Notes For Agencies

Keep all client-specific edits in `clinicConfig.json` and `public/images`. The same codebase can be deployed for another clinic by replacing those assets and config values only.
