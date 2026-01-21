const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security middleware - Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "https:", "data:", "https://ik.imagekit.io", "*"],
            connectSrc: ["'self'", "https://ik.imagekit.io"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:", "https://ik.imagekit.io"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit to 500 requests per windowMs for admin usage
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many login attempts. Please wait 1 minute before trying again.',
            retryAfter: 1, // 1 minute
            rateLimited: true
        });
    },
    // Add skip successful requests to only count failed attempts
    skipSuccessfulRequests: true
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit uploads to 20 per 15 minutes
    message: 'Too many upload requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// CORS middleware - Allow main website and admin dashboard
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:5500',
            'http://localhost:5501',
            'http://127.0.0.1:5500',
            'http://127.0.0.1:5501',
            'https://hta-cms-admin.vercel.app', // Admin dashboard
        ];

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any Vercel deployment (for main website and preview deployments)
        // This allows: hta-*.vercel.app, harvest-temple-*.vercel.app, etc.
        if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
            return callback(null, true);
        }

        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files - restricted to specific directories only
const path = require('path');
app.use('/assets', express.static(path.join(__dirname, '../../assets'), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d'
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d'
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Request logging (no emojis)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'HTA CMS API Server' });
});

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');

// Apply specific rate limiters to auth routes
app.use('/api/auth/login', authLimiter);
// Note: forgot-password and reset-password endpoints are disabled
// Users only reset passwords on first login via /change-password

// Apply upload rate limiter to media routes
app.use('/api/media/upload', uploadLimiter);
app.use('/api/media/upload-multiple', uploadLimiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
