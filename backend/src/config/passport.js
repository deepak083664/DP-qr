const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true // Allows Passport to construct the callback using the Vercel frontend domain
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // If user logged in first time with google but email existed, link them
        if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.profilePic && profile.photos && profile.photos[0]) {
            user.profilePic = profile.photos[0].value;
          }
          await user.save();
        }
        return done(null, user);
      }

      // If user does not exist, create new
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
      });

      await user.save();
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth Error:', err);
      return done(err, null);
    }
  }
));

// Serialize and deserialize aren't strictly necessary when using pure JWT via cookie without actual express-session auth persistence,
// but passport requires them if we use standard session settings. Since we are using {session: false} in auth.js, we might not need them.
// We will still define them just in case.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
