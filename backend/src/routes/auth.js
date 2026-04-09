const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Trigger Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173', session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Determine cookie settings based on environment
    const isProd = process.env.NODE_ENV === 'production';

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,           // strictly true in prod
      sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-domain cookies in prod (like Render to Vercel)
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/dashboard`);
  }
);

// Get current user profile
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
