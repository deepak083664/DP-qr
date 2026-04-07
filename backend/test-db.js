require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB.");
  const users = await User.find({});
  console.log("Users:", users);
  process.exit(0);
}).catch(console.error);
