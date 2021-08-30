'use strict';

const { nextRound, isFail } = require('../../../services/gameLogic');
const {
  voteOnAdventure,
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    let lobby;
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

      lobby.readyForAdventure = false;
      try {
        await nextRound(lobby);
      } catch (err) {
        return next(err);
      }

      console.log('----------------Next Round ----------------');
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }
  };
};
