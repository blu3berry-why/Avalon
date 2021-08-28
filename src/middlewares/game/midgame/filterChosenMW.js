'use strict';

const { getChosen } = require('../../../services/lobbyMongooseManipulation');

module.exports = function () {
  return async function (req, res, next) {
    const chosen = await getChosen(res.locals.lobbyCode);
    let isChosen = false;
    chosen.forEach(element => {
      if (element === req.user.username) {
        isChosen = true;
      }
    });

    if (isChosen) {
      return next();
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }
  };
};
