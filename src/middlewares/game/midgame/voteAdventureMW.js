'use strict';

const {
  voteOnAdventure,
} = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return function (req, res, next) {
    if (req.body.action === 'Success') {
      voteOnAdventure(res.locals.lobbyCode, {
        username: req.user.username,
        result: 'success',
      });
    } else {
      voteOnAdventure(res.locals.lobbyCode, {
        username: req.user.username,
        result: 'failure',
      });
    }
    return res.redirect('/game/' + res.locals.lobbyCode);
  };
};
