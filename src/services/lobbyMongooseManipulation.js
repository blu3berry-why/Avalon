'use strict';

/*
  About these functions:
    These functions are for manipulating the lobbies in the database
    They are here to make the middlewares easier to read and the code can be much cleaner this way

*/

const Lobby = require('./../models/lobbyModel');
const lobbyCode = require('./random').sixCharStr;
const { merlinSees, evilSees, percivalSees } = require('../helpers/constants');
const ApiError = require('../middlewares/error/ApiError');

//Lobby
module.exports.createLobby = createLobby;
//module.exports.updateLobby = updateLobby;
//module.exports.findLobby = findLobby;
module.exports.findLobbyByCode = findLobbyByCode;

//Player
module.exports.addPlayer = addPlayer;
module.exports.removeUser = removeUser;
module.exports.findUser = findUser;
module.exports.getUsernamesFromRoles = getUsernamesFromRoles;

//avalon stuff
//module.exports.select = select;
module.exports.addVote = addVote;
module.exports.checkIfChosen = checkIfChosen;
module.exports.voteOnAdventure = voteOnAdventure;
module.exports.getChosen = getChosen;

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
async function createLobby(
  next,
  _assassin,
  _mordred,
  _morgana,
  _oberon,
  _percival,
  _arnold,
  _good,
  _evil,
  _currentRound,
  _currentAdventure,
  _score,
  _votes,
  _adventureVotes,
  _shortcode,
  _players,
  _id
) {
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
    currentRound: set(_currentRound, 0),
    currentAdventure: set(_currentAdventure, 0),
    score: set(_score, [
      { numberOfFails: undefined },
      { numberOfFails: undefined },
      { numberOfFails: undefined },
      { numberOfFails: undefined },
      { numberOfFails: undefined },
    ]),
    started: false,
    failCount: 0,
    readyForAdventure: false,
    votes: set(_votes, []),
    adventureVotes: set(_adventureVotes, []),
    shortcode: lobbyCode(),
    players: set(_players, []),
  };

  if (typeof _id !== 'undefined') {
    newLobby._id = _id;
  }

  const lobby = Lobby(data);

  try {
    await lobby.save();
  } catch (err) {
    throw err;
  }

  //saveLobby(lobby, next);

  return lobby;
}

/**
 * This might seem useless but if we make new functionalities we need to stick to the pattern
 */
/*async function findLobby(query) {
  try {
    return await Lobby.findOne(query);
  } catch (err) {
    throw err;
  }
}*/

async function findLobbyByCode(lobbyCode) {
  try {
    return await Lobby.findOne({ shortcode: lobbyCode });
  } catch (err) {
    throw err;
  }
}

//try does this work?
async function findLobbyByCodePNext(lobbyCode, next) {
  try {
    return await Lobby.findOne({ shortcode: lobbyCode });
  } catch (err) {
    return next(err);
  }
}

async function saveLobby(lobby, next) {
  try {
    await lobby.save();
  } catch (err) {
    next(err);
  }
  return next(ApiError.internal('Hi im the save function :)'));
}

async function findLobbys(query) {
  try {
    return await Lobby.find(query);
  } catch (err) {
    throw err;
  }
}

function replace(obj, newData, field) {
  if (typeof newData[field] !== 'undefined') {
    obj[field] = newData[field];
  }
}

/*
 
 

async function updateLobby(query, newData) {
  try {
    const lobby = await Lobby.findOne(query);

    const fields = [
      'assassin',
      'mordred',
      'morgana',
      'oberon',
      'percival',
      'arnold',
      'started',
      'failCount',
      'readyForAdventure',
      'good',
      'evil',
      'currentRound',
      'currentAdventure',
      'score',
      'votes',
      'adventureVotes',
      'shortcode',
      'players',
      '_id',
    ];

    fields.forEach(element => {
      replace(lobby, newData, assassin);
    });

    await lobby.save();
  } catch (err) {
    throw err;
  }
  return lobby;
}*/

/**
 *
 * @param {*} lobbyCode the code of the lobby
 * @param {*} player in {username: 'username', role: ' '} form
 * @returns the changed lobby
 */
async function addPlayer(lobbyCode, player) {
  try {
    const lobby = await Lobby.findOne({ shortcode: lobbyCode });
    if (!checkUserInLobby(lobby, player.username)) {
      lobby.players.push(player);
    }
    await lobby.save();
    return lobby;
  } catch (err) {
    throw err;
  }
}

function checkUserInLobby(lobby, username) {
  for (let i = 0; i < lobby.players.length; i++) {
    if (lobby.players[i].username === username) {
      return true;
    }
  }
  return false;
}

