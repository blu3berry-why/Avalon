'use strict';

// redirects to /avalon/game/play/end if either team has 3 points

module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
