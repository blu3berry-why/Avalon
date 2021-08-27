'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

// gets the player's selected team

module.exports = function () {
  return async function (req, res, next) {
    const characters = [];
    const lobby = await findLobbyByCode(res.locals.lobbyCode);

    lobby.players.forEach(element => {
      characters.push(element.username);
    });
    res.locals.characters = characters;

    return next();
  };
};
