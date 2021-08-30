'use strict';

const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    try {
      const lobby = await findLobbyByCode(res.locals.lobbyCode);
      //if everyone voted we can see the results
      if (
        lobby.players.length <= lobby.votes[lobby.currentRound].results.length
      ) {
        const majority = Math.floor(lobby.players.length / 2 + 0.5);
        let successCount = 0;

        lobby.votes[lobby.currentRound].results.forEach(element => {
          if (element.result === 'success') {
            successCount++;
          }
        });

        if (majority <= successCount && !lobby.readyForAdventure) {
          lobby.failCount = 0;

          // go on adventure
          lobby.readyForAdventure = true;
          lobby.currentAdventure++;
          lobby.adventureVotes[lobby.currentAdventure] = {
            noOfAdv: lobby.currentAdventure,
            results: [],
          };
          await lobby.save();

          // this is going to run multiple times!!!
          // not true because if someone tries to vote twice the function throws an error
        } else {
          // increase failCount + reset
          if (typeof lobby.failCount === 'undefined') {
            lobby.failCount = 0;
          }
          lobby.failCount = lobby.failCount + 1;
          //nextRound saves the lobby!
          await nextRound(lobby);
        }
      }
    } catch (err) {
      return next(err);
    }
    return res.redirect('/game/' + res.locals.lobbyCode);
  };
};
