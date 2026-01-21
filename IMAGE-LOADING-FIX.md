# Image Loading Fix for Vercel Deployment

## Problems Identified

### 1. **CORS Issue** ❌
Your backend server was only allowing requests from:
- Local development URLs (localhost)
- Admin dashboard: `https://hta-cms-admin.vercel.app`

**BUT NOT** your main website's Vercel URL!

When your website (deployed on Vercel) tried to fetch images from the backend API at `https://hta-kwfr.onrender.com`, the browser blocked the request due to CORS policy.

### 2. **Content Security Policy (CSP) Issue** ❌
The backend's security headers were too restrictive and might have been blocking ImageKit CDN resources.

---

## Solutions Implemented

### ✅ Fix 1: Updated CORS Configuration
**File:** `hta-cms/backend/server.js`

**What changed:**
- Changed from a static array of allowed origins to a **dynamic function**
- Now allows **ANY** Vercel deployment URL (e.g., `https://your-site-*.vercel.app`)
- This covers:
  - Your main production website
  - Preview deployments
  - Admin dashboard
  - Local development

**Code:**
```javascript
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            // ... other localhost URLs
            'https://hta-cms-admin.vercel.app',
        ];
        
        // Check static list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Allow ANY Vercel deployment
        if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
```

### ✅ Fix 2: Relaxed CSP Headers
**File:** `hta-cms/backend/server.js`

**What changed:**
- Added `crossOriginResourcePolicy: { policy: "cross-origin" }` to allow cross-origin image loading
- Ensured ImageKit CDN is explicitly allowed
- Added wildcard `"*"` to `imgSrc` for maximum compatibility

---

## How to Deploy the Fix

### Step 1: Push Changes to GitHub
```bash
cd /Users/jevaughnstewart/HTA
git add hta-cms/backend/server.js
git commit -m "Fix CORS and CSP for Vercel image loading"
git push origin main
```

### Step 2: Redeploy Backend on Render
Your backend is hosted on Render at `https://hta-kwfr.onrender.com`. 

**Option A: Automatic Deployment**
- If you have auto-deploy enabled, Render will automatically redeploy when you push to GitHub

**Option B: Manual Deployment**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your `hta-cms` backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### Step 3: Verify the Fix
After deployment, test your website:

1. **Open your Vercel website** (e.g., `https://your-site.vercel.app`)
2. **Open Browser DevTools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Look for:**
   - ✅ `[CMS] Loaded X sections from CMS` - means API is working
   - ✅ `[CMS] Updated hero gallery with X images` - means images are loading
   - ❌ CORS errors - means the fix didn't deploy yet

5. **Check Network tab:**
   - Look for requests to `https://hta-kwfr.onrender.com/api/content/home`
   - Status should be `200 OK` (not `CORS error`)

---

## Additional Checks

### Check 1: Verify ImageKit Images
Make sure images in your CMS are stored as **ImageKit URLs**, not `/uploads/` paths:

**Good:** ✅
```
https://ik.imagekit.io/vspqi4z1t/hta-cms/image.jpg
```

**Bad:** ❌
```
/uploads/image.jpg
```

The `/uploads/` paths don't work on Render because it uses ephemeral storage.

### Check 2: Verify CMS Config
Your `cms-config.js` is correctly set to use the production backend:
```javascript
const apiUrl = 'https://hta-kwfr.onrender.com';
```
✅ This is correct!

### Check 3: Check Vercel Deployment
Make sure your main website is deployed on Vercel. If you haven't deployed it yet:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set root directory to `/` (or wherever your `index.html` is)
5. Deploy!

---

## Testing Checklist

After deploying the backend fix:

- [ ] Open your Vercel website
- [ ] Check if hero gallery images load
- [ ] Check if event carousel images load
- [ ] Check if footer images load
- [ ] Open DevTools Console - no CORS errors
- [ ] Open DevTools Network tab - API requests return 200 OK
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Firefox, Safari)

---

## What If Images Still Don't Load?

### Debug Step 1: Check Backend Logs
1. Go to Render Dashboard
2. Open your backend service
3. Click "Logs"
4. Look for errors when the frontend makes requests

### Debug Step 2: Check Frontend Console
1. Open your Vercel website
2. Press F12 → Console tab
3. Look for:
   - `[CMS] Loading images for page: home`
   - `[CMS] Using API URL: https://hta-kwfr.onrender.com`
   - Any error messages

### Debug Step 3: Test API Directly
Open this URL in your browser:
```
https://hta-kwfr.onrender.com/api/content/home
```

You should see JSON data with your content. If you get an error, the backend isn't working.

### Debug Step 4: Check ImageKit
Make sure your ImageKit credentials are set in Render:
1. Render Dashboard → Your Service → Environment
2. Check these variables exist:
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`

---

## Summary

**Root Cause:** Your backend's CORS policy was blocking requests from your Vercel-deployed website.

**Fix:** Updated CORS to allow all Vercel deployments + relaxed CSP headers.

**Next Steps:**
1. Push changes to GitHub
2. Redeploy backend on Render
3. Test your Vercel website
4. Images should now load! 🎉

---

## Need More Help?

If images still don't load after following this guide:
1. Check the browser console for specific error messages
2. Share the error messages
3. Verify your Vercel deployment URL
4. Make sure backend is deployed on Render with latest changes
