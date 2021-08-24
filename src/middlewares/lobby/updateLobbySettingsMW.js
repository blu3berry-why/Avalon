'use strict';

module.exports = function () {
  return function (req, res, next) {
    const route = '/join/' + req.session.lobbyCode;
    return res.redirect(route);
  };
};
