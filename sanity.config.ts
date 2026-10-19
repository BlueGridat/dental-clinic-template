import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool, type StructureResolver } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

// Public identifiers: safe as code defaults so /studio works without Vercel env vars.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvyxwo8y";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const previewUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://dental-clinic-template-psi.vercel.app");

// "Clinic demos" lists one document per clinic (served at /<slug>);
// "Website content" is the legacy singleton used as fallback for "/".
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("clinic").title("Clinic demos"),
      S.divider(),
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
          // No secret in code: /api/draft refuses unless SANITY_PREVIEW_SECRET is set on the server.
          enable: "/api/draft",
          disable: "/api/disable-draft"
        }
      }
    })
  ],
  schema: {
    types: schemaTypes
  }
});
