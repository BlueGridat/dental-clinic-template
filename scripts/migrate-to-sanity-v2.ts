/**
 * Enhanced Sanity Migration Script v2
 * 
 * Improvements over v1:
 * - Handles empty strings (converts to null)
 * - Better error messages
 * - Validates environment variables
 * - Shows progress during migration
 */

import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const apiVersion = "2024-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
const rootDir = process.cwd();

// Validate environment
if (!projectId || !dataset || !token) {
  console.error("❌ Missing required environment variables:");
  if (!projectId) console.error("   - NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) console.error("   - NEXT_PUBLIC_SANITY_DATASET");
  if (!token) console.error("   - SANITY_API_TOKEN");
  console.error("\nSet these in .env.local or export them before running.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false
});

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const imageAssetCache = new Map<string, Promise<{ _id: string }>>();
let uploadCount = 0;
let nullifiedCount = 0;

/**
 * Determines if a field should be treated as an image field
 */
function shouldUploadImage(pathParts: string[], value: string) {
  if (!value.startsWith("/")) return false;
  if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(value)) return false;

  const field = pathParts[pathParts.length - 1];
  // NOTE: "icon" is intentionally excluded — schema defines it as type "string"
  // (holds either a Lucide icon name like "sparkles" or a local image path like "/images/svc-cosmetic.png")
  const imageFields = [
    "image", 
    "ogImage", 
    "video", 
    "fallbackImage", 
    "logoImage"
  ];
  
  return imageFields.includes(field);
}

/**
 * Uploads an image to Sanity and returns a proper image reference
 */
async function uploadImage(publicPath: string, fieldPath: string) {
  const normalized = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(rootDir, "public", normalized.replace(/^public[\\/]/, ""));

  if (!existsSync(absolutePath)) {
    console.warn(`⚠ Skipping missing image at ${fieldPath}: ${publicPath}`);
    return null; // Return null instead of the path
  }

  if (!imageAssetCache.has(absolutePath)) {
    console.log(`📤 Uploading: ${publicPath}`);
    imageAssetCache.set(
      absolutePath,
      client.assets.upload("image", createReadStream(absolutePath), {
        filename: path.basename(absolutePath)
      })
    );
  }

  const asset = await imageAssetCache.get(absolutePath);
  if (!asset) return null;

  uploadCount++;
  console.log(`✓ Uploaded: ${publicPath} → ${asset._id}`);

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id
    }
  };
}

/**
 * Recursively transforms the config object
 */
async function transformValue(
  value: JsonValue, 
  pathParts: string[] = []
): Promise<unknown> {
  // Handle arrays
  if (Array.isArray(value)) {
    return Promise.all(
      value.map((item, index) => 
        transformValue(item, [...pathParts, String(index)])
      )
    );
  }

  // Handle objects
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, childValue]) => {
        const transformed = await transformValue(childValue, [...pathParts, key]);
        return [key, transformed] as const;
      })
    );
    return Object.fromEntries(entries);
  }

  // Handle empty strings - convert to null
  if (value === "" && shouldUploadImage(pathParts, "/dummy.jpg")) {
    const fieldPath = pathParts.join(".");
    console.log(`🔄 Converting empty string to null: ${fieldPath}`);
    nullifiedCount++;
    return null;
  }

  // Handle image paths
  if (typeof value === "string" && shouldUploadImage(pathParts, value)) {
    const fieldPath = pathParts.join(".");
    return uploadImage(value, fieldPath);
  }

  return value;
}

/**
 * Main migration function
 */
async function main() {
  console.log("\n🚀 Starting Sanity Migration v2\n");
  console.log(`📋 Project: ${projectId}`);
  console.log(`📊 Dataset: ${dataset}\n`);

  // Read config file
  const configPath = path.join(rootDir, "clinicConfig.json");
  if (!existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    process.exit(1);
  }

  console.log("📖 Reading clinicConfig.json...\n");
  const file = readFileSync(configPath, "utf8");
  const config = JSON.parse(file) as JsonValue;

  console.log("🔄 Transforming data...\n");
  const transformedConfig = await transformValue(config);

  const document = {
    ...(transformedConfig as Record<string, unknown>),
    _id: "clinicConfig",
    _type: "clinicConfig"
  };

  console.log("\n💾 Uploading to Sanity...");
  await client.createOrReplace(document);

  console.log("\n✅ Migration complete!\n");
  console.log(`📊 Summary:`);
  console.log(`   - Images uploaded: ${uploadCount}`);
  console.log(`   - Empty strings nullified: ${nullifiedCount}`);
  console.log(`   - Dataset: ${dataset}`);
  console.log(`   - Document ID: clinicConfig\n`);
  
  console.log("🎯 Next steps:");
  console.log("   1. Open Studio at /studio");
  console.log("   2. Verify the clinicConfig document");
  console.log("   3. Upload images for any null fields");
  console.log("   4. Publish changes\n");
}

main().catch((error) => {
  console.error("\n❌ Migration failed:\n");
  console.error(error);
  process.exit(1);
});
