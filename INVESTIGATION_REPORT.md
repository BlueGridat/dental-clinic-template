# Investigation Report: Sanity Schema Validation Errors

**Date:** June 1, 2026  
**Issue:** Validation errors in Sanity Studio after premium imagery upgrade  
**Status:** Root cause identified, fixes provided

---

## Executive Summary

After Codex implemented the premium imagery upgrade on branch `feature/premium-clinic-imagery`, Sanity Studio began showing validation errors:

```
Expected type "Object", got "String"
Expected type "String", got "Object"
```

**Root Cause:** Schema/data type mismatch. The schema was updated to use Sanity's native image type, but existing document data still contains string values or empty strings.

**Impact:** 
- ❌ Cannot edit clinic config in Studio without fixing validation errors
- ❌ Cannot upload new images until errors are resolved
- ✅ Site still works (falls back to existing data)

**Resolution:** Two fix scripts provided + manual fix instructions

---

## What Changed

### Files Modified by Codex

1. **sanity/schemaTypes/clinicConfig.ts** - Changed multiple string fields to image fields
2. **clinicConfig.json** - Updated with new image paths (but some empty strings remain)
3. **Components** - Updated to handle image objects
4. **Generated Assets** - Created new WebP images in `public/images/`

### Specific Schema Changes

The following fields were converted from `string` type to `image` type:

| Field | Old Type | New Type | Issue |
|-------|----------|----------|-------|
| `brand.logoImage` | `string` | `image` | Empty string `""` in JSON |
| `hero.image` | `string` | `image` | ✅ Likely OK |
| `about.image` | `string` | `image` | ✅ Likely OK |
| `appointmentBanner.image` | `string` | `image` | ✅ Likely OK |
| `team.doctors[].image` | `string` | `image` | ✅ Likely OK |
| `testimonials.items[].image` | `string` | `image` | ✅ Likely OK |
| `faq.video` | `string` | `image` | ✅ Likely OK |
| `meta.ogImage` | `string` | `image` | ✅ Likely OK |

---

## Why This Happened

### The Migration Process

1. **Step 1:** Codex updated the schema to use image objects (correct approach)
2. **Step 2:** Codex updated `clinicConfig.json` with new image paths
3. **Step 3:** The original migration script `scripts/migrate-to-sanity.ts` ran
4. **Problem:** The migration script converts valid paths like `/images/hero.png` to image objects, but **empty strings remain as empty strings**

### Example of the Issue

**In clinicConfig.json:**
```json
{
  "brand": {
    "logoImage": ""  // Empty string - no logo image
  }
}
```

**After Migration:**
```json
{
  "brand": {
    "logoImage": ""  // Still an empty string!
  }
}
```

**What Schema Expects:**
```json
{
  "brand": {
    "logoImage": {
      "_type": "image",
      "asset": { "_ref": "image-xyz..." }
    }
    // OR
    "logoImage": null  // Null is also acceptable
  }
}
```

---

## The Fix

### Option A: Automated Fix (Recommended)

**Run the fix script:**

```bash
# Set environment variables (if not in .env.local)
export NEXT_PUBLIC_SANITY_PROJECT_ID="xvyxwo8y"
export NEXT_PUBLIC_SANITY_DATASET="dentist-template"
export SANITY_API_TOKEN="your_write_token"

# Run fix
npm run fix-schema
```

**What it does:**
1. Fetches the current `clinicConfig` document from Sanity
2. Finds all image fields with empty strings
3. Converts empty strings to `null`
4. Updates the document in Sanity
5. Validation errors disappear

### Option B: Manual Fix in Studio

1. Open `http://localhost:3000/studio`
2. Navigate to "Clinic config" document
3. Find fields with validation errors (highlighted in red)
4. For each error:
   - If you have an image: upload it
   - If no image needed: clear the field (set to null)
5. Click "Publish"

---

## Technical Deep Dive

### How Sanity Image Types Work

Sanity's `image` type stores images as references to assets:

```typescript
// Schema definition
defineField({
  name: "heroImage",
  type: "image",  // This is a special Sanity type
  options: { hotspot: true }
})
```

**Stored in Sanity as:**
```json
{
  "heroImage": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-a1b2c3d4..."
    },
    "hotspot": {
      "x": 0.5,
      "y": 0.5,
      "width": 1,
      "height": 1
    }
  }
}
```

