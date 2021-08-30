'use strict';

const {
  findLobbyByCode,
} = require('../../../services/lobbyMongooseManipulation');

const { exactNumOfAdventurers } = require('../../../services/gameLogic');

module.exports = function () {
  return async function (req, res, next) {
    let lobby;
    try {
      lobby = await findLobbyByCode(res.locals.lobbyCode);
    } catch (err) {
      return next(err);
    }

    const chosen = [];

    for (let i = 0; i < lobby.players.length; i++) {
      if (typeof req.body['person' + i] !== 'undefined') {
        chosen.push(req.body['person' + i]);
      }
    }

    console.log(chosen);
    if (
      exactNumOfAdventurers(
        lobby.players.length,
        lobby.currentAdventure + 1,
        chosen.length
      )
    ) {
      lobby.votes[lobby.currentRound].chosen = chosen;
      try {
        await lobby.save();
      } catch (err) {
        return next(err);
      }

      return res.redirect('/game/' + res.locals.lobbyCode);
    } else {
      return res.send('<h1>This is not the right amount of people!</h1>');
    }
  };
};
