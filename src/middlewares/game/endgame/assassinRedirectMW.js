'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// if the game is over and the blue team wins and if the player is the assasin,
// redirects him to the guessing page /avalon/game/play/assasin

module.exports = function () {
  return async function (req, res, next) {
    let lobby;
    try {
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    let assassin = false;
    lobby.players.forEach(element => {
      if (
        element.username === req.user.username &&
        element.role === 'assassin'
      ) {
        assassin = true;
      }
    });

    let characters = [];

    lobby.players.forEach(element => {
      characters.push(element.username);
    });

    characters = characters.filter(element => {
      return element !== req.user.username;
    });
    res.locals.characters = characters;

    console.log('This is the redirect middleware', assassin);

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
