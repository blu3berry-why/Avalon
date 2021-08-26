'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

module.exports = function () {
  return function (req, res, next) {
    const lobbyCode = req.params.lobby_id;
    res.locals.lobbyCode = lobbyCode;
    findLobbyByCode(lobbyCode)
      .then(lobby => {
        res.locals.characters = [
          lobby.assassin,
          lobby.mordred,
          lobby.morgana,
          lobby.oberon,
          lobby.percival,
          lobby.arnold,
        ];
        return next();
      })
      .catch(err => next(err));
  };
};
