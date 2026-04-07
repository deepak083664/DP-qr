const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const emails = ['ganu9955171746@gmail.com', 'prince620590@gmail.com'];
    
    for (const email of emails) {
      const user = await User.findOneAndUpdate(
        { email },
        { isAdmin: true, isPaid: true, planType: '1_year' },
        { new: true }
      );
      if (user) {
        console.log(`Successfully upgraded ${email} to Unlimited Access (Admin)`);
      } else {
        console.log(`User not found: ${email} (Maybe they haven't signed up yet?)`);
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
