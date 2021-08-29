const { nextRound } = require('../../../services/gameLogic');
const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(res.locals.lobbyCode);
    await nextRound(lobby);
    return next();
  };
};