function checkUserAlreadyVoted(lobby, username) {
  //find the user's name
  for (let i = 0; i < lobby.votes[lobby.currentRound].results.length; i++) {
    if (lobby.votes[lobby.currentRound].results[i].username === username) {
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
async function addVote(lobbyCode, vote) {
  try {
    const lobby = await Lobby.findOne({ shortcode: lobbyCode });
    const round = lobby.currentRound;

    //check if the user is in the lobby
    if (!checkUserInLobby(lobby, vote.username)) {
      //if not

      throw ApiError.internal(
        `This user (${vote.username}) is not in this lobby (${lobbyCode}).`
      );
    }
    //check if the round is the current round
    if (round !== lobby.currentRound) {
      throw ApiError.internal(
        `Currently in the ${lobby.currentRound} not in ${round}.`
      );
    }
    //check if the person alredy voted

    const hasvoted = checkUserAlreadyVoted(lobby, vote.username);

    if (hasvoted) {
      throw ApiError.internal(
        `This user (${vote.username}) has already voted!`
      );
    }

    lobby.votes[lobby.currentRound].results.push(vote);

    // then we save the lobby and return the new lobby
    //!NOTE: check if it is okay to return the lobby and let the async to save as it can.
    await lobby.save();
    return lobby;
  } catch (err) {
    throw err;
  }
}

async function removeUser(lobbyCode, username) {
  function filterUser(value) {
    return !(value.username === username);
  }
  try {
    const lobby = await Lobby.findOne({ shortcode: lobbyCode });
    lobby.players = lobby.players.filter(filterUser);
    await lobby.save();
  } catch (err) {
    throw err;
  }
}

async function voteOnAdventure(lobbyCode, vote) {
  try {
    const lobby = await Lobby.findOne({ shortcode: lobbyCode });

    const noOfAdv = lobby.currentAdventure;

    console.log(lobby.adventureVotes);
    //check if the person alredy voted
    let alreadyVoted = false;
    for (let i = 0; i < lobby.adventureVotes[noOfAdv].results.length; i++) {
      if (lobby.adventureVotes[noOfAdv].results[i].username === vote.username) {
        alreadyVoted = true;
      }
    }

    if (alreadyVoted) {
      throw ApiError.internal(`This user ${vote.username} has already voted`);
    }

    lobby.adventureVotes[noOfAdv].results.push(vote);

    // then we save the lobby and return the new lobby
    await lobby.save();
    return lobby;
  } catch (err) {
    throw err;
  }
}

/*function removeUser(lobbyCode, username) {
  function filterUser(value) {
    return !(value.username === username);
  }

  Lobby.findOne({ shortcode: lobbyCode }).then(lobby => {
    lobby.players = lobby.players.filter(filterUser);
    lobby.save();
  });
}*/

async function checkIfChosen(lobbyCode, username, round) {
  try {
    const lobby = await Lobby.findOne({ shortcode: lobbyCode });

    if (lobby.currentRound !== round) {
      throw ApiError.internal(
        `The current round is ${lobby.currentRound} not ${round}`
      );
    }

    for (let i = 0; i < lobby.votes[round].chosen.length; i++) {
      if (lobby.votes[round].chosen[i].username === username) {
        return true;
      }
    }
    return false;
  } catch (err) {
    throw err;
  }
}

async function findUser(lobbyCode, username) {
  try {
    const lobby = await findLobbyByCode(lobbyCode);

    let user = '';
    lobby.players.forEach(element => {
      if (element.username === username) {
        user = element;
      }
    });

    if (user === '') {
      throw ApiError.internal(`User (${username} not found!)`);
    }
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUsernamesFromRoles(lobbyCode, role, username) {
  try {
    const lobby = await findLobbyByCode(lobbyCode);

    const result = [];

    //TODO make a neet function for the things below :)

    if (role === 'merlin') {
      merlinSees.forEach(element => {
        lobby.players.forEach(item => {
          if (item.role === element && item.username !== username) {
            result.push(item.username);
          }
        });
      });
    }

    if (
      role === 'minion of mordred' ||
      role === 'assassin' ||
      role === 'mordred' ||
      role === 'morgana' ||
      role === 'oberon'
    ) {
      evilSees.forEach(element => {
        lobby.players.forEach(item => {
          if (item.role === element && item.username !== username) {
            result.push(item.username);
          }
        });
      });
    }

    if (role === 'percival') {
      percivalSees.forEach(element => {
        lobby.players.forEach(item => {
          if (item.role === element && item.username !== username) {
            result.push(item.username);
          }
        });
      });
    }

    return result;
  } catch (err) {
    throw err;
  }
}

async function getChosen(lobbyCode) {
  try {
    const lobby = await findLobbyByCode(lobbyCode);
    return lobby.votes[lobby.currentRound].chosen;
  } catch (err) {
    throw err;
  }
}
