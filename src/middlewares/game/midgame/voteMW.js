'use strict';

const { addVote } = require('../../../services/lobbyMongooseManipulation');

// checks if the person already voted and if not takes his vote redirects to /avalon/game/adventure/?staying

module.exports = function () {
  return function (req, res, next) {
    if (req.body.action === 'Success') {
      addVote(res.locals.lobbyCode, {
        username: req.user.username,
        result: 'success',
      });
    } else {
      addVote(res.locals.lobbyCode, {
        username: req.user.username,
        result: 'failure',
      });
    }
    return res.redirect('/game/' + res.locals.lobbyCode);
  };
};
