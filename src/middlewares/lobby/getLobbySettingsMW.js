'use strict';

module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
