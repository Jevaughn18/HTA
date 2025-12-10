# Quick Start - Test Your CMS Now!

The admin dashboard and backend API are complete! Here's how to test everything right now.

## What's Been Built

✅ **Backend API** - Complete REST API with MongoDB
✅ **Admin Dashboard** - Full React app for content editing
✅ **Authentication** - Login system with JWT tokens
✅ **Content Editor** - Rich text editing with image upload
✅ **Initial Admin User** - Created and ready to use

## Test It Now (3 Minutes)

### Terminal 1: Start Backend
```bash
cd hta-cms/backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

### Terminal 2: Start Admin Dashboard
Open a NEW terminal window:
```bash
cd hta-cms/admin-dashboard
npm start
```

The dashboard will open automatically at http://localhost:3000

### Login Credentials
```
Email:    admin@htachurch.com
Password: Admin2025!
```

## What You Can Do Now

### 1. View All Pages
Click through the sidebar to see all pages:
- 🏠 Home Page
- 📖 About Page
- 👥 Departments
- 🎥 Media
- 📧 Contact
- 📅 Events
- 💝 Give

### 2. Edit Content
1. Click on any page (e.g., "Home Page")
2. Click "Edit" on a section
3. Make changes to text or upload images
4. Click "Save Changes"
5. See "✓ Saved successfully" message

### 3. Rich Text Editing
The content editor includes:
- Bold, italic, underline formatting
- Headings and lists
- Links
- Text alignment
- And more!

### 4. Image Upload
1. Click "Edit" on a section with images
2. Click "Choose File" under image fields
3. Select an image (max 10MB)
4. Preview appears instantly
5. Click "Save Changes" to upload

## Initial Content Structure

When you first load a page, you'll see default sections. For example, **Home Page** might have:

- **hero** - Main banner section
- **service-times** - Service schedule
- **welcome** - Welcome message
- **upcoming-events** - Featured events

You can edit any of these sections with your actual church content!

## API Testing (Optional)

If you want to test the API directly:

### Get all home page content:
```bash
curl http://localhost:5000/api/content/home
```

### Login and get token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@htachurch.com","password":"Admin2025!"}'
```

## Common First Steps

### Step 1: Add Real Content
Go through each page and add your actual church content:
- Update service times
- Add staff bios and photos
- Update church history
- Add upcoming events
- Update contact information

### Step 2: Upload Church Images
Replace placeholder images with:
- Church building photos
- Staff headshots
- Event photos
- Ministry images

### Step 3: Create Editor Accounts
Add accounts for other tech team members:
1. Use Postman or similar tool
2. POST to `/api/auth/register` with your admin token
3. Give them "editor" role

## Next: Connect Your Website

Once you've added content to the CMS, update your main HTA website to fetch data from the API.

Example for your homepage JavaScript:
```javascript
async function loadContent() {
    const response = await fetch('http://localhost:5000/api/content/home');
    const sections = await response.json();

    sections.forEach(section => {
        if (section.section === 'hero') {
            // Update hero section with section.content
        }
        if (section.section === 'service-times') {
            // Update service times with section.content
        }
    });
}

// Load content when page loads
loadContent();
```

## Troubleshooting

### Can't log in?
- Make sure backend is running (Terminal 1)
- Check the console for errors
- Try running `npm run seed` again

### Content not saving?
- Open browser developer tools (F12)
- Check Network tab for errors
- Verify backend terminal shows no errors

### Admin dashboard won't start?
```bash
cd hta-cms/admin-dashboard
rm -rf node_modules
npm install
npm start
```

## File Locations

- Backend: `/hta-cms/backend/`
- Admin Dashboard: `/hta-cms/admin-dashboard/`
- Uploaded Images: `/hta-cms/backend/uploads/`

## Ready for Production?

When you're ready to deploy:
1. See `SETUP_GUIDE.md` for detailed deployment instructions
2. Deploy backend to Railway, Render, or Heroku
3. Deploy admin dashboard to Netlify or Vercel
4. Update environment variables with production URLs

---

**You're all set!** Start the servers and log in to begin managing your church website content.

Questions? Check:
- `SETUP_GUIDE.md` - Complete setup instructions
- `backend/README.md` - API documentation
- `admin-dashboard/README.md` - Dashboard features
