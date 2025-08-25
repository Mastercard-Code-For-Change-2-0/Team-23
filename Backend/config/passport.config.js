import User from "../models/user.model.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default function configurePassport(passport) {
  // Only configure Google OAuth if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:3000/api/v1/auth/google/callback",   
        },

        async (accessToken, refreshToken, profile, done) => {
          try {
            
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) return done(null, existingUser);

            const newUser = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails?.[0]?.value || null,
            });

            return done(null, newUser);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
    console.log("Google OAuth configured successfully");
  } else {
    console.log("Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }
}


