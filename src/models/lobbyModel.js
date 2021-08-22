const Schema = require('mongoose').Schema;
const db = require('./../config/MongoDB/mongodb').db;

const Lobby = db.model('Lobby', {
  // This is the short code via which players can find a lobby (It's gonna be lik 6 digits or so)
  shortcode: String,
  // This is the list of the players and their chosen nickname
  players: [{ username: String, nickname: String }],
  // These booleans tell if a certain special character is picked
  //(Merlin is always there and by the players we can add the minions of Mordres and the servants of Arthur)
  assassin: Boolean,
  mordred: Boolean,
  morgana: Boolean,
  oberon: Boolean,
  percival: Boolean,
  arnold: Boolean,
  //teams
  good: Number,
  evil: Number,
  // This keeps the scores and how many fails were in them
  score: [{ numberOfFails: Number }],
  // This one keeps the votes in count in all rounds and it can be traced back
  votes: [
    {
      // The rounds number
      round: Number,
      // The players and their votes
      result: [{ username: String, type: String }],
    },
  ],
});

module.exports = Lobby;
