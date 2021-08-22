'use strict';

module.exports = function () {
  return function (req, res, next) {
    if (req.session.loggedin === true) {
      req.session.destroy(err => {
        if (err) {
          return next(err);
        }
      });
    }
    return res.redirect('/');
  };
};
