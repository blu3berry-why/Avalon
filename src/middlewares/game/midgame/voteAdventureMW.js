'use strict';

const { nextRound, isFail } = require('../../../services/gameLogic');
const {
  voteOnAdventure,
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    let lobby;
    //writing the result in the database
    try {
      if (req.body.action === 'Success') {
        await voteOnAdventure(res.locals.lobbyCode, {
          username: req.user.username,
          result: 'success',
        });
      } else {
        await voteOnAdventure(res.locals.lobbyCode, {
          username: req.user.username,
          result: 'failure',
        });
      }
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    // if the current player is the last one who has voted checking the results
    if (
      lobby.votes[lobby.currentRound].chosen.length ===
      lobby.adventureVotes[lobby.currentAdventure].results.length
    ) {
      let numberOfFails = 0;
      lobby.adventureVotes[lobby.currentAdventure].results.forEach(element => {
        if (element.result === 'failure') {
          numberOfFails++;
        }
      });
      //TESTME write scores
      lobby.score[lobby.currentAdventure - 1].numberOfFails = numberOfFails;
      //TESTME check win

      // finding out how this vote effected the score
      let evilScore = 0;
      let goodScore = 0;
      for (let i = 0; i < lobby.score.length; i++) {
        if (typeof lobby.score[i].numberOfFails !== 'undefined') {
          if (isFail(lobby.players.length, i, lobby.score[i].numberOfFails)) {
            evilScore++;
          } else {
            goodScore++;
          }
        }
      }
      if (goodScore === 3 && lobby.assassin) {
        res.redirect('/game/' + res.locals.lobbyCode + '/assassin');
      }
      if (goodScore === 3 && !lobby.assassin) {
        res.redirect('/game/' + res.locals.lobbyCode + '/goodwin');
      }

      if (evilScore === 3) {
        res.redirect('/game/' + res.locals.lobbyCode + 'evilwin');
      }

      // tis is crucial for only starting an adventure once and not skipping any
      lobby.readyForAdventure = false;
      try {
        await nextRound(lobby);
      } catch (err) {
        return next(err);
      }
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }
  };
};
