'use strict';

const { isFail } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// Puts the scores to res.locals.scores to be rendered and isKing and isChosen for the special button

module.exports = function () {
  return async function (req, res, next) {
    const score = [];
    let lobby;
    try {
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }
    //BUG UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'score' of null
    //Fills up the score list with the current scores to be displayed
    for (let i = 0; i < lobby.score.length; i++) {
      if (typeof lobby.score[i].numberOfFails === 'undefined') {
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

    //Finding out if the current user is the king
    res.locals.king = lobby.votes[lobby.currentRound].king;
    if (req.user.username === lobby.votes[lobby.currentRound].king) {
      res.locals.isKing = true;
    } else {
      res.locals.isKing = false;
    }

    //Finding out if the current player is chosen for the adventure
    let isChosen = false;
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
