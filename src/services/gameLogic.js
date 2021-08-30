const { adventureLimit } = require('../helpers/constants');
const { findLobbyByCode } = require('./lobbyMongooseManipulation');

module.exports.nextRound = nextRound;
module.exports.isFail = isFail;

//sets the king as the user at the given round
async function setKing(lobbyCode, round, username) {
  try {
    const lobby = await findLobbyByCode(lobbyCode);
    lobby.votes[round].king = username;
    await lobby.save();
  } catch (err) {
    throw err;
  }
}

function findNextKing(players, username) {
  let index = 0;
  for (let i = 0; i < players.length; i++) {
    if (players[i].username === username) {
      //the next player
      index = i + 1;
    }
  }

  if (index === players.length) {
    return players[0].username;
  } else {
    return players[index].username;
  }
}

async function nextRound(lobby) {
  if (lobby.nextRound === 0) {
    lobby.votes[0] = {
      king: '',
    };
  }

  lobby.currentRound = lobby.currentRound + 1;
  let round = lobby.currentRound;

  lobby.votes[round] = {
    round: round,
  };

  if (lobby.votes.length > 2) {
    lobby.votes[round].king = findNextKing(
      lobby.players,
      lobby.votes[round - 1].king
    );
  } else {
    lobby.votes[round].king = lobby.players[0].username;
  }
  try {
    await lobby.save();
  } catch (err) {
    throw err;
  }
}

function isFail(players, round, numberOfFails) {
  if (players > 6) {
    if (round === 4) {
      if (numberOfFails >= 2) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (numberOfFails >= 1) {
    return true;
  } else {
    return false;
  }
}

function exactNumOfAdventurers(players, round, numberOfAdventurers) {
  console.log(adventureLimit[players][round]);
  return adventureLimit[players][round] === numberOfAdventurers;
}

module.exports.exactNumOfAdventurers = exactNumOfAdventurers;
