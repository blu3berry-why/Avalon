'use strict';

const createLobby =
  require('./../../services/lobbyMongooseManipulation').createLobby;

module.exports = function () {
  return function (req, res, next) {
    // creating a new lobby then redirecting to the newly created lobby page
    createLobby()
      .then(lobby => {
        return res.redirect(lobby.shortcode);
      })
      // error handling
      .catch(err => {
        if (err) return next(err);
      });
  };
};
