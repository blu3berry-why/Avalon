'use strict';

const { isFail } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// redirects to /game/play/end if either team has 3 points

module.exports = function () {
  return async function (req, res, next) {
    const score = [];
    const lobby = await findLobbyByCode(res.locals.lobbyCode);

    for (let i = 0; i < lobby.score.length; i++) {
      if (typeof lobby.score[i] === 'undefined') {
        score.push('empty');
      } else {
        if (isFail(lobby.players.length, i, lobby.score[i].numberOfFails)) {
          score.push('mordred');
        } else {
          score.push('arthur');
        }
      }
    }
    res.locals.score = score;

    res.locals.king = lobby.votes[lobby.currentRound].king;
    if (req.user.username === lobby.votes[lobby.currentRound].king) {
      res.locals.isKing = true;
    } else {
      res.locals.isKing = false;
    }

    let isChosen = false;
    //is chosen for the adventure
    if (lobby.readyForAdventure) {
      for (let i = 0; i < lobby.votes[lobby.currentRound].chosen.length; i++) {
        if (lobby.votes[lobby.currentRound].chosen[i] === req.user.username) {
          isChosen = true;
        }
      }
    }

    res.locals.isChosen = isChosen;

    return next();
  };
};
