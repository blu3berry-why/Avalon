const Schema = require('mongoose').Schema;
const db = require('./../config/MongoDB/mongodb').db;

const User = db.model('User', {
  username: String,
  // this is the hash of the password
  hash: String,
  // this is the salt this makes it more secure more on this at the node crypto module
  salt: String,
  emailaddress: String,
  _friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = User;
