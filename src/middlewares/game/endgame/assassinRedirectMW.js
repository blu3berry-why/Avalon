'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// if the game is over and the blue team wins and if the player is the assasin,
// redirects him to the guessing page /avalon/game/play/assasin

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(res.locals.lobbyCode);
    let assassin = false;
    lobby.players.forEach(element => {
      if (
        element.username === req.user.username &&
        element.role === 'assassin'
      ) {
        assassin = true;
      }
    });

    res.locals.characters.filter(username => {
      return res.locals.username !== username;
    });
    if (assassin) {
      return next();
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }
  };
};
