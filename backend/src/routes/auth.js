const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// Trigger Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    const frontendUrl = 'https://www.dpqr.online'; // Enforced production URL
    
    if (err || !user) {
      console.error('Google Auth Failed:', err || info);
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Determine cookie settings based on environment
    const isProd = process.env.NODE_ENV === 'production';

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd || process.env.NODE_ENV !== 'local', // strict in prod
      sameSite: (isProd || process.env.NODE_ENV !== 'local') ? 'none' : 'lax', // cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend dashboard with token in URL to fix cross-device issues
    return res.redirect(`${frontendUrl}/dashboard?token=${token}`);
  })(req, res, next);
});

// Get current user profile
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin manual login (fallback for admin password auth)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid Admin Credentials' });
    }

    // Verify password if it exists (Google-only users might not have one)
    if (!user.password) {
      return res.status(400).json({ error: 'Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Admin Password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd || process.env.NODE_ENV !== 'local',
      sameSite: (isProd || process.env.NODE_ENV !== 'local') ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user, token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
