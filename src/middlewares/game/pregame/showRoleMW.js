'use strict';

const { description, evil } = require('../../../helpers/constants');
const { capitalize } = require('../../../helpers/formatting');
const {
  findUser,
  getUsernamesFromRoles,
} = require('../../../services/lobbyMongooseManipulation');

// gets the players name and searches in the database and redirects to /game/show_role/character

module.exports = function () {
  return async function (req, res, next) {
    let user;
    let sees;
    try {
      user = await findUser(req.params.lobby_id, req.user.username);

      sees = await getUsernamesFromRoles(
        res.locals.lobbyCode,
        user.role,
        user.username
      );
    } catch (err) {
      return next(err);
    }
    res.locals.user_role = capitalize(user.role);
    res.locals.picture = 'Insert picture';
    if (user.role === 'minion of mordred') {
      res.locals.description = description.minion;
    } else if (user.role === 'servant of arthur') {
      res.locals.description = description.servant;
    } else {
      res.locals.description = description[user.role];
    }
    res.locals.team = 'Good';
    evil.forEach(item => {
      if (item === user.role) {
        res.locals.team = 'Evil';
      }
    });

    res.locals.members = sees;

    let isAssassin = false;
    if (user.role === 'assassin') {
      isAssassin = true;
    }

    res.locals.isAssassin = isAssassin;

    return next();
  };
};
