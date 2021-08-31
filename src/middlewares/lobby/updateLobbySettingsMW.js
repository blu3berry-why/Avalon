'use strict';
const findLobbyByCode =
  require('../../services/lobbyMongooseManipulation').findLobbyByCode;

function isSelected(role) {
  if (typeof role === 'undefined') {
    return false;
  } else {
    return true;
  }
}

// Updates the database with the incoming data from the POST request

module.exports = function () {
  return async function (req, res, next) {
    try {
      const lobby = await findLobbyByCode(req.params.lobby_id);

      lobby.assassin = isSelected(req.body.assassin);
      lobby.mordred = isSelected(req.body.mordred);
      lobby.morgana = isSelected(req.body.morgana);
      lobby.oberon = isSelected(req.body.oberon);
      lobby.percival = isSelected(req.body.percival);
      lobby.arnold = isSelected(req.body.arnold);
      await lobby.save();
    } catch (err) {
      return next(err);
    }

    const route = '/join/' + req.params.lobby_id;
    return res.redirect(route);
  };
};
