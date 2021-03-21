const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User.js');

module.exports = function (passport) {
  passport.use(new LocalStrategy(
    function (email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (!user) {
          console.log("NotFound")
          return done(null, false, { msg: 'Account not found' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { msg: 'Password incorrect' });
          }
        });
      });
    }
  ));
  passport.serializeUser(function (user, done) { done(null, user.id); });
  passport.deserializeUser(function (id, done) { User.findById(id, function (err, user) { done(err, user); }); });
}
