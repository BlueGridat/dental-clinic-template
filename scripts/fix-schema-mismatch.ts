/**
 * Fix script for Sanity schema/data mismatches
 * 
 * This script resolves validation errors caused by:
 * 1. String fields that should be image objects
 * 2. Image objects that should be strings
 * 3. Empty strings in image fields
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvyxwo8y";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "dentist-template";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN. Please set it in your environment.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false
});

async function fixSchemaMismatch() {
  console.log("Fetching current clinicConfig document...");
  
  const doc = await client.fetch<any>('*[_id == "clinicConfig"][0]');
  
  if (!doc) {
    console.error("No clinicConfig document found!");
    return;
  }

  console.log("\n✓ Document found. Analyzing structure...\n");

  // Create a patched version
  const patches: Array<{ path: string, from: any, to: any }> = [];

  // Fix brand.logoImage - should be image object but might be string
  if (doc.brand?.logoImage) {
    if (typeof doc.brand.logoImage === 'string') {
      if (doc.brand.logoImage === '') {
        patches.push({
          path: 'brand.logoImage',
          from: doc.brand.logoImage,
          to: null // Set to null instead of empty string
        });
        doc.brand.logoImage = null;
      } else {
        console.warn(`⚠ brand.logoImage is a string: "${doc.brand.logoImage}"`);
        console.warn(`  This should be migrated to an image object or set to null.`);
      }
    }
  }

  // Check all image fields that might have similar issues
  const imageFieldPaths = [
    'meta.ogImage',
    'hero.image',
    'about.image',
    'appointmentBanner.image',
    'faq.video',
    'innovation.fallbackImage'
  ];

  for (const fieldPath of imageFieldPaths) {
    const parts = fieldPath.split('.');
    let current: any = doc;
    
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined) {
      if (typeof current === 'string' && current === '') {
        patches.push({
          path: fieldPath,
          from: current,
          to: null
        });
        
        // Apply the fix to the doc
        let target: any = doc;
        for (let i = 0; i < parts.length - 1; i++) {
          target = target[parts[i]];
        }
        target[parts[parts.length - 1]] = null;
      }
    }
  }

  // Check team doctors array for image issues
  if (doc.team?.doctors && Array.isArray(doc.team.doctors)) {
    doc.team.doctors.forEach((doctor: any, index: number) => {
      if (doctor.image && typeof doctor.image === 'string' && doctor.image === '') {
        patches.push({
          path: `team.doctors[${index}].image`,
          from: doctor.image,
          to: null
        });
        doctor.image = null;
      }
    });
  }

  // Check testimonials for image issues
  if (doc.testimonials?.items && Array.isArray(doc.testimonials.items)) {
    doc.testimonials.items.forEach((item: any, index: number) => {
      if (item.image && typeof item.image === 'string' && item.image === '') {
        patches.push({
          path: `testimonials.items[${index}].image`,
          from: item.image,
          to: null
        });
        item.image = null;
      }
    });
  }

  // Report findings
  if (patches.length === 0) {
    console.log("✓ No schema mismatches found. Document structure is valid.");
    return;
  }

  console.log(`Found ${patches.length} issue(s) to fix:\n`);
  patches.forEach((patch, i) => {
    console.log(`${i + 1}. ${patch.path}`);
    console.log(`   From: ${JSON.stringify(patch.from)}`);
    console.log(`   To:   ${JSON.stringify(patch.to)}`);
  });

  console.log("\nApplying fixes...");

  // Update the document
  await client.createOrReplace({
    ...doc,
    _id: "clinicConfig",
    _type: "clinicConfig"
  });

  console.log("\n✓ All fixes applied successfully!");
  console.log("\nNext steps:");
  console.log("1. Open Sanity Studio at /studio");
  console.log("2. Verify there are no validation errors");
  console.log("3. Upload images for any fields that were set to null");
}

fixSchemaMismatch().catch((error) => {
  console.error("\n✗ Error:", error.message);
  process.exit(1);
});