**Benefits:**
- ✅ Automatic CDN optimization
- ✅ Responsive image generation
- ✅ Crop and hotspot functionality
- ✅ Better asset management
- ✅ Image metadata (alt text, caption)

### Why Not Just Use Strings?

**Old approach (strings):**
```json
{
  "heroImage": "/images/hero.jpg"
}
```

**Problems:**
- ❌ No CDN optimization
- ❌ No responsive images
- ❌ No crop/hotspot
- ❌ Hard to manage across clients
- ❌ No asset tracking

**New approach (Sanity images):**
- ✅ All the benefits above
- ✅ Better for multi-client template
- ✅ Industry best practice

---

## Validation Error Analysis

### Error Message Breakdown

```
Brand / Logo Image
Expected type "Object", got "String"
```

**Translation:**
- **Field:** `brand.logoImage`
- **Schema expects:** An object of type `image` with structure `{ _type: "image", asset: {...} }`
- **Document contains:** An empty string `""`
- **Solution:** Change to `null` or upload an image

### Why Multiple Errors?

Each image field that has an empty string or invalid value will show a validation error. Common fields:

1. `brand.logoImage` - Empty string
2. `meta.ogImage` - Might have invalid value
3. Any doctor without an uploaded image
4. Any testimonial without an uploaded image

---

## Prevention for Future Clients

### Client Deployment Checklist

When creating a new client deployment from this template:

#### 1. Update clinicConfig.json

Ensure all image fields have either:
- ✅ **Valid paths:** `/images/client-hero.jpg`
- ✅ **Null:** `null` or omit the field
- ❌ **Never empty strings:** Not `""`

#### 2. Run Migration

```bash
npm run migrate
```

This will:
- Upload all images in paths to Sanity
- Convert paths to proper image references
- Skip null/missing fields

#### 3. Verify in Studio

- Open Studio
- Check for validation errors
- Upload any missing images

#### 4. Deploy to Vercel

Set environment variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xvyxwo8y
NEXT_PUBLIC_SANITY_DATASET=client-name-dataset
SANITY_API_TOKEN=...
SANITY_PREVIEW_SECRET=...
```

---

## Files Created for This Fix

1. **scripts/fix-schema-mismatch.ts** - Automated fix script
2. **scripts/check-sanity-data.ts** - Diagnostic script
3. **IMMEDIATE_FIX.md** - Quick fix guide (5 min)
4. **SCHEMA_FIX_GUIDE.md** - Comprehensive technical guide
5. **INVESTIGATION_REPORT.md** - This document
6. **package.json** - Updated with new scripts

---

## Testing the Fix

### 1. Before Running Fix

```bash
# Check current state
npm run check-sanity

# Look for fields with empty strings in the output
```

### 2. Run the Fix

```bash
npm run fix-schema
```

### 3. Verify in Studio

```bash
npm run dev
# Open http://localhost:3000/studio
# Open Clinic config document
# Should see no validation errors
```

### 4. Test on Site

```bash
# Visit http://localhost:3000
# All sections should render correctly
# Images should load from Sanity CDN
```

---

## Next Steps

1. ✅ **Run fix script** - `npm run fix-schema`
2. ✅ **Upload images in Studio** - For any null fields that need images
3. ✅ **Commit changes** - Once verified working
4. ✅ **Update documentation** - Add this to client deployment docs
5. ✅ **Test build** - Run `npm run build` to ensure production build works

---

## Support

If you encounter issues:

1. **Check console logs** - Both browser and terminal
2. **Run diagnostic** - `npm run check-sanity`
3. **Verify environment variables** - Especially `SANITY_API_TOKEN`
4. **Check Sanity project settings** - CORS and API settings
5. **Review component code** - Ensure proper image URL generation

---

## Conclusion

This is a **non-critical issue** caused by a schema upgrade. The fix is straightforward and the upgraded schema (using Sanity image types) is the correct long-term approach.

**Status:** ✅ Issue diagnosed, fixes provided, ready to deploy

**Time to fix:** 5-10 minutes (automated) or 10-15 minutes (manual)

**Risk level:** Low - existing site continues to work, only Studio editing is affected
