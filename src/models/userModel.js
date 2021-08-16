const Schema = require('mongoose').Schema;
const db = require('./../config/MongoDB/mongodb').db;

const User = db.model('User', {
  username: String,
  passwordhash: String,
  emailaddress : String,
  _friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
  }]
});

module.exports = User;
