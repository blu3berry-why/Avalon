'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

// In the setting sets the currently chosen roles to be checked in the form

module.exports = function () {
  return async function (req, res, next) {
    const lobbyCode = req.params.lobby_id;
    res.locals.lobbyCode = lobbyCode;
    try {
      const lobby = await findLobbyByCode(lobbyCode);

      res.locals.characters = [
        lobby.assassin,
        lobby.mordred,
        lobby.morgana,
        lobby.oberon,
        lobby.percival,
        lobby.arnold,
      ];
    } catch (err) {
      return next(err);
    }
    return next();
  };
};
