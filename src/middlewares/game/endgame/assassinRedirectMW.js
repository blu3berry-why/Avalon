'use strict';

// if the game is over and the blue team wins and if the player is the assasin,
// redirects him to the guessing page /avalon/game/play/assasin

module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
