'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

// Sets the players' usernames to res.locals.players

module.exports = function () {
  return async function (req, res, next) {
    try {
      const lobby = await findLobbyByCode(res.locals.lobbyCode);

      res.locals.players = [];
      for (let i = 0; i < lobby.players.length; i++) {
        res.locals.players.push(lobby.players[i].username);
      }
    } catch (err) {
      return next(err);
    }
    return next();
  };
};
