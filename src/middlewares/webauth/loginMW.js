'use strict';

module.exports = function () {
  return function (req, res, next) {
    req.session.loggedin = true;
    return res.redirect('/avalon');
  };
};
