const player_balance = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { evil: 2, good: 3 },
  { evil: 2, good: 4 },
  { evil: 3, good: 4 },
  { evil: 3, good: 5 },
  { evil: 3, good: 6 },
  { evil: 4, good: 6 },
];

const merlinSees = ['minion of mordred', 'assassin', 'morgana', 'oberon'];
const evilSees = ['minion of mordred', 'assassin', 'mordred', 'morgana'];
const percivalSees = ['merlin', 'morgana'];

const evil = ['minion of mordred', 'assassin', 'mordred', 'morgana', 'oberon'];

const description = {
  minion: 'Evil subordinate of Mordred, remain hidden and sabotage the adventures.',
  servant: 'Loyal knight of arthur, always helps on the adventure hoping it will be successful.',
  assassin: 'At the end of the game(if your team is loosing) you can guess who is Merlin, if you are right your team win.',
  morgana: 'Disguises as Merlin.',
  oberon: 'Hidden to the evils',
  mordred: 'Hidden to Merlin',
  merlin: 'Can see the evils.',
  arnold: 'You can start at the next round.'
}

module.exports.player_balance = player_balance;
module.exports.merlinSees = merlinSees;
module.exports.evilSees = evilSees;
module.exports.percivalSees = percivalSees;
module.exports.evil= evil;
module.exports.description = description;
