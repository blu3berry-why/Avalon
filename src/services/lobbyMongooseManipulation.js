'use strict';

/*
  About these functions:
    These functions are for manipulating the lobbies in the database
    They are here to make the middlewares easier to read and the code can be much cleaner this way

*/

const Lobby = require('./../models/lobbyModel');
const lobbyCode = require('./random').sixCharStr;

function set(_new, old) {
  if (typeof _new === 'undefined') {
    return old;
  } else {
    return _new;
  }
}

/**
 * This function creates a lobby object from the given arguments.
 * If there is no arguments it will create a lobby with the default parameters.
 */
function createLobby(
  _assassin,
  _mordred,
  _morgana,
  _oberon,
  _percival,
  _arnold,
  _good,
  _evil,
  _currentRound,
  _score,
  _votes,
  _shortcode,
  _players,
  _id
) {
  return new Promise((resolve, reject) => {
    // given values / starter values
    const data = {
      assassin: set(_assassin, false),
      mordred: set(_mordred, false),
      morgana: set(_morgana, false),
      oberon: set(_oberon, false),
      percival: set(_percival, false),
      arnold: set(_arnold, false),
      good: set(_good, 0),
      evil: set(_evil, 0),
      currentRound: set(_currentRound, 1),
      score: set(_score, []),
      votes: set(_votes, []),
      shortcode: lobbyCode(),
      players: set(_players, []),
    };

    if (typeof _id !== 'undefined') {
      newLobby._id = _id;
    }

    const lobby = Lobby(data);

    lobby.save(err => {
      if (err) {
        reject(err);
      } else {
        resolve(lobby);
      }
    });
  });
}

/**
 * This might seem useless but if we make new functionalities we need to stick to the pattern
 */
function findLobby(query) {
  return new Promise((resolve, reject) => {
    Lobby.find(query)
      .then(lobby => {
        resolve(lobby);
      })
      .catch(err => {
        if (err) reject(err);
      });
  });
}

function replace(obj, newData, field) {
  if (typeof newData[field] !== 'undefined') {
    obj[field] = newData[field];
  }
}

/**
 *
 */

function updateLobby(query, newData) {
  return new Promise((resolve, reject) => {
    Lobby.findOne(query)
      .then(lobby => {
        // TODO surely there are some better solution
        replace(lobby, newData, 'assassin');
        replace(lobby, newData, 'mordred');
        replace(lobby, newData, 'morgana');
        replace(lobby, newData, 'oberon');
        replace(lobby, newData, 'percival');
        replace(lobby, newData, 'arnold');
        replace(lobby, newData, 'good');
        replace(lobby, newData, 'evil');
        replace(lobby, newData, 'currentRound');
        replace(lobby, newData, 'score');
        replace(lobby, newData, 'votes');
        replace(lobby, newData, 'shortcode');
        replace(lobby, newData, 'players');
        replace(lobby, newData, '_id');

        lobby.save(err => {
          if (err) reject(err);
          resolve(lobby);
        });
      })
      .catch(err => {
        if (err) reject(err);
      });
  });
}

/*
TODO:
  -ADD:
      player - done
      vote - done
      score
*/

/**
 *
 * @param {*} lobbyCode the code of the lobby
 * @param {*} player in {username: 'username', role: ' '} form
 * @returns the changed lobby
 */
function addPlayer(lobbyCode, player) {
  return new Promise((resolve, reject) => {
    Lobby.findOne({ shortcode: lobbyCode })
      .then(lobby => {
        if (!checkUserInLobby(lobby, player.username)) {
          lobby.players.push(player);
        }
        resolve(lobby);
        lobby.save(err => {
          if (err) reject(err);
        });
      })
      .catch(err => {
        if (err) reject(err);
      });
  });
}

function checkUserInLobby(lobby, username) {
  for (let i = 0; i < lobby.players.length; i++) {
    if (lobby.players[i].username === username) {
      return true;
    }
  }
  return false;
}

function findRound(lobby, round) {
  // find the current round
  for (let i = 0; i < lobby.votes.length; i++) {
    if (lobby.votes[i].currentRound === round) {
      thisRound = lobby.votes[i];
    }
  }
  return 'not found';
}
function checkUserAlreadyVoted(lobby, round, username) {
  let thisRound = findRound(lobby, round);

  //TODO what happens if we dont find it and why can that be?
  if (thisRound === 'not found') {
    throw new Error('there is no such round');
  }

  //find the user's name
  for (let i = 0; i < thisRound.results.length; i++) {
    if (thisRound.results[i].username === username) {
      //if the user's name match
      return true;
    }
  }
  // if the name is not already there
  return false;
}

/**
 * Adds a vote to the current rounds votes
 * @param {string} lobbyCode the short-code to the current lobby
 * @param {number} round the round when the vote took place
 * @param {*} vote the user's name and their vote in {username: 'username', result: (can be 'fail' or 'success')} format
 * @returns
 */
function addVote(lobbyCode, round, vote) {
  return new Promise((reject, resolve) => {
    Lobby.findOne({ shortcode: lobbyCode })
      .then(lobby => {
        //check if the user is in the lobby
        if (!checkUserInLobby(lobby, vote.username)) {
          //if not
          reject(
            new Error(
              `This user (${vote.username}) is not in this lobby (${lobbyCode}).`
            )
          );
        }

        //check if the round is the current round
        if (round !== lobby.currentRound) {
          // TODO
          reject(
            new Error(`Currently in the ${lobby.currentRound} not in ${round}.`)
          );
        }
        //check if the person alredy voted

        let hasvoted;
        try {
          hasvoted = checkUserAlreadyVoted(lobby, round, vote.username);
        } catch (err) {
          reject(err);
        }

        if (hasvoted) {
          reject(new Error(`This user (${vote.username}) has already voted!`));
        }

        //if there is no problem we can add the vote to the results
        const currentRound = findRound(lobby, round);
        currentRound.results.push(vote);

        // then we save the lobby and return th enew lobby
        lobby.save(err => {
          if (err) reject(err);
          resolve(lobby);
        });
      })
      .catch(err => {
        if (err) reject(err);
      });
  });
}

function removeUser(lobbyCode, username) {
  function filterUser(value) {
    return !(value.username === username);
  }

  Lobby.findOne({ shortcode: lobbyCode }).then(lobby => {
    lobby.players = lobby.players.filter(filterUser);
    lobby.save();
  });
}

module.exports.createLobby = createLobby;
module.exports.updateLobby = updateLobby;
module.exports.findLobby = findLobby;
module.exports.addPlayer = addPlayer;
module.exports.addVote = addVote;
module.exports.removeUser = removeUser;
