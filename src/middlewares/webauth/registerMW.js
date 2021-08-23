const db = require('./../../config/MongoDB/mongodb').db;
const genPassword = require('./../../helpers/passwordUtils').genPassword;

module.exports = function () {
  return function (req, res, next) {
    if (
      typeof req.body.username === 'undefined' ||
      typeof req.body.email === 'undefined' ||
      typeof req.body.password === 'undefined'
    ) {
      return res.redirect('/');
    }

    console.log(res.locals);
    const secureCredentials = genPassword(req.body.password);
    const newUser = {
      username: req.body.username,
      hash: secureCredentials.hash,
      salt: secureCredentials.salt,
      emailaddress: req.body.email,
      _friends: [],
    };
    db.models.User.create(newUser);

    return res.redirect('/avalon');
  };
};
