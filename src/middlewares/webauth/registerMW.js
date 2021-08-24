const db = require('./../../config/MongoDB/mongoose').db;
const genPassword = require('./../../helpers/passwordUtils').genPassword;

module.exports = function () {
  return function (req, res, next) {
    if (
      typeof req.body.username === 'undefined' ||
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
      //TODO make a better from for this and match the elements
      emailaddress: 'email@email.com',
      _friends: [],
    };
    db.models.User.create(newUser);

    return res.redirect('/avalon');
  };
};
