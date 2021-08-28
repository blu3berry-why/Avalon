'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// redirects to /game/play/end if either team has 3 points

module.exports = function () {
  return async function (req, res, next) {
    res.locals.score = ['empty', 'mordred', 'arthur', 'mordred', 'empty'];

    const lobby = await findLobbyByCode(res.locals.lobbyCode);

    res.locals.king = lobby.votes[lobby.currentRound].king;
    if (req.user.username === lobby.votes[lobby.currentRound].king) {
      res.locals.isKing = true;
    } else {
      res.locals.isKing = false;
    }
    return next();
  };
};
