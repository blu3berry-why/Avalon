const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// Calls next round if the lobby hasn't started its crucial because only once can you start the lobby

module.exports = function () {
  return async function (req, res, next) {
    try {
      const lobby = await findLobbyByCode(res.locals.lobbyCode);
      if (!lobby.started) {
        await nextRound(lobby);
      }
    } catch (err) {
      return next(err);
    }

    return next();
  };
};
