'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

module.exports = function () {
  return async function (req, res, next) {
    const lobbyCode = req.params.lobby_id;
    res.locals.lobbyCode = lobbyCode;
    const lobby = await findLobbyByCode(lobbyCode);

    res.locals.characters = [
      lobby.assassin,
      lobby.mordred,
      lobby.morgana,
      lobby.oberon,
      lobby.percival,
      lobby.arnold,
    ];
    return next();
  };
};
