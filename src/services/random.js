'use strict';

const { fileLoader } = require('ejs');
const { player_balance } = require('../helpers/constants');
const ApiError = require('../middlewares/error/ApiError');

// A random 6 character long string

function sixCharStr() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * 36));
  }
  return result.toUpperCase();
}

function fill(evil, good, pool) {
  for (let i = 0; i < evil; i++) {
    pool.push('evil');
  }
  for (let i = 0; i < good; i++) {
    pool.push('good');
  }
}

function magic(roles, goods, evils, pool, lobby) {
  for (let i = 0; i < roles.length; i++) {
    if (
      (roles[i] === 'percival' || roles[i] === 'arnold') &&
      goods > 0 &&
      lobby[roles[i]]
    ) {
      pool.push(roles[i]);
      goods--;
    } else if (evils > 0 && lobby[roles[i]]) {
      pool.push(roles[i]);
      evils--;
    }
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function shuffleRoles(lobby) {
  const players_number = lobby.players.length;
  const goods = player_balance[players_number].good - 1;
  const evils = player_balance[players_number].evil;
  const rolePool = ['merlin'];
  const roles = [
    'assassin',
    'mordred',
    'morgana',
    'oberon',
    'parcival',
    'arnold',
  ];
  magic(roles, goods, evils, rolePool, lobby);
  // for (let i = 0; i < roles.length; i++) {
  //   if (lobby['assassin'] && evils > 0) {
  //     rolePool.push('assassin');
  //     evils--;
  //   }
  //   if (lobby['mordred'] && evils > 0) {
  //     rolePool.push('mordred');
  //     evils--;
  //   }
  //   if (lobby['morgana'] && evils > 0) {
  //     rolePool.push('morgana');
  //     evils--;
  //   }
  //   if (lobby['oberon'] && evils > 0) {
  //     rolePool.push('oberon');
  //     evils--;
  //   }
  //   if (lobby['parcival'] && goods > 0) {
  //     rolePool.push('parcival');
  //     goods--;
  //   }
  //   if (lobby['arnold'] && goods > 0) {
  //     rolePool.push('arnold');
  //     goods--;
  //   }
  //}
  fill(evils, goods, rolePool);

  shuffle(rolePool);

  for (let i = 0; i < players_number; i++) {
    lobby.players[i].role = rolePool[i];
  }
}

//!NOTE:-----------------------------------------------solution by Matyi

function addRoles_byMatyi(lobby, count, roles, rolesCheck) {
  for (let i = 0; i < lobby.players.length; i++) {
    if (
      (rolesCheck[i] === 'percival' || rolesCheck[i] === 'arnold') &&
      count.good > 0 &&
      lobby[rolesCheck[i]]
    ) {
      roles.push(rolesCheck[i]);
      count.good--;
    } else if (
      !(rolesCheck[i] === 'percival' || rolesCheck[i] === 'arnold') &&
      count.evil > 0 &&
      lobby[rolesCheck[i]]
    ) {
      roles.push(rolesCheck[i]);
      count.evil--;
    }
  }
  const needed = lobby.players.length - roles.length;
  for (let j = 0; j < needed; j++) {
    console.log(count, roles, lobby.players.length - roles.length, j);
    if (count.good > 0) {
      roles.push('servant of arthur');
      count.good--;
    } else if (count.evil > 0) {
      roles.push('minion of mordred');
      count.evil--;
    }
  }
}

async function shuffleRoles_byMatyi(lobby) {
  //if there aren't enough people throw an error also if there are too many people throw an error
  if (lobby.players.length < 5) {
    throw ApiError.internal('Not enough people');
  }
  if (lobby.players.length > 10) {
    throw ApiError.internal('Too many people');
  }

  const count = {
    // minus one because merlin is always there
    good: player_balance[lobby.players.length].good - 1,
    evil: player_balance[lobby.players.length].evil,
  };

  let roles = ['merlin'];
  const rolesCheck = [
    // does the asssassin need to be also always in like merlin?
    'assassin',
    'morgana',
    'mordred',
    'oberon',
    'percival',
    'arnold',
  ];

  addRoles_byMatyi(lobby, count, roles, rolesCheck);

  roles = shuffle(roles);

  for (let i = 0; i < lobby.players.length; i++) {
    lobby.players[i].role = roles[i];
  }
  lobby.started = true;
  await lobby.save();
}

const lobbyTry = {
  players: [
    { username: 'player1', role: '' },
    { username: 'player2', role: '' },
    { username: 'player3', role: '' },
    { username: 'player4', role: '' },
    { username: 'player5', role: '' },
    { username: 'player6', role: '' },
    { username: 'player7', role: '' },
  ],
  assassin: true,
  morgana: true,
  mordred: false,
  oberon: false,
  percival: true,
  arnold: false,
};

//shuffleRoles_byMatyi(lobbyTry);

module.exports.sixCharStr = sixCharStr;
module.exports.shuffleRoles = shuffleRoles_byMatyi;
