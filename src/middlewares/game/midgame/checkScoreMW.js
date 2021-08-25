'use strict';

// redirects to /avalon/game/play/end if either team has 3 points

module.exports = function () {
  return function (req, res, next) {
    res.locals.score = ['empty', 'mordred', 'arthur', 'mordred', 'empty'];
    res.locals.king = 'Robika';
    return next();
  };
};
