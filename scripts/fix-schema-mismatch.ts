/**
 * Fix script for Sanity schema/data mismatches
 * 
 * This script resolves validation errors caused by:
 * 1. services.items[].icon having image objects where strings are expected
 * 2. brand.logoImage having a string where an image object is expected
 * 3. Any other empty strings in image fields
 * 
 * Run with: npm run fix-schema
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvyxwo8y";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "dentist-template";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN. Please set it in your .env.local file.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false
});

async function fixSchemaMismatch() {
  console.log("Fetching current clinicConfig document...\n");

  const doc = await client.fetch<any>('*[_id == "clinicConfig"][0]');

  if (!doc) {
    console.error("❌ No clinicConfig document found!");
    return;
  }

  console.log("✓ Document found. Analyzing structure...\n");

  let fixCount = 0;

  // ─────────────────────────────────────────────────────────────────
  // FIX 1: services.items[].icon — image objects → strings
  // Schema defines icon as type "string" but migration uploaded
  // /images/svc-*.png paths as Sanity image objects
  // ─────────────────────────────────────────────────────────────────

  if (doc.services?.items && Array.isArray(doc.services.items)) {
    doc.services.items.forEach((item: any, index: number) => {
      if (item.icon && typeof item.icon === "object" && item.icon._type === "image") {
        // Convert image object back to a string icon name
        // We'll use the original icon paths from clinicConfig.json
        const iconMap: Record<string, string> = {
          "image-e175b33577d35e3a1dd688333c340896a3145a3d-320x320-png": "/images/svc-restorative.png",
          "image-62c3efabc686c114682a29ee9494a1fd3ead10bf-320x320-png": "/images/svc-implants.png",
          "image-be70d06556f28447bbc392d5c2695573920080b7-320x320-png": "/images/svc-cosmetic.png",
        };

        const ref = item.icon.asset?._ref || "";
        const fallback = iconMap[ref] || "/images/placeholder.jpg";

        console.log(`🔧 Fix: services.items[${index}].icon`);
        console.log(`   Title: ${item.title?.en || item.title?.de || "unknown"}`);
        console.log(`   From: image object (${ref})`);
        console.log(`   To:   "${fallback}"`);
        console.log("");

        item.icon = fallback;
        fixCount++;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX 2: brand.logoImage — empty string → null
  // Schema defines logoImage as type "image" (object)
  // but data might have empty string ""
  // ─────────────────────────────────────────────────────────────────

  if (doc.brand && typeof doc.brand.logoImage === "string") {
    console.log(`🔧 Fix: brand.logoImage`);
    console.log(`   From: "${doc.brand.logoImage}" (string)`);
    console.log(`   To:   null (valid for image type)`);
    console.log("");

    doc.brand.logoImage = undefined; // Remove field entirely
    fixCount++;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX 3: Check other image fields for empty strings
  // ─────────────────────────────────────────────────────────────────

  const imageFieldPaths = [
    { path: ["meta", "ogImage"], label: "meta.ogImage" },
    { path: ["hero", "image"], label: "hero.image" },
    { path: ["about", "image"], label: "about.image" },
    { path: ["appointmentBanner", "image"], label: "appointmentBanner.image" },
    { path: ["faq", "video"], label: "faq.video" },
    { path: ["innovation", "fallbackImage"], label: "innovation.fallbackImage" },
  ];

  for (const { path, label } of imageFieldPaths) {
    let current: any = doc;
    for (const part of path) {
      if (current && typeof current === "object") {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === "string") {
      console.log(`🔧 Fix: ${label}`);
      console.log(`   From: "${current}" (string)`);
      console.log(`   To:   null (valid for image type)`);
      console.log("");

      // Navigate to parent and set to undefined
      let parent: any = doc;
      for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]];
      }
      delete parent[path[path.length - 1]];
      fixCount++;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX 4: Check team doctors and testimonials for string images
  // ─────────────────────────────────────────────────────────────────

  if (doc.team?.doctors && Array.isArray(doc.team.doctors)) {
    doc.team.doctors.forEach((doctor: any, index: number) => {
      if (typeof doctor.image === "string") {
        console.log(`🔧 Fix: team.doctors[${index}].image`);
        console.log(`   From: "${doctor.image}" (string)`);
        console.log(`   To:   null`);
        console.log("");
        delete doctor.image;
        fixCount++;
      }
    });
  }

  if (doc.testimonials?.items && Array.isArray(doc.testimonials.items)) {
    doc.testimonials.items.forEach((item: any, index: number) => {
      if (typeof item.image === "string") {
        console.log(`🔧 Fix: testimonials.items[${index}].image`);
        console.log(`   From: "${item.image}" (string)`);
        console.log(`   To:   null`);
        console.log("");
        delete item.image;
        fixCount++;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // APPLY FIXES
  // ─────────────────────────────────────────────────────────────────

  if (fixCount === 0) {
    console.log("✓ No schema mismatches found. Document structure is valid.");
    return;
  }

  console.log(`\n📝 Applying ${fixCount} fix(es) to Sanity...\n`);

  // Remove internal Sanity fields before writing
  const { _createdAt, _updatedAt, _rev, ...cleanDoc } = doc;

  await client.createOrReplace({
    ...cleanDoc,
    _id: "clinicConfig",
    _type: "clinicConfig"
  });

  console.log("✅ All fixes applied successfully!\n");
  console.log("Next steps:");
  console.log("1. Open Sanity Studio");
  console.log("2. Refresh the page (Ctrl+Shift+R)");
  console.log("3. Verify there are no validation errors");
  console.log("4. Click 'Publish' if needed");
}

fixSchemaMismatch().catch((error) => {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
});
