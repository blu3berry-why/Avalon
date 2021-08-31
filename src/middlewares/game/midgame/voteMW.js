'use strict';

const { addVote } = require('../../../services/lobbyMongooseManipulation');

// checks if the person already voted and if not takes his vote
module.exports = function () {
  return async function (req, res, next) {
    try {
      if (req.body.action === 'Success') {
        await addVote(res.locals.lobbyCode, {
          username: req.user.username,
          result: 'success',
        });
      } else {
        await addVote(res.locals.lobbyCode, {
          username: req.user.username,
          result: 'failure',
        });
      }
    } catch (err) {
      return next(err);
    }
    return next();
  };
};
