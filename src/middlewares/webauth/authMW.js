'use strict';

module.exports = function () {
  return function (req, res, next) {
    if (req.session.loggedin === true) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
};
