'use strict';

const crypto = require('crypto');

function genPassword(password) {
  /* 
    !NOTE: This is for generating a hash for a new user to be able to store it securly in the database
    !NOTE: You can't store passwords as Strings because if someone hacks it they have all the user credentials they need!
     */

  // salt is for more randomness
  let salt = crypto.randomBytes(32).toString('hex');

  // password - the password in string form, salt, 10000 - thats how many iterations the algorithm will make, 64 - thats how long the hash will be, sha512 the algorithm's name
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

// password - the password in string form coming from the user, hash - the stored hash from the database, salt the salt value from the database
function validatePassword(password, hash, salt) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

module.exports.genPassword = genPassword;
module.exports.validatePassword = validatePassword;
