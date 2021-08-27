'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');
const { shuffleRoles } = require('../../../services/random');

// randomises the characters and puts the key-value pairs in the database

module.exports = function () {
  return async function (req, res, next) {
    const lobby = await findLobbyByCode(req.params.lobby_id);
    if (lobby.started === false) {
      //console.log(lobby, req.params);
      await shuffleRoles(lobby);
    }

    return res.redirect('/game/' + res.locals.lobbyCode + '/character');
  };
};
