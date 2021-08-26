'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

module.exports = function () {
  return function (req, res, next) {
    findLobbyByCode(res.locals.lobbyCode)
      .then(lobby => {
        res.locals.players = [];
        for (let i = 0; i < lobby.players.length; i++) {
          res.locals.players.push(lobby.players[i].username);
        }
        return next();
      })
      .catch(err => {
        if (err) return next(err);
      });
  };
};
