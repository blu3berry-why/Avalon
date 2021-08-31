'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// Puts all players' username to res.locals.characters
// Also if the current user isn't the king redirects to /game/lobbyCode

module.exports = function () {
  return async function (req, res, next) {
    const characters = [];
    let lobby;
    try {
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    if (lobby.votes[lobby.currentRound].king !== req.user.username) {
      return res.redirect('/game/' + res.locals.lobbyCode);
    }

    lobby.players.forEach(element => {
      characters.push(element.username);
    });
    res.locals.characters = characters;

    return next();
  };
};
