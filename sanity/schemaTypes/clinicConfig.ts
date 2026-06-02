import { defineArrayMember, defineField, defineType } from "sanity";

const imageField = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true }
  });

const localeField = (name: string, title?: string) => defineField({ name, title, type: "localeString" });
const linkField = (name: string, title?: string) => defineField({ name, title, type: "linkItem" });
const localeArrayField = (name: string, title?: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "localeString" })] });
const stringArrayField = (name: string, title?: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });

export const clinicConfig = defineType({
  name: "clinicConfig",
  title: "Website content",
  type: "document",
  groups: [
    { name: "general", title: "General & SEO", default: true },
    { name: "brand", title: "Brand & Contact" },
    { name: "header", title: "Header / Nav" },
    { name: "hero", title: "Hero" },
    { name: "services", title: "Services" },
    { name: "about", title: "About / Why us" },
    { name: "team", title: "Team" },
    { name: "testimonials", title: "Testimonials" },
    { name: "faq", title: "FAQ" },
    { name: "appointment", title: "Appointment & CTA" },
    { name: "footer", title: "Footer & Legal" },
    { name: "advanced", title: "Advanced & Effects" }
  ],
  fields: [
    defineField({
      name: "meta",
      title: "SEO / Meta",
      type: "object",
      group: "general",
      fields: [
        localeField("siteTitle"),
        localeField("description"),
        defineField({ name: "siteUrl", type: "url" }),
        imageField("ogImage", "Open Graph image"),
        defineField({ name: "favicon", type: "string" })
      ]
    }),
    defineField({
      name: "brand",
      type: "object",
      group: "brand",
      fields: [
        defineField({ name: "name", type: "string" }),
        localeField("logoText"),
        defineField({ name: "logoIcon", type: "string" }),
        imageField("logoImage"),
        defineField({
          name: "colors",
          type: "object",
          fields: ["primary", "accent", "surface", "white", "text", "textMuted"].map((name) =>
            defineField({ name, type: "string" })
          )
        }),
        defineField({
          name: "fonts",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "body", type: "string" })
          ]
        })
      ]
    }),
    defineField({
      name: "contact",
      type: "object",
      group: "brand",
      fields: [
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "email" }),
        defineField({ name: "address", type: "string" }),
        defineField({ name: "workingHours", type: "array", of: [defineArrayMember({ type: "workingHour" })] })
      ]
    }),
    defineField({
      name: "trust",
      type: "object",
      group: "brand",
      fields: [
        localeField("ratingLabel"),
        defineField({ name: "ratingValue", type: "string" }),
        localeField("reviewCount"),
        localeField("openNowLabel"),
        localeField("sinceLabel"),
        localeArrayField("credentials"),
        linkField("directionsCta")
      ]
    }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "object",
      group: "header",
      fields: [
        defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
        linkField("cta")
      ]
    }),
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [localeField("heading"), localeField("subtitle"), imageField("image"), linkField("cta")]
    }),
    defineField({
      name: "animatedHero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "enabled", type: "boolean" }),
        localeField("eyebrow"),
        localeField("prefix"),
        localeField("suffix"),
        localeArrayField("rotatingWords"),
        localeField("description"),
        linkField("primaryCta"),
        linkField("secondaryCta")
      ]
    }),
    defineField({
      name: "services",
      type: "object",
      group: "services",
      fields: [
        localeField("tag"),
        localeField("heading"),
        localeField("description"),
        linkField("cta"),
        defineField({
          name: "items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                localeField("title"),
                imageField("image", "Photo"),
                defineField({
                  name: "icon",
                  title: "Icon (fallback)",
                  type: "string",
                  description: "Lucide icon key or image URL/path. Only used when no photo is uploaded above."
                }),
                localeField("description"),
                localeArrayField("features"),
                defineField({ name: "href", type: "string" })
              ],
              preview: {
                select: { title: "title.de", media: "image" }
              }
            })
          ]
        })
      ]
    }),
    defineField({
      name: "about",
      type: "object",
      group: "about",
      fields: [
        localeField("tag"),
        localeField("heading"),
        imageField("image"),
        defineField({
          name: "rating",
          type: "object",
          fields: [
            defineField({ name: "value", type: "string" }),
            localeField("label"),
            defineField({ name: "stars", type: "number" })
          ]
        }),
        localeField("badge"),
        defineField({
          name: "stats",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [defineField({ name: "value", type: "string" }), localeField("label")]
            })
          ]
        })
      ]
    }),
    defineField({
      name: "whyChooseUs",
      title: "Why choose us",
      type: "object",
      group: "about",
      fields: [
        localeField("tag"),
        localeField("heading"),
        localeArrayField("intro"),
        localeField("sideText"),
        defineField({
          name: "items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "icon", type: "string" }),
                localeField("title"),
                localeField("text"),
                defineField({ name: "highlight", type: "boolean" })
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: "team",
      type: "object",
      group: "team",
      fields: [
        localeField("tag"),
        localeField("heading"),
        localeField("description"),
        localeArrayField("filters"),
        defineField({
          name: "doctors",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "name", type: "string" }),
                localeField("role"),
                localeField("category"),
                imageField("image")
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: "testimonials",
      type: "object",
      group: "testimonials",
      fields: [
        localeField("tag"),
        localeField("heading"),
        localeField("subheading"),
        defineField({
          name: "items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                localeField("quote"),
                defineField({ name: "name", type: "string" }),
                defineField({ name: "rating", type: "number" }),
                imageField("image"),
                localeField("treatment"),
                localeField("date"),
                defineField({ name: "verified", type: "boolean" })
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      fields: [
        localeField("tag"),
        localeField("heading"),
        imageField("video", "Video thumbnail"),
        linkField("cta"),
        defineField({
          name: "items",
          type: "array",
          of: [defineArrayMember({ type: "object", fields: [localeField("q"), localeField("a")] })]
        })
      ]
    }),
    defineField({
      name: "appointmentBanner",
      title: "Appointment banner",
      type: "object",
      group: "appointment",
      fields: [localeField("heading"), localeField("description"), imageField("image"), linkField("cta")]
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA / Booking form",
      type: "object",
      group: "appointment",
      fields: [
        localeField("heading"),
        localeField("description"),
        defineField({
          name: "form",
          type: "object",
          fields: [
            "nameLabel",
            "phoneLabel",
            "emailLabel",
            "dateLabel",
            "timeLabel",
            "serviceLabel",
            "messageLabel",
            "callbackLabel",
            "privacyConsentLabel",
            "submitLabel",
            "requiredError",
            "invalidEmailError",
            "privacyError",
            "successMessage",
            "errorMessage",
            "loadingLabel",
            "selectPlaceholder",
            "badgePrimary",
            "badgeSecondary"
          ].map((name) => localeField(name))
        })
      ]
    }),
    defineField({
      name: "footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({
          name: "columns",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [localeField("title"), defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "linkItem" })] })]
            })
          ]
        }),
        localeField("wordmark"),
        localeField("copyright")
      ]
    }),
    defineField({
      name: "legal",
      type: "object",
      group: "footer",
      fields: [
        localeField("impressumTitle"),
        localeArrayField("impressumBody"),
        localeField("privacyTitle"),
        localeArrayField("privacyBody")
      ]
    }),
    defineField({
      name: "innovation",
      type: "object",
      group: "advanced",
      fields: [
        defineField({ name: "enabled", type: "boolean" }),
        localeField("eyebrow"),
        localeField("heading"),
        localeField("subheading"),
        localeField("body"),
        defineField({ name: "splineSceneUrl", type: "url" }),
        imageField("fallbackImage")
      ]
    }),
    defineField({
      name: "cookieConsent",
      title: "Cookie consent",
      type: "object",
      group: "advanced",
      fields: [
        defineField({ name: "enabled", type: "boolean" }),
        localeField("message"),
        localeField("acceptLabel"),
        localeField("declineLabel")
      ]
    }),
    defineField({
      name: "integrations",
      type: "object",
      group: "advanced",
      fields: [defineField({ name: "formEndpoint", type: "url" })]
    }),
    defineField({
      name: "effects",
      type: "object",
      group: "advanced",
      fields: [
        "magneticButtons",
        "cursorGlow",
        "auroraBlobs",
        "pointerParallax",
        "spotlightCards",
        "tiltImages",
        "heroParallax",
        "statCountUp",
        "customCursor",
        "reactiveNavbar"
      ].map((name) => defineField({ name, type: "boolean" }))
    }),
    defineField({
      name: "mobile",
      type: "object",
      group: "advanced",
      fields: ["stickyBookingBar", "fullscreenMenu", "showCallButton"].map((name) => defineField({ name, type: "boolean" }))
    }),
    defineField({
      name: "i18n",
      title: "Languages (i18n)",
      type: "object",
      group: "general",
      fields: [
        defineField({ name: "defaultLocale", type: "string", options: { list: ["de", "en"] } }),
        stringArrayField("locales"),
        defineField({
          name: "labels",
          type: "object",
          fields: [
            defineField({ name: "de", type: "string" }),
            defineField({ name: "en", type: "string" })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "brand.name"
    }
  }
});
