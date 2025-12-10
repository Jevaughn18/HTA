# HTA CMS Admin Dashboard

React-based admin dashboard for managing Harvest Temple Apostolic Church website content.

## Features

- **Secure Login** - JWT-based authentication
- **Content Editor** - Edit all website pages through intuitive interface
- **Rich Text Editing** - WYSIWYG editor for text content
- **Image Upload** - Upload and preview images
- **Real-time Save** - Automatic content saving with status feedback
- **Role-Based Access** - Admin and Editor permissions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with API URL:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. Make sure the backend API is running on port 5000
2. Create your first admin user using the backend API or MongoDB Compass
3. Log in with admin credentials

### Logging In

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Enter your email and password
3. Click "Sign In"

### Editing Content

1. After login, you'll see the dashboard with a sidebar
2. Click on any page (Home, About, Departments, etc.)
3. The content editor will load all sections for that page
4. Click "Edit" on any section to make changes
5. Make your edits using the rich text editor or text fields
6. Click "Save Changes" to update the content
7. Content is automatically saved to the database

### Content Types

The editor handles three types of content:

- **Simple Text** - Plain text or rich text (uses WYSIWYG editor)
- **Objects** - Structured data like `{title: "...", subtitle: "...", image: "..."}`
- **Images** - Upload new images or replace existing ones

### Page Sections

Each page has multiple sections you can edit:

**Home Page:**
- Hero section (main banner)
- Service times
- Welcome message
- Featured events

**About Page:**
- Church history
- Leadership team
- Mission and vision

**Departments Page:**
- Department descriptions
- Ministry leaders
- Meeting times

And more...

## Project Structure

```
admin-dashboard/
├── public/
├── src/
│   ├── components/
│   │   └── ContentEditor.js    # Main content editing component
│   ├── context/
│   │   └── AuthContext.js      # Authentication state management
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   └── Dashboard.js        # Main dashboard
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.js                  # Main app with routing
│   └── index.js
├── .env
└── package.json
```

## Available Pages

- **Home** - Homepage content
- **About** - About page content
- **Departments** - Departments and ministries
- **Media** - Sermons, videos, galleries
- **Contact** - Contact information and plan visit
- **Events** - Upcoming events and calendar
- **Give** - Giving information and links

## Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# For production, change to your deployed API URL:
# REACT_APP_API_URL=https://your-api-domain.com/api
```

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

## Deployment

### Option 1: Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variable `REACT_APP_API_URL` in Netlify settings
4. Deploy

### Option 2: Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable `REACT_APP_API_URL`
4. Deploy

### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload `build/` folder to your web host
3. Configure your web server to serve the static files

## Troubleshooting

### Cannot log in
- Make sure backend API is running
- Check that API URL in `.env` is correct
- Verify user exists in MongoDB database

### Content not saving
- Check browser console for errors
- Verify authentication token is valid
- Ensure backend API is accessible

### Images not uploading
- Check file size (max 10MB)
- Verify backend `uploads/` directory exists
- Check file type (only images/videos allowed)

## Security Notes

- Never commit `.env` file to version control
- Change JWT_SECRET in backend before production
- Use HTTPS in production
- Regularly update dependencies

## Tech Stack

- **React** - UI framework
- **React Router** - Navigation
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Context API** - State management

---

Built for Harvest Temple Apostolic Church
