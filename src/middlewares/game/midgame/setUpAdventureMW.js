'use strict';

const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(res.locals.lobbyCode);
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

      console.log(majority, successCount, '----------------');

      if (majority <= successCount && !lobby.readyForAdventure) {
        lobby.failCount = 0;

        console.log('This was a success!');
        // TODO go on adventure
        lobby.readyForAdventure = true;
        lobby.currentAdventure++;
        lobby.adventureVotes[lobby.currentAdventure] = {
          noOfAdv: lobby.currentAdventure,
          results: [],
        };
        await lobby.save();
      } else {
        // TODO increase failCount + reset
        if (typeof lobby.failCount === 'undefined') {
          lobby.failCount = 0;
        }
        lobby.failCount = lobby.failCount + 1;
        //nextRound saves the lobby!
        await nextRound(lobby);
      }
    }
    return res.redirect('/game/' + res.locals.lobbyCode);
  };
};
