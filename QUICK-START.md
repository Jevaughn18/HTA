# HTA CMS Quick Start Guide

## 🎯 **FIXED: Your Changes Will Now Update!**

The issue was **CORS blocking**. Live Server runs on port 5500/5501, but the backend only allowed port 3000. This has been fixed!

---

## ✅ **How To Use Your CMS (3 Steps)**

### **Step 1: Start the Backend Server**

Open Terminal and run:
```bash
cd /Users/jevaughnstewart/HTA/hta-cms/backend
node server.js
```

**Keep this terminal window open!** You should see:
```
🚀 Server running on port 5001
✅ MongoDB connected successfully
```

---

### **Step 2: Open Your Website with Live Server**

1. Open VSCode
2. Right-click on `index.html`
3. Click "Open with Live Server"
4. Your site opens at `http://localhost:5500` or `http://127.0.0.1:5500`

---

### **Step 3: Edit Content in Admin Dashboard**

Open a **new terminal** and run:
```bash
cd /Users/jevaughnstewart/HTA/hta-cms/admin-dashboard
npm start
```

This opens the admin dashboard at `http://localhost:3000`

**Login:**
- Email: `admin@htachurch.com`
- Password: `Admin2025!`

---

## 🎨 **How To Edit and See Changes**

1. **In Admin Dashboard** (`http://localhost:3000`):
   - Click "Home Page" in sidebar
   - Click "✏️ Edit" on any section
   - Make your changes
   - Click "💾 Save Changes"

2. **In Your Main Website** (`http://localhost:5500`):
   - **Refresh the page** (Cmd+R or F5)
   - **Hard refresh** if needed (Cmd+Shift+R or Ctrl+Shift+F5)
   - Your changes appear instantly! ✨

---

## 📋 **Example: Change the Hero Title**

**Try this now:**

1. Go to admin dashboard: `http://localhost:3000`
2. Click "Home Page"
3. Find "HERO" section
4. Click "✏️ Edit"
5. Change "Agents of Change." to "Welcome Home"
6. Click "💾 Save Changes"
7. Go to your main site: `http://localhost:5500`
8. **Refresh the page**
9. The hero title updates to "Welcome Home"! 🎉

---

## 🔧 **Troubleshooting**

### **Changes not appearing?**

1. **Check backend is running:**
   - Look for terminal with "🚀 Server running on port 5001"
   - If not running, start it: `cd /Users/jevaughnstewart/HTA/hta-cms/backend && node server.js`

2. **Hard refresh your browser:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + F5`
   - This clears the cache

3. **Check browser console:**
   - Press `F12` to open DevTools
   - Click "Console" tab
   - Look for:
     - ✅ "Loading CMS content for page: home"
     - ✅ "Loaded 8 sections from CMS"
     - ✅ "✓ Hero section updated"
   - If you see errors (red text), the backend might not be running

4. **Check the API directly:**
   ```bash
   curl http://localhost:5001/api/content/home/hero
   ```
   - Should return JSON with your content
   - If error "Connection refused" → backend isn't running

---

## 📂 **What Port is What?**

| Port | Service | URL |
|------|---------|-----|
| **5500** or **5501** | Main Website (Live Server) | http://localhost:5500 |
| **3000** | Admin Dashboard (React) | http://localhost:3000 |
| **5001** | Backend API (Express) | http://localhost:5001 |

---

## 🎯 **The Workflow**

```
1. Edit in Admin Dashboard (port 3000)
      ↓
2. Click "Save Changes"
      ↓
3. Content saved to MongoDB database
      ↓
4. Refresh Main Website (port 5500)
      ↓
5. Website fetches updated content from API (port 5001)
      ↓
6. Your changes appear! ✨
```

---

## 📝 **Section Names (Home Page)**

These sections are editable in the admin dashboard:

| Section Name | What It Controls |
|--------------|------------------|
| `hero` | Main banner: "Agents of Change" + background |
| `service-times` | "10am" and "9am" service times |
| `service-details` | "Attend a Sunday Service" text |
| `vision` | "To see people passionately devoted to God" |
| `next-steps` | "Plan A Visit", "Departments", "Serve" cards |
| `events` | Upcoming events list |
| `generosity` | "Thank You For Your Generosity" section |
| `locations` | All 4 church locations |

---

## 🚨 **Important Notes**

✅ **Backend MUST be running** for changes to appear on your site
✅ **Always refresh your browser** after making changes
✅ Changes are saved to the database instantly
✅ If backend is off, the site shows static HTML (graceful fallback)

---

## 🛑 **Stopping the Servers**

**Backend:**
- Go to the terminal running `node server.js`
- Press `Ctrl + C`

**Admin Dashboard:**
- Go to the terminal running `npm start`
- Press `Ctrl + C`

**Live Server:**
- Click "Port: 5500" in VSCode bottom bar
- Click "Stop Live Server"

---

## 🔐 **Production Checklist (Before Going Live)**

Before deploying to a live domain:

- [ ] Change admin password from default
- [ ] Update `CMS_API_URL` in `script.js` to production API URL
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Deploy admin dashboard to Netlify/Vercel
- [ ] Update CORS in backend to allow your live domain
- [ ] Enable HTTPS
- [ ] Set up regular database backups

---

**Your CMS is ready! Start editing! 🚀**
