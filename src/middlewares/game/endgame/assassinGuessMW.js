'use strict';

const { findUser } = require('../../../services/lobbyMongooseManipulation');

// checks if the assasin's guess is correct if it is the servants of Mordred win

module.exports = function () {
  return async function (req, res, next) {
    let user;
    try {
      user = await findUser(res.locals.lobbyCode, req.body.person);
    } catch (err) {
      return next(err);
    }

    if (user.role === 'merlin') {
      return res.redirect('/game/' + res.locals.lobbyCode + '/evilwin');
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode + '/goodwin');
    }
  };
};
