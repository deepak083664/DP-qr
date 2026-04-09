const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  profilePic: { type: String },
  isPaid: { type: Boolean, default: false },
  planType: { type: String, enum: ['free', '1_month', '3_months', '1_year'], default: 'free' },
  planExpiry: { type: Date },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
