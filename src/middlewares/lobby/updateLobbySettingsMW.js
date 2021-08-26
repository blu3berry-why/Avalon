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

module.exports = function () {
  return function (req, res, next) {
    console.log(req.body);
    findLobbyByCode(req.params.lobby_id)
      .then(lobby => {
        lobby.assassin = isSelected(req.body.assassin);
        lobby.mordred = isSelected(req.body.mordred);
        lobby.morgana = isSelected(req.body.morgana);
        lobby.oberon = isSelected(req.body.oberon);
        lobby.percival = isSelected(req.body.percival);
        lobby.arnold = isSelected(req.body.arnold);
        lobby
          .save()
          .then(lobby => {
            const route = '/join/' + req.params.lobby_id;
            return res.redirect(route);
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  };
};
