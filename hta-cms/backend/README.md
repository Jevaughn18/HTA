# HTA CMS Backend API

Complete REST API for the Harvest Temple Apostolic Church Content Management System.

## 🚀 Features

- **User Authentication** - JWT-based login system
- **Role-Based Access** - Admin and Editor roles
- **Content Management** - Edit all website content through API
- **Media Upload** - Handle images and videos
- **MongoDB Database** - Flexible schema for all content types

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string

4. Start the server:
```bash
npm run dev
```

## 🔑 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user | Admin only |
| POST | `/login` | Login and get JWT token | No |
| GET | `/me` | Get current user info | Yes |
| GET | `/users` | Get all users | Admin only |
| DELETE | `/users/:id` | Delete user | Admin only |

### Content Management (`/api/content`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:page` | Get all content for a page | No |
| GET | `/:page/:section` | Get specific section | No |
| POST | `/:page/:section` | Update/create content | Yes |
| DELETE | `/:page/:section` | Delete content | Yes |

### Media Upload (`/api/media`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload single file | Yes |
| POST | `/upload-multiple` | Upload multiple files | Yes |
| GET | `/files` | Get all uploaded files | Yes |
| DELETE | `/files/:filename` | Delete file | Yes |

## 📝 Content Structure

Content is organized by **page** and **section**:

**Pages:**
- `home` - Homepage
- `about` - About page
- `departments` - Departments page
- `media` - Media page
- `contact` - Contact/Plan Visit page
- `events` - Events page
- `give` - Giving page

**Example Sections:**
- `hero` - Hero section (title, subtitle, image)
- `service-times` - Service times and locations
- `leadership` - Staff/leadership info
- `departments-list` - Department descriptions
- `events-upcoming` - Upcoming events
- `footer` - Footer content

## 🔒 First Time Setup

1. Start the server
2. Create your first admin user via POST to `/api/auth/register` (temporarily bypass auth for first user)
3. Or use MongoDB Compass to manually create first user

Example first user:
```json
{
  "name": "Admin User",
  "email": "admin@htachurch.com",
  "password": "securepassword123",
  "role": "admin"
}
```

## 🌐 CORS Configuration

The API allows requests from:
- Frontend website (your main HTA site)
- Admin dashboard (React app)

Update `server.js` if you need to modify CORS settings.

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User authentication model
│   └── Content.js       # Flexible content model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── content.js       # Content management routes
│   └── media.js         # File upload routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── uploads/             # Uploaded files (gitignored)
├── .env.example         # Environment variables template
├── server.js            # Main server file
└── package.json
```

## 🔐 Environment Variables

Required variables in `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## 🚨 Security Notes

- Always use strong JWT_SECRET in production
- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- File uploads limited to 10MB
- Only images and videos allowed

## 📊 MongoDB Atlas Setup (Free Tier)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 FREE cluster
4. Get connection string
5. Add to `.env` file

## 🧪 Testing the API

Use tools like:
- **Postman** - GUI for API testing
- **Thunder Client** (VS Code extension)
- **cURL** - Command line

Example login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@htachurch.com","password":"password123"}'
```

## 🎯 Next Steps

1. Set up MongoDB Atlas
2. Create first admin user
3. Build React admin dashboard
4. Connect main website to fetch data from API

---

Built with ❤️ for Harvest Temple Apostolic Church
