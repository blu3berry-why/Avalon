const { adventureLimit } = require('../helpers/constants');
const { findLobbyByCode } = require('./lobbyMongooseManipulation');

module.exports.nextRound = nextRound;
module.exports.isFail = isFail;

//sets the king as the user at the given round
async function setKing(lobbyCode, round, username) {
  const lobby = await findLobbyByCode(lobbyCode);
  lobby.votes[round].king = username;
  await lobby.save();
}

function findNextKing(players, username) {
  let index = 0;
  for (let i = 0; i < players.length; i++) {
    if (players[i].username === username) {
      index = i;
    }
  }

  if (index === players.length - 1) {
    return players[0].username;
  } else {
    return players[index].username;
  }
}

async function nextRound(lobby) {
  let round = lobby.votes.length;
  if (lobby.votes.length === 0) {
    round++;
  }
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

  await lobby.save();
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
