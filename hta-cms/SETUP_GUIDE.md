# HTA CMS - Complete Setup Guide

This guide will help you set up the complete Content Management System for Harvest Temple Apostolic Church website.

## System Overview

The CMS consists of three parts:
1. **Backend API** - Node.js/Express server with MongoDB
2. **Admin Dashboard** - React app for content editing
3. **Main Website** - Your existing HTA website (will connect to API)

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account (free tier is fine)
- Basic command line knowledge

## Step 1: Backend API Setup

### 1.1 Navigate to backend folder
```bash
cd hta-cms/backend
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Environment variables are already configured
The `.env` file is already set up with your MongoDB connection:
- MongoDB URI: Connected to your cluster
- JWT Secret: Configured
- Port: 5000

### 1.4 Create first admin user
```bash
npm run seed
```

This will create an admin account with:
- **Email**: admin@htachurch.com
- **Password**: Admin2025!

**IMPORTANT**: Change this password after first login!

### 1.5 Start the backend server
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

**Keep this terminal window open!** The server needs to stay running.

## Step 2: Admin Dashboard Setup

### 2.1 Open a NEW terminal window

### 2.2 Navigate to admin dashboard folder
```bash
cd hta-cms/admin-dashboard
```

### 2.3 Install dependencies
```bash
npm install
```

### 2.4 Environment is already configured
The `.env` file is set up with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2.5 Start the admin dashboard
```bash
npm start
```

The dashboard will open automatically at [http://localhost:3000](http://localhost:3000)

## Step 3: First Login

### 3.1 Log in to admin dashboard
1. Open [http://localhost:3000](http://localhost:3000)
2. Enter credentials:
   - Email: `admin@htachurch.com`
   - Password: `Admin2025!`
3. Click "Sign In"

### 3.2 You should see the dashboard!
- Sidebar with all pages (Home, About, Departments, etc.)
- Content editor in the main area
- Welcome message with your admin name

## Step 4: Using the CMS

### 4.1 Editing Content

1. **Select a page** from the sidebar (e.g., "Home Page")
2. The content editor loads all sections for that page
3. Click **"Edit"** on any section you want to change
4. Make your changes:
   - Text content: Use the rich text editor
   - Images: Click "Choose File" to upload
   - Structured content: Edit individual fields
5. Click **"Save Changes"**
6. You'll see "✓ Saved successfully" when done

### 4.2 Page Sections

Each page has multiple sections:

**Home Page:**
- `hero` - Main banner (title, subtitle, background image)
- `service-times` - Service schedule
- `welcome` - Welcome message
- `upcoming-events` - Featured events

**About Page:**
- `history` - Church history
- `leadership` - Staff and leadership team
- `mission` - Mission and vision statements

**And more...**

### 4.3 Content Types

The CMS handles three types of content:

**Simple Text:**
```
"Welcome to Harvest Temple!"
```

**Structured Object:**
```json
{
  "title": "Sunday Service",
  "time": "10:00 AM",
  "location": "Main Sanctuary"
}
```

**Images:**
- Upload new images (max 10MB)
- Supports: JPG, PNG, GIF, WebP
- Automatically saved to server

## Step 5: Managing Users

### 5.1 Creating New Users (Admin Only)

To add new tech team members:

1. Use a tool like Postman or cURL
2. Send POST request to: `http://localhost:5000/api/auth/register`
3. Include your admin token in headers:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
4. Send user data:
   ```json
   {
     "name": "John Smith",
     "email": "john@htachurch.com",
     "password": "SecurePassword123!",
     "role": "editor"
   }
   ```

### 5.2 User Roles

- **Admin** - Full access (can create users, delete content, manage everything)
- **Editor** - Can edit content but cannot manage users

## Step 6: Connecting Main Website

### 6.1 Update your existing HTA website

In your main website JavaScript, fetch content from the API:

```javascript
// Example: Fetch home page content
async function loadHomeContent() {
    try {
        const response = await fetch('http://localhost:5000/api/content/home');
        const sections = await response.json();

        // sections is an array of all home page sections
        sections.forEach(section => {
            // Update your website with section.content
            updateSection(section.section, section.content);
        });
    } catch (error) {
        console.error('Failed to load content:', error);
    }
}

// Fetch specific section
async function loadHeroSection() {
    const response = await fetch('http://localhost:5000/api/content/home/hero');
    const data = await response.json();

    // data.content contains the hero section data
    document.getElementById('hero-title').textContent = data.content.title;
    document.getElementById('hero-subtitle').textContent = data.content.subtitle;
}
```

### 6.2 Example: Update service times

```javascript
async function updateServiceTimes() {
    const response = await fetch('http://localhost:5000/api/content/home/service-times');
    const data = await response.json();

    const serviceTimes = data.content;
    // serviceTimes might be: { sunday: "10:00 AM", wednesday: "7:00 PM" }

    document.getElementById('sunday-service').textContent = serviceTimes.sunday;
    document.getElementById('wednesday-service').textContent = serviceTimes.wednesday;
}
```

## Step 7: Production Deployment

### 7.1 Deploy Backend API

**Option A: Railway**
1. Push code to GitHub
2. Create account at railway.app
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy

**Option B: Render**
1. Create account at render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### 7.2 Deploy Admin Dashboard

**Option A: Netlify**
1. Create account at netlify.com
2. Drag and drop the `build` folder
3. Add environment variable: `REACT_APP_API_URL=https://your-api-url.com/api`
4. Deploy

**Option B: Vercel**
1. Create account at vercel.com
2. Import GitHub repository
3. Add environment variables
4. Deploy

### 7.3 Update production URLs

After deployment, update:
- Admin dashboard `.env`: Change API_URL to production API
- Main website API calls: Use production API URL
- Backend CORS settings: Add production dashboard URL

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Make sure port 5000 is not in use
- Run `npm install` again

### Admin dashboard shows blank screen
- Check browser console for errors
- Verify backend is running on port 5000
- Check `.env` has correct API_URL

### Cannot log in
- Make sure you ran `npm run seed` to create admin user
- Check backend console for errors
- Verify MongoDB is connected

### Content not saving
- Check browser network tab for errors
- Verify you're logged in (token not expired)
- Check backend logs for errors

### Images not uploading
- Check file size (max 10MB)
- Verify backend `uploads/` folder exists
- Check file type (only images/videos allowed)

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS on all deployments
- [ ] Update CORS to only allow your domains
- [ ] Add rate limiting to API
- [ ] Set up regular database backups
- [ ] Don't commit `.env` files to git

## File Structure

```
hta-cms/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Content.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── content.js
│   │   └── media.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   ├── seedAdmin.js
│   └── package.json
│
├── admin-dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   └── ContentEditor.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   ├── .env
│   └── package.json
│
└── SETUP_GUIDE.md (this file)
```

## Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the backend terminal for error messages
3. Verify both backend and frontend are running
4. Check MongoDB Atlas is accessible
5. Review the API documentation in `backend/README.md`

## Next Steps

1. ✅ Set up backend and admin dashboard
2. ✅ Create first admin user
3. ✅ Log in and test content editing
4. 🔄 Add content for all your pages
5. 🔄 Connect your main HTA website to fetch from API
6. 🔄 Train tech team on using the CMS
7. 🔄 Deploy to production

---

**Congratulations!** Your CMS is now set up. The tech team can now manage all website content without touching code.

For detailed API documentation, see `backend/README.md`
For admin dashboard features, see `admin-dashboard/README.md`
