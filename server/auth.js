const config = require('../config/config.js');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
// const controllers = require('../db/controllers');
// const userController = controllers.userController;

const domain = process.env.AUTH0_DOMAIN || config.AUTH0_DOMAIN;
const clientID = process.env.AUTH0_CLIENT_ID || config.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET || config.AUTH0_CLIENT_SECRET;
const callbackURL = process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback';

const auth0Strategy = new Auth0Strategy({
  domain,
  clientID,
  clientSecret,
  callbackURL,
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
});

passport.use(auth0Strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = {
  passport
};