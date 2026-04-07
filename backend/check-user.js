require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'prince620590@gmail.com';
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    
    if (user) {
      console.log('User found!');
      console.log('Email:', user.email);
      console.log('Password hash starts with $2?', user.password.startsWith('$2'));
      console.log('Password length:', user.password.length);
      console.log('Full hash:', user.password);
    } else {
      console.log('User not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
