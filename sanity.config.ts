import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool, type StructureResolver } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const previewUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

// Expose the single clinicConfig document as a clean "Website content" singleton
// instead of a document-type list (no "create new" clutter).
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Website content")
        .id("clinicConfig")
        .child(S.document().schemaType("clinicConfig").documentId("clinicConfig"))
    ]);

export default defineConfig({
  name: "dental-clinic-template",
  title: "Dental Clinic Template",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      name: "presentation",
      title: "Live Preview",
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: "/api/draft-mode?secret=my-preview-secret-123",
          disable: "/api/disable-draft"
        }
      }
    })
  ],
  schema: {
    types: schemaTypes
  }
});
