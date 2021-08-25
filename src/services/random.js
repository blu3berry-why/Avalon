'use strict';

const { fileLoader } = require('ejs');
const { player_balance } = require('../helpers/constants');

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

module.exports.sixCharStr = sixCharStr;
