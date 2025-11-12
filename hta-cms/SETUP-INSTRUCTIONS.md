# HTA Church CMS - Setup Instructions

## MongoDB Atlas Setup (Free Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Choose the **FREE M0 tier** (500MB storage, perfect for the church site)

### Step 2: Create a Cluster
1. After signing up, click **"Build a Database"**
2. Select **"M0 FREE"** tier
3. Choose a cloud provider and region (AWS, us-east-1 is fine)
4. Name your cluster (e.g., "hta-church")
5. Click **"Create"**

### Step 3: Create Database User
1. You'll see "Security Quickstart"
2. Create a database user:
   - Username: `htaadmin` (or any username you want)
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
3. Click **"Create User"**

### Step 4: Set IP Whitelist
1. Under "Where would you like to connect from?"
2. Click **"Add My Current IP Address"**
3. For development, you can also add `0.0.0.0/0` (allows all IPs - only for development!)
4. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like: `mongodb+srv://htaadmin:<password>@cluster0.xxxxx.mongodb.net/`)
4. Replace `<password>` with the password you saved earlier
5. Add the database name at the end: `mongodb+srv://htaadmin:yourpassword@cluster0.xxxxx.mongodb.net/hta-church`

### Step 6: Update .env.local
1. Open `.env.local` in this project
2. Replace the `DATABASE_URI` line with your connection string:
   ```
   DATABASE_URI=mongodb+srv://htaadmin:yourpassword@cluster0.xxxxx.mongodb.net/hta-church
   ```
3. Generate a secure secret for `PAYLOAD_SECRET`:
   ```bash
   # Run this command in terminal to generate a random secret:
   openssl rand -base64 32
   ```
4. Replace `your-secret-key-change-this-in-production` with the generated secret

## Running the CMS

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```

### Step 3: Access the Admin Panel
1. Open your browser to [http://localhost:3000/admin](http://localhost:3000/admin)
2. **Create your first admin user:**
   - Email: your email address
   - Password: create a strong password
   - Name: your name
3. Click **"Create First User"**
4. You're now logged into the CMS!

## Understanding the CMS

### Collections (Where Content is Managed)
- **Church Locations** - Manage the 4 church branches
- **Leadership** - Add/edit Bishop, pastors, and staff
- **Events** - Create upcoming events and mark them as featured
- **Departments** - Manage the 5 ministry departments
- **Beliefs** - Edit the 5 articles of faith
- **FAQs** - Add frequently asked questions by category
- **Media** - Upload images for use across the site

### Globals (Site-Wide Settings)
- **Site Settings** - Edit hero section, service times, bank info, contact details, etc.

## Adding Content

### Example: Adding a New Event
1. Login to `/admin`
2. Click **"Events"** in the sidebar
3. Click **"Create New"**
4. Fill in:
   - Title: "Youth Revival 2025"
   - Description: Event details
   - Start Date: Select date
   - Upload an image
   - Toggle "Is Upcoming" and "Feature on Homepage"
5. Click **"Save"**
6. The event now appears on the website!

### Example: Updating Service Times
1. Login to `/admin`
2. Click **"Globals"** → **"Site Settings"**
3. Go to the **"Service Times"** tab
4. Update the times
5. Click **"Save"**
6. Changes appear instantly on the site!

## Next Steps

After MongoDB is set up and running:
1. Migrate your existing images and content
2. Build out the frontend pages
3. Test all functionality
4. Deploy to Vercel

## Troubleshooting

### "Failed to connect to MongoDB"
- Check your connection string is correct
- Make sure your IP address is whitelisted in MongoDB Atlas
- Verify your database username/password

### "PAYLOAD_SECRET is required"
- Make sure `.env.local` exists and has a PAYLOAD_SECRET value
- Generate one with: `openssl rand -base64 32`

### Port 3000 already in use
- Stop other Next.js apps or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

## Need Help?
- Payload CMS Docs: [https://payloadcms.com/docs](https://payloadcms.com/docs)
- MongoDB Atlas Docs: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
