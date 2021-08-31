'use strict';

// Currently not in use

//TODO make a wipe and use this middleware
module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
