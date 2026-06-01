import { defineField, defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "de", title: "German", type: "text", rows: 2 }),
    defineField({ name: "en", title: "English", type: "text", rows: 2 })
  ]
});
