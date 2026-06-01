import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const apiVersion = "2024-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
const rootDir = process.cwd();

if (!projectId || !dataset || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.");
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

function shouldUploadImage(pathParts: string[], value: string) {
  if (!value.startsWith("/")) return false;
  if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(value)) return false;

  const field = pathParts[pathParts.length - 1];
  return field === "image" || field === "ogImage" || field === "video" || field === "fallbackImage" || field === "logoImage" || field === "icon";
}

async function uploadImage(publicPath: string) {
  const normalized = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(rootDir, "public", normalized.replace(/^public[\\/]/, ""));

  if (!existsSync(absolutePath)) {
    console.warn(`Skipping missing image: ${publicPath}`);
    return publicPath;
  }

  if (!imageAssetCache.has(absolutePath)) {
    imageAssetCache.set(
      absolutePath,
      client.assets.upload("image", createReadStream(absolutePath), {
        filename: path.basename(absolutePath)
      })
    );
  }

  const asset = await imageAssetCache.get(absolutePath);
  if (!asset) return publicPath;

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id
    }
  };
}

async function transformValue(value: JsonValue, pathParts: string[] = []): Promise<unknown> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item, index) => transformValue(item, [...pathParts, String(index)])));
  }

  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, childValue]) => [key, await transformValue(childValue, [...pathParts, key])] as const)
    );
    return Object.fromEntries(entries);
  }

  if (typeof value === "string" && shouldUploadImage(pathParts, value)) {
    return uploadImage(value);
  }

  return value;
}

async function main() {
  const file = readFileSync(path.join(rootDir, "clinicConfig.json"), "utf8");
  const config = JSON.parse(file) as JsonValue;
  const transformedConfig = await transformValue(config);

  const document = {
    ...(transformedConfig as Record<string, unknown>),
    _id: "clinicConfig",
    _type: "clinicConfig"
  };

  await client.createOrReplace(document);
  console.log(`Migrated clinicConfig.json to Sanity dataset "${dataset}" as _id "clinicConfig".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
