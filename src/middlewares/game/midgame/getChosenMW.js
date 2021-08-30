'use strict';

const { getChosen } = require('../../../services/lobbyMongooseManipulation');

// gives the chosen players

module.exports = function () {
  return async function (req, res, next) {
    let chosen;
    try {
      chosen = await getChosen(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    res.locals.players = chosen;
    return next();
  };
};
