'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// if the game is over and the blue team wins and if the player is the assasin,
// redirects him to the guessing page /game/play/assasin

module.exports = function () {
  return async function (req, res, next) {
    let lobby;
    try {
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    // assassin = true if the current user is the assassin
    let assassin = false;
    lobby.players.forEach(element => {
      if (
        element.username === req.user.username &&
        element.role === 'assassin'
      ) {
        assassin = true;
      }
    });

    //all characters from the lobby
    let characters = [];

    lobby.players.forEach(element => {
      characters.push(element.username);
    });

    //filtering out the current user/assassin
    characters = characters.filter(element => {
      return element !== req.user.username;
    });
    res.locals.characters = characters;

    /*FIXME TESTME does this do anything
    res.locals.characters.filter(username => {
      return res.locals.username !== username;
    });*/
    //redirecting anyone to the /game/lobbyCode page who is not the assassin
    if (assassin) {
      return next();
    } else {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }
  };
};
