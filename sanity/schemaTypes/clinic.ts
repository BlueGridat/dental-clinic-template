import { defineArrayMember, defineField, defineType } from "sanity";
import { clinicConfigFields, clinicConfigGroups } from "./clinicConfig";

/**
 * One document per clinic demo, served at /<slug>.
 * Contains every clinicConfig key (drop-in replacement for the config) plus flat clinic facts.
 * Rule: only verified facts. Leave a field empty when unknown — the matching section hides.
 */
export const clinic = defineType({
  name: "clinic",
  title: "Clinic demo",
  type: "document",
  groups: [{ name: "clinic", title: "Clinic facts", default: true }, ...clinicConfigGroups.map((g) => ({ ...g, default: false }))],
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      group: "clinic",
      description: "URL path, e.g. dr-mustername-linz → /dr-mustername-linz. Must be unique.",
      options: { source: "clinicName", maxLength: 96, isUnique: (value, context) => context.defaultIsUnique(value, context) },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "clinicName", title: "Clinic name", type: "string", group: "clinic", validation: (rule) => rule.required() }),
    defineField({ name: "doctorNameWithTitle", title: "Doctor (with title)", type: "string", group: "clinic", description: "e.g. Dr. med. dent. Anna Beispiel" }),
    defineField({ name: "city", type: "string", group: "clinic", validation: (rule) => rule.required() }),
    defineField({ name: "district", type: "string", group: "clinic" }),
    defineField({ name: "address", type: "string", group: "clinic", description: "Street, ZIP city (also used for the map if mapQuery is empty)" }),
    defineField({ name: "mapQuery", title: "Google Maps query", type: "string", group: "clinic" }),
    defineField({
      name: "kassenList",
      title: "Kassen (verified only)",
      type: "array",
      group: "clinic",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "e.g. ÖGK, BVAEB, SVS, KFA — or 'Wahlarzt'/'Privat'. Leave empty if unverified."
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      type: "array",
      group: "clinic",
      of: [defineArrayMember({ type: "workingHour" })],
      description: "Overrides contact.workingHours. Empty = hours section hidden."
    }),
    defineField({
      name: "reviews",
      title: "Reviews (real, with source URL)",
      type: "array",
      group: "clinic",
      of: [
        defineArrayMember({
          type: "object",
          name: "review",
          fields: [
            defineField({ name: "author", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "rating", type: "number", validation: (rule) => rule.min(1).max(5) }),
            defineField({ name: "source", type: "string", description: "e.g. Google, DocFinder", validation: (rule) => rule.required() }),
            defineField({ name: "url", type: "url", validation: (rule) => rule.required() })
          ],
          preview: { select: { title: "author", subtitle: "source" } }
        })
      ]
    }),
    defineField({ name: "rating", type: "number", group: "clinic", description: "Average rating from reviewSource (e.g. 4.7). Empty = hidden.", validation: (rule) => rule.min(0).max(5) }),
    defineField({ name: "reviewCount", type: "number", group: "clinic" }),
    defineField({ name: "reviewSource", type: "string", group: "clinic", description: "e.g. Google" }),
    defineField({
      name: "impressum",
      type: "object",
      group: "clinic",
      fields: [
        defineField({ name: "responsible", title: "Medieninhaber / verantwortlich", type: "string" }),
        defineField({ name: "berufsbezeichnung", type: "string" }),
        defineField({ name: "kammer", title: "Kammer (e.g. Landeszahnärztekammer für Oberösterreich)", type: "string" }),
        defineField({ name: "aufsichtsbehoerde", type: "string" }),
        defineField({ name: "uid", title: "UID-Nummer", type: "string" }),
        defineField({ name: "address", type: "string" }),
        defineField({ name: "extra", type: "array", of: [defineArrayMember({ type: "string" })] })
      ]
    }),
    ...clinicConfigFields
  ],
  preview: {
    select: { title: "clinicName", subtitle: "slug.current" }
  }
});
