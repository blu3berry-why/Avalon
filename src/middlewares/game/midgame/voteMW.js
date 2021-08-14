'use strict';

// checks if the person already voted and if not takes his vote redirects to /avalon/game/adventure/?staying

module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
