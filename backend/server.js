require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Route Imports
const authRoutes = require('./src/routes/auth');
const paymentRoutes = require('./src/routes/payment');
const qrRoutes = require('./src/routes/qr');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');

const app = express();

// Inject security headers
app.use(helmet());

// Security options: Disable x-powered-by header identifying the server
app.disable('x-powered-by');

// Global Rate Limiting (Prevent DDoS)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window`
  message: { error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication Rate Limiting (Prevent Brute Force)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login/signup requests per minute
  message: { error: 'Too many authentication attempts. Please try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// CORS Configuration
// Allow frontend deployed on Vercel as well as local development environment
const allowedOrigins = [
  process.env.FRONTEND_URL,
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

// Global Middlewares
app.use(express.json());

// Request logging (useful for debugging in production)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Health Routes
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.get('/api', (req, res) => {
  res.send('API root working ✅');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
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
