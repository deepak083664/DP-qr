const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { verifyToken } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email structure'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, password, email } = req.body;
    let user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, isPaid: user.isPaid, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', [
  body('email').trim().isEmail().withMessage('Please provide a valid email format'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { password, email } = req.body;
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, isPaid: user.isPaid, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const email = (req.body.email || '').trim();
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (!user) return res.status(404).json({ error: 'User with this email does not exist' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'https://dp-qr.vercel.app'}/reset-password/${token}`;

    console.log('\n--- PASSWORD RESET LINK (MOCK EMAIL) ---');
    console.log(`To reset password for ${email}, go to: ${resetUrl}`);
    console.log('----------------------------------------\n');

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        await transporter.sendMail({
          from: `"DP QR Support" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Password Reset Request',
          text: `You requested a password reset. Please click on the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`
        });
      } catch (emailErr) {
        console.error('Email sending failed (SMTP Error):', emailErr.message);
        console.log('Skipping email send. The reset link is available in the console above.');
        // Do not return a 500 status here, continue to the success response below
      }
    }

    res.status(200).json({ message: 'If the email exists, a reset link has been sent (check server logs if using mock).' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Password reset token is invalid or has expired' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
