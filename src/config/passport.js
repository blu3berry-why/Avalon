const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./MongoDB/mongodb').db;
const User = db.models.User;
const validatePassword = require('./../helpers/passwordUtils').validatePassword;

// The passportMW requires this kind of object with the new names if the properties of the body object is different
// passport looks for these properties
const customFields = {
  usernameField: 'username',
  passwordField: 'password',
};

const verifyCallback = (username, password, cb) => {
  User.findOne({ username: username })
    .then(user => {
      //if there is no user with this name
      //passport will return a 401 status
      if (!user) {
        return cb(null, false);
      }

      // Function for verifying
      const isValid = validatePassword(password, user.hash, user.salt);

      if (isValid) {
        // if all things are valid we return the user
        return cb(null, user);
      } else {
        // if something is wrong we deny access
        return cb(null, false);
      }
    })
    .catch(err => {
      cb(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((userId, cb) => {
  User.findById(userId)
    .then(user => {
      cb(null, user);
    })
    .catch(err => cb(err));
});
