import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

export default defineConfig({
  name: "dental-clinic-template",
  title: "Dental Clinic Template",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      name: "presentation",
      title: "Live Preview",
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: "/api/draft-mode",
          disable: "/api/disable-draft"
        }
      }
    })
  ],
  schema: {
    types: schemaTypes
  }
});
