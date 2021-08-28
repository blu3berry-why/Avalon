'use strict';

const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(res.locals.lobbyCode);
    if (
      lobby.players.length === lobby.votes[lobby.currentRound].results.length
    ) {
      const majority = Math.floor(lobby.players.length + 0.5);
      let successCount = 0;

      lobby.votes[lobby.currentRound].results.forEach(element => {
        if (element.result === 'success') {
          successCount++;
        }
      });

      if (majority <= successCount && !readyForAdventure) {
        lobby.failCount = 0;
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
        lobby.failCount++;
        //nextRound saves the lobby!
        nextRound(lobby);
      }
    } else {
      return next();
    }
  };
};
