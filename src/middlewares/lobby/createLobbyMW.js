'use strict';

const db = require('./../../config/MongoDB/mongodb').db;
const lobbyCode = require('./../../services/random').sixCharStr;

module.exports = function () {
  return function (req, res, next) {
    const newLobby = {
      shortcode: lobbyCode(),
      players: [],
      assassin: false,
      mordred: false,
      morgana: false,
      oberon: false,
      percival: false,
      arnold: false,

      good: 0,
      evil: 0,
      score: [],
      votes: [],
    };

    // !QUESTION: would it be better if we used the id from the database?
    req.session.lobbyCode = newLobby.shortcode;

    db.models.Lobby.create(newLobby);

    //    return next();
    const route = '/avalon/join/' + req.session.lobbyCode;
    return res.redirect(route);
  };
};
