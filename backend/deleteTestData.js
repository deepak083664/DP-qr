require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const QRHistory = require('./src/models/QRHistory');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all QR codes
    const qrResult = await QRHistory.deleteMany({});
    console.log(`Deleted ${qrResult.deletedCount} QR records.`);

    // Delete all non-premium and non-admin users
    const userResult = await User.deleteMany({ isPaid: false, isAdmin: false });
    console.log(`Deleted ${userResult.deletedCount} non-premium users.`);

    mongoose.disconnect();
    console.log('Database cleanup completed successfully.');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

run();
