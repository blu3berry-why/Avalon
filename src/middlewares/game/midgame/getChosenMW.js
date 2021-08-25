'use strict';

// gives the choosen players

module.exports = function () {
  return function (req, res, next) {
    res.locals.players = ['Frank', 'Alex', 'Meghan', 'Jenny', 'Paul'];
    return next();
  };
};
