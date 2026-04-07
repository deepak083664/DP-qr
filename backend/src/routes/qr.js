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

// Fetch scan history of a user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await QRHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
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

    if (qr.type === 'text') {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>QR Text</title></head>
        <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f8fafc;font-family:sans-serif;margin:0;">
          <div style="background:white;padding:2rem;border-radius:1rem;box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1);max-width:90%;width:400px;word-wrap:break-word;">
            <p style="font-size:1.125rem;color:#334155;margin:0;white-space:pre-wrap;">${qr.originalUrl}</p>
          </div>
        </body>
        </html>
      `);
    }

    if (qr.type === 'pdf') {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>PDF Document</title></head>
        <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f8fafc;font-family:sans-serif;margin:0;">
          <div style="text-align:center;background:white;padding:3rem 2rem;border-radius:1.5rem;box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1);max-width:90%;width:350px;">
            <h2 style="margin:0 0 1.5rem;color:#0f172a;font-size:1.5rem;">Document Ready</h2>
            <p style="color:#64748b;margin-bottom:2rem;">Your PDF is ready to be viewed.</p>
            <a href="${qr.originalUrl}" style="display:inline-block;background:#3b82f6;color:white;text-decoration:none;padding:1rem 2rem;border-radius:0.75rem;font-weight:bold;font-size:1rem;box-shadow:0 4px 6px -1px rgba(59,130,246,0.5);width:100%;box-sizing:border-box;">View / Download PDF</a>
          </div>
        </body>
        </html>
      `);
    }

    let targetUrl = qr.originalUrl;
    // Fix missing http:// prefix for URLs to prevent relative path error tracking
    if (qr.type === 'url' && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    res.redirect(targetUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
