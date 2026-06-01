import { defineArrayMember, defineField, defineType } from "sanity";

export const linkItem = defineType({
  name: "linkItem",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "localeString" }),
    defineField({ name: "href", type: "string" })
  ]
});

export const workingHour = defineType({
  name: "workingHour",
  title: "Working hour",
  type: "object",
  fields: [
    defineField({ name: "days", type: "localeString" }),
    defineField({ name: "hours", type: "string" })
  ]
});

export const localizedStringArray = defineType({
  name: "localizedStringArray",
  title: "Localized text list",
  type: "array",
  of: [defineArrayMember({ type: "localeString" })]
});
