# Immediate Fix for Sanity Validation Errors

## Quick Solution (5 minutes)

The validation error is caused by **empty strings** in fields that now expect **image objects**.

### Fix Steps

#### 1. Open Sanity Studio

```bash
cd /projects/sandbox/dental-clinic-template
npm run dev
```

Then visit: `http://localhost:3000/studio`

#### 2. Navigate to Document

- Click on "Clinic config" in the left sidebar
- The document should open with validation errors highlighted

#### 3. Fix Each Image Field

Look for fields showing validation errors (usually highlighted in red). These fields will show empty or have string values where images are expected:

**Fields to check:**

1. **Brand → Logo Image**
   - If empty or showing an error, click the field
   - Either upload an image OR leave it empty (Sanity accepts null)

2. **Hero → Image**
   - Should have an image
   - If showing error, delete the value and re-upload the image

3. **About → Image**
   - Should have an image
   - Re-upload if needed

4. **Appointment Banner → Image**
   - Should have an image
   - Re-upload if needed

5. **Team → Doctors** (scroll down to team section)
   - Check each doctor's image field
   - Re-upload any showing errors

6. **Testimonials → Items**
   - Check each testimonial's image field
   - Re-upload any showing errors

#### 4. Save Document

- Click "Publish" button (top right)
- Validation errors should be gone

---

## Alternative: Quick Script Fix

If you want to automate this, run:

```bash
# First, set up your environment
export SANITY_API_TOKEN="your_sanity_write_token"

# Run the fix script
npm run fix-schema
```

This will convert all empty strings to `null` automatically.

---

## Understanding the Error

### Before (in JSON)
```json
{
  "brand": {
    "logoImage": ""  // ❌ Empty string
  },
  "hero": {
    "image": "/images/hero.png"  // ❌ String path
  }
}
```

### After (in Sanity)
```json
{
  "brand": {
    "logoImage": null  // ✅ Null is valid
  },
  "hero": {
    "image": {  // ✅ Proper image object
      "_type": "image",
      "asset": {
        "_ref": "image-abc123..."
      }
    }
  }
}
```

---

## Why This Happened

Codex changed the schema to use Sanity's native image type (which is better!) but the existing document still had string values. When you migrated `clinicConfig.json` to Sanity:

- **Valid image paths** like `/images/hero.png` → converted to proper image objects ✅
- **Empty strings** like `""` → stayed as empty strings ❌

This causes the validation error because the schema now expects image objects, not strings.

---

## Prevention

For future client setups, ensure `clinicConfig.json` has either:
- **Valid image paths**: `/images/hero.jpg` (will auto-convert)
- **Null values**: Remove the field or set to `null`
- **No empty strings**: Never use `""`

---

## Still Stuck?

If validation errors persist:

1. **Check browser console** - Copy any error messages
2. **Check Sanity document directly**:
   ```bash
   npm run check-sanity
   ```
3. **Hard refresh Studio** - Clear cache and reload
