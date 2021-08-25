'use strict';
const addPlayer =
  require('./../../services/lobbyMongooseManipulation').addPlayer;

module.exports = function () {
  return function (req, res, next) {
    res.locals.lobbyCode = req.params.lobby_id;
    addPlayer(req.params.lobby_id, {
      username: req.user.username,
      role: ' ',
    })
      .then(lobby => {
        // console.log(lobby);
      })
      .catch(err => {
        console.log('ERROR:', err);
      });

    return next();
  };
};
