# Action Plan: Fix Sanity Validation Errors

**Status:** Ready to execute  
**Time Required:** 5-10 minutes  
**Risk Level:** Low

---

## Your Situation

✅ Template repo: `BlueGridat/dental-clinic-template`  
✅ Live demo: `dental-clinic-template-psi.vercel.app`  
✅ Sanity project: `xvyxwo8y` / dataset: `dentist-template`  
✅ Commits: All fix scripts and docs committed to `main`  
❌ **Issue:** Sanity Studio shows validation errors, can't edit config  

---

## What I Did

### 1. Investigated the Problem ✅

**Root cause:** Codex upgraded schema to use Sanity image types (correct!), but existing data has empty strings where image objects are expected.

**Affected fields:**
- `brand.logoImage` - Empty string `""`
- Possibly others with empty/invalid values

### 2. Created Fix Scripts ✅

Three new scripts to solve this:

1. **`npm run fix-schema`** - Automatically fixes validation errors
2. **`npm run check-sanity`** - Shows current document structure  
3. **`npm run migrate:v2`** - Better migration for future clients

### 3. Wrote Documentation ✅

Four comprehensive guides:

1. **RESOLUTION_SUMMARY.md** - Start here (executive summary)
2. **IMMEDIATE_FIX.md** - 5-minute quick fix
3. **INVESTIGATION_REPORT.md** - Full technical analysis
4. **SCHEMA_FIX_GUIDE.md** - Detailed implementation guide

### 4. Committed Everything ✅

All files committed to `main` branch:
- Commit: `df3cef1`
- Message: "fix: Add Sanity schema validation error fixes..."

---

## What You Need to Do Now

### Step 1: Pull the Changes

```bash
cd /path/to/dental-clinic-template
git pull origin main
```

**Expected output:**
```
Updating abc123..df3cef1
Fast-forward
 8 files changed, 1428 insertions(+)
 create mode 100644 IMMEDIATE_FIX.md
 ...
```

### Step 2: Install Dependencies (if needed)

```bash
npm install
```

### Step 3: Set Up Environment

Make sure you have `.env.local` with:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=xvyxwo8y
NEXT_PUBLIC_SANITY_DATASET=dentist-template
SANITY_API_TOKEN=your_sanity_write_token_here
SANITY_PREVIEW_SECRET=my-preview-secret-123
SANITY_STUDIO_PREVIEW_URL=https://dental-clinic-template-psi.vercel.app
NEXT_PUBLIC_SANITY_VISUAL_EDITING=true
```

**Get your SANITY_API_TOKEN:**
1. Go to https://sanity.io/manage
2. Select project `dental-clinic-template`
3. Go to API → Tokens
4. Create token with "Editor" permissions
5. Copy token to `.env.local`

### Step 4: Run the Fix

```bash
npm run fix-schema
```

**What you'll see:**
```
Fetching current clinicConfig document...
✓ Document found. Analyzing structure...

Found 1 issue(s) to fix:

1. brand.logoImage
   From: ""
   To:   null

Applying fixes...

✓ All fixes applied successfully!
```

### Step 5: Verify in Studio

```bash
npm run dev
```

Then open: `http://localhost:3000/studio`

**Check:**
- ✅ No red validation errors
- ✅ Can open "Clinic config" document
- ✅ Empty image fields show upload buttons
- ✅ No error messages

### Step 6: Upload Missing Images (Optional)

If any image fields are empty but should have images:

1. Click the empty image field
2. Upload or drag & drop image
3. Adjust hotspot if needed
4. Click "Publish"

### Step 7: Test the Site

Open `http://localhost:3000`

**Verify:**
- ✅ All sections render correctly
- ✅ Images load properly
- ✅ No console errors
- ✅ Site looks as expected

### Step 8: Push to Production

```bash
# Build test
npm run build

# If build succeeds, push to GitHub
git push origin main

# Vercel will auto-deploy
```

---

## If Something Goes Wrong

### Issue: "SANITY_API_TOKEN is missing"

