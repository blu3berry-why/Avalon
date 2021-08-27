'use strict';

const createLobby =
  require('./../../services/lobbyMongooseManipulation').createLobby;

module.exports = function () {
  return async function (req, res, next) {
    // creating a new lobby then redirecting to the newly created lobby page
    const lobby = await createLobby();
    return res.redirect(lobby.shortcode);
  };
};
