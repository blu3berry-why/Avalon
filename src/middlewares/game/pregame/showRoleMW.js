'use strict';

const { description, evil } = require('../../../helpers/constants');
const { capitalize } = require('../../../helpers/formatting');
const {
  findUser,
  getUsernamesFromRoles,
} = require('../../../services/lobbyMongooseManipulation');

// gets the players name and searches in the database and redirects to /game/lobbyCode/character

module.exports = function () {
  return async function (req, res, next) {
    let user;
    let sees;
    try {
      user = await findUser(req.params.lobby_id, req.user.username);

      // gets the users who the current character sees
      sees = await getUsernamesFromRoles(
        res.locals.lobbyCode,
        user.role,
        user.username
      );
    } catch (err) {
      return next(err);
    }
    // capitalises the role
    res.locals.user_role = capitalize(user.role);

    //TODO we need the picture
    res.locals.picture = 'Insert picture';

    // putting the descriptions under the image. Unfortunatelly spaces can't be part of a property so the minion of mordred and the servant of arthur
    // needed to be checked separatly. Maybe change it later(TODO)
    if (user.role === 'minion of mordred') {
      res.locals.description = description.minion;
    } else if (user.role === 'servant of arthur') {
      res.locals.description = description.servant;
    } else {
      res.locals.description = description[user.role];
    }

    // Setting if the character is evil or good
    res.locals.team = 'Good';
    evil.forEach(item => {
      if (item === user.role) {
        res.locals.team = 'Evil';
      }
    });

    res.locals.members = sees;

    // If the cahracter is the assassin they will get an extra button to be able to guess early
    let isAssassin = false;
    if (user.role === 'assassin') {
      isAssassin = true;
    }

    res.locals.isAssassin = isAssassin;

    return next();
  };
};
