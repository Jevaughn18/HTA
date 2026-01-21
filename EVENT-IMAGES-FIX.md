# Fix for "Upcoming Events" Images Not Showing

## Problem
The event images in the "Upcoming Events" carousel are not showing because they are stored as `/uploads/` paths in the database:
- `/uploads/1765650299423-192033204.jpg`
- `/uploads/1765650323046-793427313.jpeg`

**These files don't exist** because Render uses **ephemeral storage** - any files uploaded to the `/uploads/` folder get deleted when the server restarts!

## Solution Applied

### Code Fix ✅
Updated `cms-loader.js` to:
1. Recognize the `"upcoming-events"` section name
2. Support both `flyers` and `events` array names
3. **Filter out broken `/uploads/` images** automatically
4. Keep hardcoded images if no valid CMS images exist

### What You Need to Do 🔧

**Re-upload the event images through your CMS admin dashboard** so they get stored on **ImageKit** (permanent cloud storage) instead of `/uploads/`.

---

## Step-by-Step: Re-upload Event Images

### Step 1: Access CMS Admin
1. Go to https://hta-cms-admin.vercel.app
2. Log in with your admin credentials

### Step 2: Navigate to Home Page Content
1. Click on **"Home"** page
2. Find the **"Upcoming Events"** section
3. Click **Edit**

### Step 3: Re-upload Event Images
For each event:
1. Click the **image upload button**
2. Select the event flyer image from your computer
3. Wait for upload to complete
4. You should see an **ImageKit URL** (starts with `https://ik.imagekit.io/...`)
5. Save the event

### Step 4: Verify
1. Go to https://hta-lemon.vercel.app
2. Scroll to "Upcoming Events"
3. Images should now load! 🎉

---

## What Changed in the Code

### Before ❌
```javascript
// Only checked for 'event-flyers' or 'events'
if (sectionName === 'event-flyers' || sectionName === 'events') {
    updateEventCarousel(sectionContent);
}

// Didn't filter out broken /uploads/ images
carouselTrack.innerHTML = content.flyers.map(flyer => {
    const imgSrc = flyer.image.startsWith('http') 
        ? flyer.image 
        : `${API_BASE_URL}/${imagePath}`;
    // This would create broken image URLs!
});
```

### After ✅
```javascript
// Now checks for 'upcoming-events' too
if (sectionName === 'event-flyers' || sectionName === 'events' || sectionName === 'upcoming-events') {
    updateEventCarousel(sectionContent);
}

// Filters out broken /uploads/ images
const validFlyers = eventData
    .map(flyer => {
        const imgSrc = resolveImageUrl(flyer.image); // This filters /uploads/
        if (!imgSrc) {
            console.warn('[CMS] Skipping event flyer with broken image');
            return null;
        }
        return { ...flyer, resolvedSrc: imgSrc };
    })
    .filter(flyer => flyer !== null);

// Only updates if we have valid images
if (validFlyers.length > 0) {
    carouselTrack.innerHTML = validFlyers.map(flyer => {
        return `<div class="carousel-item event-poster-card">
            <img src="${flyer.resolvedSrc}" alt="${flyer.title}" loading="lazy">
        </div>`;
    }).join('');
} else {
    console.log('[CMS] No valid event flyers, keeping hardcoded images');
}
```

---

## Why This Happened

**Render's Ephemeral Storage:**
- When you upload images through the CMS, they were being saved to `/uploads/` folder on the server
- Render's free tier uses **ephemeral storage** - the filesystem is temporary
- Every time the server restarts (which happens frequently), all files in `/uploads/` are **deleted**
- This is why the images worked initially but disappeared later

**The Fix:**
- ImageKit is a **permanent cloud CDN** for storing images
- Images uploaded to ImageKit stay there forever
- The CMS is configured to use ImageKit, but you need to re-upload the images

---

## Current Status

### What's Working ✅
- Hero gallery images (if they're ImageKit URLs)
- Any images with ImageKit URLs
- Hardcoded images in HTML

### What Needs Re-uploading ⚠️
- **Upcoming Events** carousel images
- Any other CMS images that show as `/uploads/` paths

---

## How to Check if Images are on ImageKit

1. Go to CMS Admin → Home → Upcoming Events
2. Look at the image URLs in the content
3. **Good:** `https://ik.imagekit.io/vspqi4z1t/hta-cms/image.jpg` ✅
4. **Bad:** `/uploads/1765650299423-192033204.jpg` ❌

---

## Next Steps

1. ✅ Code fix applied (cms-loader.js updated)
2. ⏳ Commit and push changes
3. ⏳ Re-upload event images through CMS admin
4. ⏳ Verify images load on website

---

## Need Help?

If you need the original event images:
1. Check your local computer where you first uploaded them
2. Or take new screenshots of the events
3. Or use the image URLs if you have them saved elsewhere
