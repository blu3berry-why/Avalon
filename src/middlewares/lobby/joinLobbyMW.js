'use strict';
const db = require('./../../config/MongoDB/mongodb').db;

module.exports = function () {
  return function (req, res, next) {
    const code = req.session.lobbyCode;
    db.models.Lobby.findOne({ shortcode: code }).then(lobby => {
      // !QUESTION: How will I know the user's information
      /*lobby.players.add({ username: 'username', nickname: 'nickname' });*/
      console.log(lobby);
      // FIXME it runs twice why?
      console.log('printing twice?');
    });

    return next();
  };
};
