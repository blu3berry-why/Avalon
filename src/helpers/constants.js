// a list which can be indexed by player_balance[number of players].evil /.good and it gives the number of needed players in that category
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

// the number of people per adventure also indexable, adventureLimit[number of players]
const adventureLimit = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  [undefined, 2, 3, 2, 3, 3],
  [undefined, 2, 3, 4, 3, 4],
  //two fails required on the fourth
  [undefined, 2, 3, 3, 4, 4],
  [undefined, 3, 4, 4, 5, 5],
  [undefined, 3, 4, 4, 5, 5],
  [undefined, 3, 4, 4, 5, 5],
];

//the roles which merlin sees
const merlinSees = ['minion of mordred', 'assassin', 'morgana', 'oberon'];
//the roles which an evil sees
const evilSees = ['minion of mordred', 'assassin', 'mordred', 'morgana'];
//the roles which percival sees
const percivalSees = ['merlin', 'morgana'];

//the evil roles
const evil = ['minion of mordred', 'assassin', 'mordred', 'morgana', 'oberon'];

//descriptions for roles
const description = {
  minion:
    'Evil subordinate of Mordred, remain hidden and sabotage the adventures.',
  servant:
    'Loyal knight of arthur, always helps on the adventure hoping it will be successful.',
  assassin:
    'At the end of the game(if your team is loosing) you can guess who is Merlin, if you are right your team win.',
  morgana: 'Disguises as Merlin.',
  oberon: 'Hidden to the evils',
  mordred: 'Hidden to Merlin',
  merlin: 'Can see the evils.',
  arnold: 'You can start at the next round.',
};

module.exports.player_balance = player_balance;
module.exports.merlinSees = merlinSees;
module.exports.evilSees = evilSees;
module.exports.percivalSees = percivalSees;
module.exports.evil = evil;
module.exports.description = description;
module.exports.adventureLimit = adventureLimit;
