const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const Order = require('./src/models/Order');
const AdminSettings = require('./src/models/AdminSettings');

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    const activeUsers = await User.find({ isPaid: true, isAdmin: { $ne: true } });
    console.log(`Found ${activeUsers.length} active paid users.`);

    const settings = await AdminSettings.findOne() || { oneMonthPrice: 499, threeMonthsPrice: 1299, oneYearPrice: 3999 };

    let count = 0;
    for (const user of activeUsers) {
      // Check if user already has an order to prevent duplicates
      const existingOrder = await Order.findOne({ userId: user._id });
      if (existingOrder) continue;

      let amount = settings.oneMonthPrice;
      if (user.planType === '3_months') amount = settings.threeMonthsPrice;
      if (user.planType === '1_year') amount = settings.oneYearPrice;

      const order = new Order({
        userId: user._id,
        razorpayOrderId: 'MIGRATED_' + user._id,
        razorpayPaymentId: 'MIGRATED_' + user._id,
        amount: amount,
        planId: user.planType || '1_month',
        createdAt: user.updatedAt || user.createdAt || new Date(),
        status: 'completed'
      });

      await order.save();
      count++;
    }

    console.log(`Migration complete. Created ${count} order records.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
