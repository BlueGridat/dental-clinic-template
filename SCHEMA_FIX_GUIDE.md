# Sanity Schema Validation Error Fix Guide

## Problem Summary

After Codex modified the schema to support premium imagery, Sanity Studio shows validation errors:

```
Expected type "Object", got "String"
Expected type "String", got "Object"
```

## Root Cause

The validation errors occur because of a **schema/data mismatch**:

### What Changed

In `sanity/schemaTypes/clinicConfig.ts`, several fields were converted to use Sanity's image type:

- `brand.logoImage` - changed from `string` to `image` object
- `hero.image` - changed from `string` to `image` object  
- `about.image` - changed from `string` to `image` object
- `appointmentBanner.image` - changed from `string` to `image` object
- `team.doctors[].image` - changed from `string` to `image` object
- `testimonials.items[].image` - changed from `string` to `image` object
- `faq.video` - changed from `string` to `image` object
- `meta.ogImage` - changed from `string` to `image` object

### The Mismatch

**Schema expects:** 
```json
{
  "_type": "image",
  "asset": {
    "_type": "reference",
    "_ref": "image-abc123..."
  }
}
```

**Document contains:**
```json
""  // empty string
// OR
"/images/hero.png"  // string path
```

## Solution

### Option 1: Fix the Data (Recommended)

Run the fix script to clean up empty strings and prepare for image uploads:

```bash
# Make sure you have the SANITY_API_TOKEN set
npm run fix-schema
```

This script will:
1. Find all empty string values in image fields
2. Convert them to `null` (which Sanity accepts)
3. Update the document in Sanity
4. Allow you to upload images through Studio

### Option 2: Make Schema More Flexible

If you want to keep both string paths AND image objects working, update the schema to use a union type:

**In `sanity/schemaTypes/clinicConfig.ts`**, replace:

```typescript
const imageField = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true }
  });
```

With:

```typescript
const imageOrStringField = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "imageOrString" // Use the new flexible type
  });
```

Then create a new type in `sanity/schemaTypes/shared.ts`:

```typescript
export const imageOrString = defineType({
  name: "imageOrString",
  title: "Image or URL",
  type: "object",
  fields: [
    defineField({
      name: "type",
      type: "string",
      options: { list: ["image", "url"] }
    }),
    defineField({
      name: "image",
      type: "image",
      hidden: ({ parent }) => parent?.type !== "image"
    }),
    defineField({
      name: "url",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "url"
    })
  ]
});
```

**Note:** This approach requires updating all components that use images.

## Recommended Approach

**Use Option 1** - Keep the schema as image objects and fix the data.

### Why?

1. ✅ Images stored in Sanity get automatic CDN optimization
2. ✅ Responsive image generation built-in
3. ✅ Better content management for clients
4. ✅ Hotspot/crop functionality available
5. ✅ Aligns with Sanity best practices

## Step-by-Step Fix

### 1. Run the Fix Script

```bash
cd /projects/sandbox/dental-clinic-template

# Ensure env vars are set
export NEXT_PUBLIC_SANITY_PROJECT_ID="xvyxwo8y"
export NEXT_PUBLIC_SANITY_DATASET="dentist-template"
export SANITY_API_TOKEN="your_token_here"

# Run fix
npm run fix-schema
```

### 2. Verify in Studio

1. Open Studio at `http://localhost:3000/studio`
2. Open the "Clinic config" document
3. Check that validation errors are gone
4. Fields with `null` values will show empty image uploaders

### 3. Upload Images

For each empty image field:

1. Click "Upload" or drag an image
2. Adjust hotspot if needed
3. Sanity will handle the upload and create the proper image reference

### 4. Update Components (If Needed)

Make sure all components use `@sanity/image-url` to render images:

```typescript
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!
});

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Usage in component
<img 
  src={urlFor(config.hero.image).width(800).url()} 
  alt="Hero" 
/>
```

## Fields That Changed

Here's a complete list of fields that now expect image objects:

| Field Path | Type Before | Type After |
|------------|-------------|------------|
| `meta.ogImage` | string | image |
| `brand.logoImage` | string | image |
| `hero.image` | string | image |
| `about.image` | string | image |
| `appointmentBanner.image` | string | image |
| `team.doctors[].image` | string | image |
| `testimonials.items[].image` | string | image |
| `faq.video` | string | image |
| `innovation.fallbackImage` | string | image |

## Prevention for Future Clients

When creating a new client deployment:

1. Run migration script with proper image paths
2. Ensure all image paths in `clinicConfig.json` are valid
3. Migration will auto-upload images to Sanity
4. No manual fixing needed

## Troubleshooting

### "Still seeing validation errors"

- Clear your browser cache
- Refresh the Studio page
- Check the browser console for errors

### "Can't upload images"

- Verify SANITY_API_TOKEN has write permissions
- Check CORS settings in Sanity project dashboard
- Ensure file size is under 10MB

### "Images not displaying on site"

- Check that `cdn.sanity.io` is in `next.config.ts` remote patterns
- Verify image URL generation in components
- Check browser network tab for 403/404 errors

## Need Help?

If issues persist, run the diagnostic script:

```bash
npm run check-sanity
```

This will output the current document structure for debugging.
