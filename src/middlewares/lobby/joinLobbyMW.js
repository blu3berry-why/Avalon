'use strict';
const addPlayer =
  require('./../../services/lobbyMongooseManipulation').addPlayer;

module.exports = function () {
  return async function (req, res, next) {
    res.locals.lobbyCode = req.params.lobby_id;
    await addPlayer(req.params.lobby_id, {
      username: req.user.username,
      role: ' ',
    });
    return next();
  };
};
