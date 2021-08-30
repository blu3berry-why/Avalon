'use strict';

const createLobby =
  require('./../../services/lobbyMongooseManipulation').createLobby;

module.exports = function () {
  return async function (req, res, next) {
    // creating a new lobby then redirecting to the newly created lobby page
    let lobby;
    try {
      lobby = await createLobby();
    } catch (err) {
      return next(err);
    }

    return res.redirect(lobby.shortcode);
  };
};
