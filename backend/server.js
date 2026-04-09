require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Import Passport config
require('./src/config/passport');

// Route Imports
const authRoutes = require('./src/routes/auth');
const paymentRoutes = require('./src/routes/payment');
const qrRoutes = require('./src/routes/qr');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');

const app = express();

// Inject security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://*", "http://*"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Security options: Disable x-powered-by header identifying the server
app.disable('x-powered-by');

// CORS Configuration
// Allow frontend deployed on Vercel as well as local development environment
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.dpqr.online',
  'https://dpqr.online',
  'https://dp-qr.vercel.app', 
  'http://localhost:5173',
  'https://dp-qr.onrender.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ==========================================
// 1. UPTIME MONITORING & HEALTH CHECK
// Placed BEFORE parsers, loggers, and limiters for max speed (<50ms)
// No database queries or heavy middleware applied here.
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Request logging (useful for debugging in production)
// Bypassed for /api/health as it is handled above.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// RATE LIMITING
// ==========================================
// API Rate Limiting (General backend protection)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Exclude Google Auth routes from limits
    const path = req.originalUrl || req.path;
    return path.includes('/auth/google');
  }
});

// Authentication Rate Limiting (Strict protection against brute force)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute
  message: { error: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Exclude Google Auth routes from limits
    const path = req.originalUrl || req.path;
    return path.includes('/auth/google');
  }
});

// Apply API Limiter to all API routes
app.use('/api', apiLimiter);

// Root & API Root Routes
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.get('/api', (req, res) => {
  res.send('API root working ✅');
});

// API Routes
app.use('/auth', authLimiter, authRoutes); // Added for strict Google Auth path matching
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Fallback Route for undefined endpoints (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server & Database Initialization
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully.');
    // Binding to 0.0.0.0 is crucial for platforms like Render & Docker
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Prevent server from hanging if DB fails
  });

// Handle unhandled exceptions/rejections to prevent sudden app crashes
process.on('uncaughtException', (err) => {
  console.error('An unhandled exception occurred:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
