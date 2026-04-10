const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const AdminSettings = require('../models/AdminSettings');
const User = require('../models/User');

const router = express.Router();

router.get('/settings', async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { oneMonthPrice, threeMonthsPrice, oneYearPrice, price, planDurationMonths, planName } = req.body;
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings({ oneMonthPrice, threeMonthsPrice, oneYearPrice });
    } else {
      if (oneMonthPrice !== undefined) settings.oneMonthPrice = oneMonthPrice;
      if (threeMonthsPrice !== undefined) settings.threeMonthsPrice = threeMonthsPrice;
      if (oneYearPrice !== undefined) settings.oneYearPrice = oneYearPrice;
      
      // Legacy backwards compat
      if (price !== undefined) settings.price = price;
      if (planDurationMonths !== undefined) settings.planDurationMonths = planDurationMonths;
      if (planName !== undefined) settings.planName = planName;
    }
    await settings.save();
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Dashboard stats
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ isPaid: true });
    
    // Revenue is hard to calculate exactly without OrderHistory, 
    // we return approximated metrics based on planTypes
    const oneMonth = await User.countDocuments({ planType: '1_month' });
    const threeMonth = await User.countDocuments({ planType: '3_months' });
    const oneYear = await User.countDocuments({ planType: '1_year' });
    
    // Using current settings, estimate minimum revenue generated
    const settings = await AdminSettings.findOne() || { oneMonthPrice: 499, threeMonthsPrice: 1299, oneYearPrice: 3999 };
    const estRevenue = (oneMonth * settings.oneMonthPrice) + (threeMonth * settings.threeMonthsPrice) + (oneYear * settings.oneYearPrice);

    res.json({ 
      totalUsers, 
      paidUsers, 
      estRevenue,
      plans: { free: totalUsers - paidUsers, oneMonth, threeMonth, oneYear }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users for admin dashboard
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email isPaid planType planExpiry createdAt')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving users' });
  }
});

module.exports = router;
