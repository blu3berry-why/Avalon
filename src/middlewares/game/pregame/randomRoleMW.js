'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');
const { shuffleRoles } = require('../../../services/random');

// randomises the characters and puts the key-value pairs in the database

module.exports = function () {
  return async function (req, res, next) {
    try {
      const lobby = await findLobbyByCode(req.params.lobby_id);
      if (lobby.started === false) {
        await shuffleRoles(lobby);
      }
    } catch (err) {
      return next(err);
    }

    return res.redirect('/game/' + res.locals.lobbyCode + '/character');
  };
};
