'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(res.locals.lobbyCode);

    res.locals.players = [];
    for (let i = 0; i < lobby.players.length; i++) {
      res.locals.players.push(lobby.players[i].username);
    }
    return next();
  };
};
