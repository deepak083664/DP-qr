const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  oneMonthPrice: { type: Number, required: true, default: 499 },
  threeMonthsPrice: { type: Number, required: true, default: 1299 },
  oneYearPrice: { type: Number, required: true, default: 3999 },
  // Legacy fields
  price: { type: Number, required: true, default: 499 },
  planDurationMonths: { type: Number, required: true, default: 1 },
  planName: { type: String, default: "Premium Validation" }
}, { timestamps: true });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
