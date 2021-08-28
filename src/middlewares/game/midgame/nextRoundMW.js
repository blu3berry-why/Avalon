const { nextRound } = require('../../../services/gameLogic');

module.exports = function () {
  return function (req, res, next) {
    nextRound();
    return next();
  };
};
