'use strict';

const {
  voteOnAdventure,
} = require('../../../services/lobbyMongooseManipulation');

// voting on adventure

module.exports = function () {
  return function (req, res, next) {
    voteOnAdventure(res.locals.lobbyCode, {});
    return next();
  };
};
