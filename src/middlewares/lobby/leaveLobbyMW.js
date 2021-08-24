'use strict';
const removeUser =
  require('./../../services/lobbyMongooseManipulation').removeUser;

module.exports = function () {
  return function (req, res, next) {
    removeUser(req.params.lobby_id, req.user.username);
    return next();
  };
};
