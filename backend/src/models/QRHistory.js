const mongoose = require('mongoose');

const qrHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['url', 'text', 'image', 'pdf'], required: true },
  shortId: { type: String, unique: true, sparse: true },
  originalUrl: { type: String },
  dataUrl: { type: String }, // Raw data or Cloudinary URL
  qrCodeUrl: { type: String }, // Generated base64 or cloudinary image if hosted
  scans: { type: Number, default: 0 },
  expiresAt: { type: Date },
  planType: { type: String, default: 'free' },
  customization: {
    fgColor: { type: String, default: '#000000' },
    bgColor: { type: String, default: '#ffffff' },
    logoUrl: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('QRHistory', qrHistorySchema);
