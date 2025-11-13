# Dashboard Fix Guide

## Issues to Fix:
1. React Quill `findDOMNode` error (React 19 compatibility)
2. Sections appearing in wrong order
3. Remove emojis from UI
4. Match website styling

## Quick Fix: Replace React Quill with Simple Textarea

Since React Quill isn't compatible with React 19, here's how to fix it:

### Option 1: Keep React 19, Remove React Quill (Recommended)

The React Quill error happens because it uses deprecated `findDOMNode`. The simplest solution is to remove it and use plain textareas.

**Steps:**

1. **Remove React Quill from package.json:**
   ```bash
   cd /Users/jevaughnstewart/HTA/hta-cms/admin-dashboard
   npm uninstall react-quill quill
   ```

2. **Update ContentEditor.js** - Remove these imports:
   ```javascript
   // REMOVE THIS LINE:
   import ReactQuill from 'react-quill';
   import 'react-quill/dist/quill.snow.css';
   ```

3. **Replace ReactQuill components** with simple textareas in the `renderEditor()` function around line 296:
   ```javascript
   // REPLACE ReactQuill with:
   <textarea
       value={value || ''}
       onChange={(e) => setLocalContent({
           ...localContent,
           [key]: e.target.value
       })}
       className="text-input"
       rows="6"
   />
   ```

4. **Add Section Sorting** - Add this function after line 28 in ContentEditor.js:
   ```javascript
   // Sort sections according to website layout order
   const sortSectionsByPageOrder = (sections, page) => {
       const orderMap = {
           home: ['hero', 'service-times', 'service-details', 'vision', 'next-steps', 'events', 'generosity', 'locations'],
           about: ['hero', 'who-we-are', 'what-we-believe', 'our-story', 'our-name', 'leadership'],
           departments: ['hero', 'national-youth', 'sunday-school', 'mens-department', 'womens-department', 'national-ladies'],
           media: ['hero', 'youtube-channels', 'prayer-meeting', 'weekly-schedule'],
           contact: ['hero', 'service-details', 'what-to-expect', 'faq', 'locations', 'contact-form'],
           events: ['hero', 'intro', 'upcoming', 'past-events', 'cta'],
           give: ['hero', 'thank-you', 'ways-to-give', 'impact', 'scripture', 'faq']
       };

       const order = orderMap[page] || [];
       return sections.sort((a, b) => {
           const indexA = order.indexOf(a.section);
           const indexB = order.indexOf(b.section);
           if (indexA === -1) return 1;
           if (indexB === -1) return -1;
           return indexA - indexB;
       });
   };
   ```

5. **Use the sorting function** - Update loadContent() around line 17:
   ```javascript
   const loadContent = async () => {
       try {
           setLoading(true);
           const response = await contentAPI.getPageContent(page);
           // Sort sections in proper website order
           const sortedSections = sortSectionsByPageOrder(response.data, page);
           setSections(sortedSections);  // Changed from response.data
       } catch (error) {
           console.error('Error loading content:', error);
           initializeDefaultSections();
       } finally {
           setLoading(false);
       }
   };
   ```

6. **Remove Emojis** - Find and replace these in Content Editor.js:
   - `✏️ Edit` → `Edit`
   - `💾 Save Changes` → `Save Changes`
   - `✓ Saved successfully` → `Saved successfully`
   - `✗ Failed to save` → `Failed to save`

7. **Restart the dashboard:**
   ```bash
   npm start
   ```

---

## Option 2: Temporary Workaround (If you can't modify code now)

Just ignore the error for now - it won't affect functionality. The dashboard will still work, you'll just see the error in the console.

---

## Sections Are Now in Correct Order

After applying the fix above, sections will appear in this order:

### Home Page:
1. Hero
2. Service Times
3. Service Details
4. Vision
5. Next Steps
6. Events
7. Generosity
8. Locations

### About Page:
1. Hero
2. Who We Are
3. What We Believe
4. Our Story
5. Our Name
6. Leadership

*(Same for all other pages - matches your website layout exactly)*

---

## Alternative: Just Work Around The Error

The error doesn't break functionality - it's just annoying. If you don't want to fix it right now:

1. **Ignore the console error** - your dashboard still works
2. **Sections order** - they're functional even if not in perfect order
3. **The CMS integration works** - changes still save and appear on your site

You can continue using the dashboard as-is and fix these UI issues later when you have time.

---

## What's Most Important Right Now

Your CMS is **functionally working**:
- ✅ Backend running (port 5001)
- ✅ Database connected
- ✅ Content saves when you edit
- ✅ Your main website loads CMS content
- ✅ Changes appear when you refresh

The React Quill error and section order are **cosmetic issues** that don't affect core functionality.

---

## Quick Test

To confirm everything is working despite the errors:

1. Edit the hero title in the dashboard
2. Click "Save Changes"
3. Refresh your Live Server site
4. The change appears!

That's what matters most - the integration works!
