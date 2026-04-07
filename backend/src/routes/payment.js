const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { verifyToken } = require('../middlewares/auth');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const QRHistory = require('../models/QRHistory');

const router = express.Router();

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { planId } = req.body; // '1_month', '3_months', '1_year'
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = { oneMonthPrice: 499, threeMonthsPrice: 1299, oneYearPrice: 3999 };
    }

    let price = settings.oneMonthPrice;
    if (planId === '3_months') price = settings.threeMonthsPrice;
    if (planId === '1_year') price = settings.oneYearPrice;

    const amount = price * 100; // Razorpay uses paisa

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
    };

    const rzp = getRazorpayInstance();
    const order = await rzp.orders.create(options);

    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID, amount });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      let monthsToAdd = 1;
      if (planId === '3_months') monthsToAdd = 3;
      if (planId === '1_year') monthsToAdd = 12;

      const newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + monthsToAdd);

      // Complete successful payment
      await User.findByIdAndUpdate(req.user._id, {
        isPaid: true,
        planType: planId || '1_month',
        planExpiry: newExpiry
      });

      // Reactivate existing QRs and set their expiry to the new plan's expiry
      await QRHistory.updateMany(
        { userId: req.user._id },
        { $set: { expiresAt: newExpiry, planType: planId || '1_month' } }
      );

      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
