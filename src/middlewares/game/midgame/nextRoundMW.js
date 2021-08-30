const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

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
