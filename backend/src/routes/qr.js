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
    
    // Check Plan Limits
    if (!req.user.isAdmin) {
      let maxLimit = null;
      let planName = '';
      if (req.user.planType === 'free') { maxLimit = 1; planName = 'Free'; }
      else if (req.user.planType === '1_month') { maxLimit = 1; planName = '1 Month'; }
      else if (req.user.planType === '3_months') { maxLimit = 3; planName = '3 Months'; }
      else if (req.user.planType === '1_year') { maxLimit = 5; planName = '1 Year'; }
      
      if (maxLimit !== null) {
        const qrCount = await QRHistory.countDocuments({ userId: req.user._id });
        if (qrCount >= maxLimit) {
          return res.status(403).json({ error: `${planName} plan limit reached (Max ${maxLimit} QR). Upgrade to a higher plan to generate more.` });
        }
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
    if (!req.user.isAdmin) {
      if (req.user.planType === 'free') {
        expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      } else if (req.user.planType === '1_month') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      } else if (req.user.planType === '3_months') {
        expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      } else if (req.user.planType === '1_year') {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days
      }
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

// Edit existing QR Code content
router.put('/edit/:shortId', verifyToken, async (req, res) => {
  try {
    const { shortId } = req.params;
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (req.user.planType === 'free' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Editing is a premium feature. Please upgrade your plan.' });
    }

    const qr = await QRHistory.findOne({ shortId, userId: req.user._id });
    if (!qr) {
      return res.status(404).json({ error: 'QR Code not found or unauthorized' });
    }

    if (type) qr.type = type;
    qr.originalUrl = content;
    
    if (qr.type === 'pdf' || qr.type === 'image') {
      qr.dataUrl = content;
    }
    
    await qr.save();
    res.status(200).json({ message: 'QR Code updated successfully', qr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update QR Code' });
  }
});

// Delete a QR Code
router.delete('/delete/:shortId', verifyToken, async (req, res) => {
  try {
    const { shortId } = req.params;
    
    if (req.user.planType === 'free' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Deleting is a premium feature. Please upgrade your plan.' });
    }

    const deletedQr = await QRHistory.findOneAndDelete({ shortId, userId: req.user._id });
    if (!deletedQr) {
      return res.status(404).json({ error: 'QR Code not found or unauthorized' });
    }

    res.status(200).json({ message: 'QR Code deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete QR Code' });
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

    if (qr.type === 'image') {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Image Preview</title></head>
        <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0f172a;margin:0;">
          <img src="${qr.originalUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;border-radius:8px;box-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);" />
        </body>
        </html>
      `);
    }

    if (qr.type === 'pdf') {
      try {
        const client = qr.originalUrl.startsWith('https') ? require('https') : require('http');
        
        return client.get(qr.originalUrl, (response) => {
          // If Cloudinary redirects or throws error, fallback to direct browser redirect
          if (response.statusCode !== 200) {
             let url = qr.originalUrl;
             if (url.includes('cloudinary.com') && !url.includes('fl_attachment')) {
                url += (url.includes('?') ? '&' : '?') + 'fl_attachment=false';
             }
             return res.redirect(url);
          }

          // Pass through all essential headers (e.g., content-length, content-encoding for gzip)
          for (const key in response.headers) {
            if (key.toLowerCase() !== 'content-disposition' && key.toLowerCase() !== 'content-type') {
              res.setHeader(key, response.headers[key]);
            }
          }
          
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename="DPQR_Document.pdf"');
          
          response.pipe(res);
        }).on('error', (e) => {
          console.error("PDF Proxy Error:", e.message);
          return res.redirect(qr.originalUrl);
        });
      } catch (err) {
        return res.redirect(qr.originalUrl);
      }
    }

    let targetUrl = qr.originalUrl;
    // Fix missing http:// prefix for URLs
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
