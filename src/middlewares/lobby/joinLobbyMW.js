'use strict';
const {
  addPlayer,
  findLobbyByCode,
} = require('./../../services/lobbyMongooseManipulation');

//Searches for the provided code and joins the lobby.

module.exports = function () {
  return async function (req, res, next) {
    try {
      res.locals.lobbyCode = req.params.lobby_id.toUpperCase();
      await addPlayer(req.params.lobby_id, {
        username: req.user.username,
        role: ' ',
      });

      const lobby = await findLobbyByCode(res.locals.lobbyCode);
      if (lobby.started) {
        return res.redirect('/game/' + res.locals.lobbyCode + '/start');
      }
    } catch (err) {
      return next(err);
    }

    return next();
  };
};
