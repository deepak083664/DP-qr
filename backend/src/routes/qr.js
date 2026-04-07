const express = require('express');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { verifyToken } = require('../middlewares/auth');
const QRHistory = require('../models/QRHistory');

const router = express.Router();

// Generate a new QR Code
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { type, content, fgColor, bgColor, logoUrl } = req.body;
    
    // Check Free Plan Limits
    if (req.user.planType === 'free' && !req.user.isAdmin) {
      const qrCount = await QRHistory.countDocuments({ userId: req.user._id });
      if (qrCount >= 1) {
        return res.status(403).json({ error: 'Free plan limit reached. Upgrade to generate more.' });
      }
    }

    const shortId = crypto.randomBytes(4).toString('hex');
    const backendUrl = process.env.BACKEND_URL || 'https://dp-qr.onrender.com';
    const redirectUrl = `${backendUrl}/api/qr/s/${shortId}`;
    
    // Generate QR Code pointing to our tracker
    const dataUrl = await qrcode.toDataURL(redirectUrl, {
      color: {
        dark: fgColor || '#000000',
        light: bgColor || '#ffffff'
      },
      errorCorrectionLevel: 'H',
      margin: 2
    });

    let expiresAt = null;
    if (req.user.planType === 'free' && !req.user.isAdmin) {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    const qrRecord = new QRHistory({
      userId: req.user._id,
      type,
      shortId,
      originalUrl: content,
      dataUrl: content, // Keeping for legacy
      qrCodeUrl: dataUrl,
      expiresAt,
      planType: req.user.planType,
      customization: { fgColor, bgColor, logoUrl }
    });
    
    await qrRecord.save();

    res.status(200).json({ qrCodeUrl: dataUrl, record: qrRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
});


// GET Redirect Interceptor for scanning
router.get('/s/:shortId', async (req, res) => {
  try {
    const qr = await QRHistory.findOne({ shortId: req.params.shortId });
    
    if (!qr) return res.status(404).send('QR Code tracking not found');

    if (qr.expiresAt && qr.expiresAt < new Date()) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://dp-qr.vercel.app';
      return res.redirect(`${frontendUrl}/upgrade`);
    }

    qr.scans += 1;
    await qr.save();

    // Since the original might be a url or an uploaded cloudinary file (for image/pdf), it redirects fine.
    res.redirect(qr.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
