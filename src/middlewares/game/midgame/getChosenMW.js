'use strict';

const { getChosen } = require('../../../services/lobbyMongooseManipulation');

// gives the chosen players

module.exports = function () {
  return async function (req, res, next) {
    const chosen = await getChosen(res.locals.lobbyCode);
    res.locals.players = chosen;
    return next();
  };
};
