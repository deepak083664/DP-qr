const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { verifyToken } = require('../middlewares/auth');

const crypto = require('crypto');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max limit to prevent DoS via memory exhaustion
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPEG formats are allowed.'), false); // Reject file
    }
  }
});

router.post('/file', verifyToken, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File size too large. Maximum allowed size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const isPDF = req.file.mimetype === 'application/pdf';
  const resourceType = isPDF ? 'raw' : 'image';
  
  const uploadOptions = { folder: 'qr_saas_uploads', resource_type: resourceType };
  if (isPDF) {
    // Mobile phones need the .pdf extension to know how to open it
    uploadOptions.public_id = crypto.randomBytes(8).toString('hex') + '.pdf';
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    uploadOptions,
    (error, result) => {
      if (error) {
        console.error("Cloudinary Error:", error);
        return res.status(500).json({ error: 'Upload to Cloudinary failed' });
      }
      res.json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

module.exports = router;
