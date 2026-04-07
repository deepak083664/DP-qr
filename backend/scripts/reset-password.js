const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Adjust according to script output path
const User = require('../src/models/User');

const emailToReset = process.argv[2];
const newPassword = process.argv[3];

if (!emailToReset || !newPassword) {
  console.log('Usage: node reset-password.js <email> <newPassword>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    
    const user = await User.findOne({ email: new RegExp('^' + emailToReset + '$', 'i') });
    if (!user) {
      console.log(`❌ User not found with email: ${emailToReset}`);
      process.exit(1);
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    console.log(`✅ Success! Password for ${emailToReset} has been reset to: ${newPassword}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
