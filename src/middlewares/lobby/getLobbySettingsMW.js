'use strict';

module.exports = function () {
  return function (req, res, next) {
    res.locals.lobbyCode = req.params.lobby_id;
    console.log(req.params.lobby_id);
    return next();
  };
};
