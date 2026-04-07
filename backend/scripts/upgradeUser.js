require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const upgradeUser = async () => {
  const email = 'prince620590@gmail.com';
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    // Upgrade user to 1 year premium (all access)
    user.isPaid = true;
    user.planType = '1_year';
    
    // Set planExpiry to 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    user.planExpiry = nextYear;

    await user.save();
    console.log(`Successfully upgraded user: ${email}`);
    console.log(`- Plan: ${user.planType}`);
    console.log(`- Expiry: ${user.planExpiry.toLocaleString()}`);
    console.log(`- Paid: ${user.isPaid}`);

    process.exit(0);
  } catch (err) {
    console.error('Error upgrading user:', err);
    process.exit(1);
  }
};

upgradeUser();
