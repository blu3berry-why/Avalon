'use strict';

module.exports = function () {
  return function (req, res, next) {
    res.locals.lobbyCode = req.params.lobby_id.toUpperCase();
    return next();
  };
};