**Solution:**
```bash
# Check if token is set
cat .env.local | grep SANITY_API_TOKEN

# If missing, add it
echo "SANITY_API_TOKEN=your_token_here" >> .env.local
```

### Issue: "Permission denied"

**Solution:** Token needs write permissions
1. Go to Sanity dashboard
2. Delete old token
3. Create new token with "Editor" role
4. Update `.env.local`

### Issue: "Still seeing validation errors"

**Solution:** Hard refresh Studio
1. Open Studio
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. May need to clear browser cache

### Issue: "Script fails"

**Solution:** Run diagnostic
```bash
npm run check-sanity
```

This will show the current document structure and help identify issues.

---

## Understanding the Fix

### What Was Wrong

```json
// Old (in Sanity document)
{
  "brand": {
    "logoImage": ""  // ❌ Empty string
  }
}
```

### What the Fix Does

```json
// After fix
{
  "brand": {
    "logoImage": null  // ✅ Null (valid for image type)
  }
}
```

### Why This Works

Sanity's image type accepts:
- ✅ Proper image object: `{ _type: "image", asset: {...} }`
- ✅ Null: `null`
- ❌ Empty string: `""`
- ❌ Plain string path: `"/images/logo.png"`

The fix converts invalid values (empty strings) to valid values (null).

---

## Timeline

| Action | Time | Who |
|--------|------|-----|
| Pull changes | 1 min | You |
| Set up .env.local | 2 min | You |
| Run fix script | 1 min | Automated |
| Verify in Studio | 2 min | You |
| Upload images | 5 min | You (optional) |
| **Total** | **~10 min** | |

---

## After the Fix

### Immediate Benefits

✅ Can edit clinic config in Studio  
✅ Can upload images through Studio  
✅ No validation errors  
✅ Proper image CDN optimization  
✅ Responsive images auto-generated  

### For Future Clients

When deploying for a new client:

1. Update `clinicConfig.json` with client details
2. Ensure image fields have valid paths or null (no empty strings)
3. Create new Sanity dataset for client
4. Run `npm run migrate:v2`
5. Images auto-upload, no validation errors
6. Client can edit through Studio

The improved migration script (`migrate:v2`) handles empty strings automatically.

---

## Quick Reference

### Commands

```bash
# Pull latest changes
git pull origin main

# Run the fix
npm run fix-schema

# Check current data
npm run check-sanity

# Start dev server
npm run dev

# Build for production
npm run build
```

### URLs

- **Local site:** http://localhost:3000
- **Studio:** http://localhost:3000/studio
- **Production:** https://dental-clinic-template-psi.vercel.app
- **Sanity dashboard:** https://sanity.io/manage

### Files to Read

1. **Start here:** `RESOLUTION_SUMMARY.md`
2. **Quick fix:** `IMMEDIATE_FIX.md`
3. **Deep dive:** `INVESTIGATION_REPORT.md`
4. **Technical:** `SCHEMA_FIX_GUIDE.md`

---

## Success Criteria

You'll know it's fixed when:

✅ No validation errors in Studio  
✅ Can open and edit "Clinic config" document  
✅ Can upload images  
✅ Site displays correctly  
✅ `npm run build` succeeds  
✅ Vercel deployment works  

---

## Next Steps After Fix

1. ✅ Test thoroughly on localhost
2. ✅ Upload any missing images in Studio
3. ✅ Push to GitHub (auto-deploys to Vercel)
4. ✅ Verify production site
5. ✅ Document any client-specific customizations
6. ✅ Use `migrate:v2` for future client deployments

---

## Need Help?

If you run into issues:

1. **Check the docs** - Start with `RESOLUTION_SUMMARY.md`
2. **Run diagnostic** - `npm run check-sanity`
3. **Check console** - Browser and terminal for errors
4. **Verify env vars** - Especially `SANITY_API_TOKEN`

---

**Ready? Let's fix it!**

```bash
git pull origin main
npm run fix-schema
npm run dev
# Open http://localhost:3000/studio
```

🎉 That's it!
