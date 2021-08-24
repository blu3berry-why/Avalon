'use strict';
const addPlayer =
  require('./../../services/lobbyMongooseManipulation').addPlayer;

module.exports = function () {
  return function (req, res, next) {
    addPlayer(req.params.lobby_id, {
      username: req.user.username,
      role: ' ',
    })
      .then(lobby => {
        // console.log(lobby);
      })
      .catch(err => {
        //FIXME why does this print an error?
        console.log('ERROR:', err);
      });

    return next();
  };
};
