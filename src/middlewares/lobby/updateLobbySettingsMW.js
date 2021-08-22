'use strict';

module.exports = function () {
  return function (req, res, next) {
    const route = '/avalon/join/' + req.session.lobbyCode;
    return res.redirect(route);
  };
};
