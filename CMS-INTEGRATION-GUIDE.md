# CMS Integration Complete! 🎉

Your main website is now connected to your admin dashboard CMS. Changes you make in the admin dashboard will automatically appear on your live site!

## ✅ What Was Done

1. **Added CMS Integration to script.js**
   - Your website now fetches content from the backend API on page load
   - Falls back to static content if API is unavailable
   - Updates these sections dynamically:
     - Hero section (title, subtitle, background image)
     - Service times
     - Service details
     - Vision section
     - Events
     - Generosity section
     - Church locations

2. **Seeded Initial Content**
   - Populated database with your current website content
   - 7 sections for the home page
   - Ready for you to edit in the admin dashboard

3. **Backend API Running**
   - Server running on http://localhost:5001
   - API endpoint: http://localhost:5001/api/content/home

---

## 🚀 How To Use

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/jevaughnstewart/HTA/hta-cms/backend
node server.js
```

You should see:
```
🚀 Server running on port 5001
✅ MongoDB connected successfully
```

**Keep this terminal window open** - the backend must be running for the CMS to work.

---

### Step 2: Start the Admin Dashboard

Open a **NEW** terminal and run:

```bash
cd /Users/jevaughnstewart/HTA/hta-cms/admin-dashboard
npm start
```

The admin dashboard will open at http://localhost:3000

**Login credentials:**
- Email: `admin@htachurch.com`
- Password: `Admin2025!`

---

### Step 3: View Your Website

Open your main website using Live Server or just open [index.html](index.html) in your browser.

**IMPORTANT:** For the CMS integration to work, the backend server (Step 1) must be running!

---

## 🎨 How To Edit Content

1. **Login to Admin Dashboard** (http://localhost:3000)
   - Use the credentials above

2. **Select a Page** from the left sidebar
   - Home Page
   - About Page
   - Departments
   - Media
   - Contact
   - Events
   - Give

3. **Edit Content** in the main area
   - Select a section (hero, service-times, vision, etc.)
   - Edit the text, images, or data
   - Click "Save Changes"

4. **Refresh Your Website**
   - Go back to your main site (index.html)
   - Refresh the page (Cmd+R or F5)
   - **Your changes will appear!** ✨

---

## 📋 Available Sections (Home Page)

| Section Name | What It Controls |
|--------------|------------------|
| `hero` | Main banner title, subtitle, and background image |
| `service-times` | Service and Sunday school times |
| `service-details` | "Attend a Sunday Service" section text |
| `vision` | "Our Vision" heading and description |
| `events` | Upcoming events list |
| `generosity` | "Thank You For Your Generosity" section |
| `locations` | All church locations (Portsmouth, Banks, Slipe Pen, Mullet Hall) |

---

## 🔧 Troubleshooting

### Content Not Updating?

1. **Check backend is running:**
   ```bash
   curl http://localhost:5001/api/content/home
   ```
   - Should return JSON data
   - If not, restart the backend server

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for console messages like "Loading CMS content for page: home"
   - Look for errors (red text)

3. **CORS Issues?**
   - Make sure backend is on port 5001
   - Make sure you're viewing the site on the same computer

### Still Using Static Content?

If the website shows old content:
- The CMS gracefully falls back to static HTML if the API is unavailable
- Check that both servers are running (backend on 5001)
- Refresh the page with Cmd+Shift+R (hard refresh)

---

## 📁 File Changes Made

### Modified Files:
- [script.js](script.js) - Added CMS integration code
- [hta-cms/backend/seedContent.js](hta-cms/backend/seedContent.js) - Updated with your actual content

### What Happens:
1. Page loads → [script.js](script.js) runs
2. `loadCMSContent()` function executes
3. Fetches data from `http://localhost:5001/api/content/home`
4. Updates page sections with CMS content
5. If API fails, shows static HTML (graceful fallback)

---

## 🌐 Next Steps

### Add More Pages
The integration currently works for the **home page**. To add other pages:

1. Edit content in admin dashboard for other pages (about, departments, etc.)
2. The same integration code will work - it automatically detects which page you're on
3. Just make sure the section names match between the HTML and the CMS

### Deploy to Production

When ready to go live:

1. **Deploy Backend API:**
   - Use Railway, Render, or Heroku
   - Update `.env` with production MongoDB URL
   - Set `NODE_ENV=production`

2. **Deploy Admin Dashboard:**
   - Use Netlify or Vercel
   - Update `REACT_APP_API_URL` to your production API URL

3. **Update Main Website:**
   - Change `CMS_API_URL` in [script.js](script.js) from `http://localhost:5001/api` to your production API URL
   - Deploy to your hosting provider

---

## 🔐 Security Notes

Before going to production:

- [ ] Change default admin password
- [ ] Generate a strong JWT_SECRET (32+ characters)
- [ ] Update CORS to only allow your domain
- [ ] Enable HTTPS
- [ ] Remove .env from version control
- [ ] Set up regular database backups

---

## 💡 Example: Editing the Hero Section

**In Admin Dashboard:**
1. Login at http://localhost:3000
2. Click "Home Page" in sidebar
3. Select "hero" section
4. Change title to "Experience God's Love"
5. Change subtitle to "Join us this Sunday"
6. Click "Save Changes"

**On Main Website:**
1. Refresh [index.html](index.html)
2. The hero banner now shows your new text! 🎉

---

## 📞 Support

If you need help:
- Check the browser console (F12) for error messages
- Check the backend terminal for API errors
- Verify both servers are running
- Make sure MongoDB is connected

---

**Your website is now a fully dynamic CMS-powered site!** 🚀

Edit content through the admin dashboard, and it will appear on your live site instantly.
