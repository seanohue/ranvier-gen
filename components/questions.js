const moduleDir = './';
const validators = require(moduleDir + 'validators.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');


/*
///// Area Questions
*/

module.exports.howManyRooms = {
  name: 'amount',
  message: 'How many rooms would you like to create in this area?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

module.exports.startingLocation = {
  name: 'start',
  message: 'What is the location # (vnum) you would like these rooms to start with?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

module.exports.areaLevelMin = {
  name: "levelMin",
  message: "What is the lowest recommended player level for this area?",
  default: 1,
  validate: validators.positiveInt,
  filter: filters.stringify
};

module.exports.areaLevelMax = {
  name: "levelMax",
  message: "What is the highest recommended player level for this area?",
  default: 99,
  validate: validators.positiveInt,
  filter: filters.stringify
};

module.exports.areaName = {
  name: "areaName",
  message: "What would you like to call this area? Players will not see this name.",
  default: "Dungeon",
  validate: validators.title,
  filter: filters.stringify
};

/*
///// Room Questions
*/

module.exports.titleRoom = {
  name: 'title',
  message: 'What is the (player-friendly) title of this room?',
  default: "A Room",
  validate: validators.title,
  filter: filters.stringify
};

module.exports.describeRoom = {
  name: 'desc',
  message: 'Describe the room:',
  default: 'A nice place to be.',
  validate: validators.title,
  filter: filters.stringify
};

module.exports.amountOfExits = {
  name: 'numExits',
  message: 'How many exits will this room have? Maximum of 6.',
  default: 1,
  validate: validators.between(1, 6),
  filter: Number
};

/*
///// Exit Questions
*/

module.exports.exitDestination = {
  name: 'destination',
  message: 'Which other room will this exit connect to? Enter a valid location number.',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

module.exports.exitLabel = {
  name: 'label',
  message: 'What command will the player type for this exit?',
  default: 'out',
  validate: validators.title,
  filter: filters.stringify
};

module.exports.leaveMessage = {
  name: 'leaveMessage',
  message: 'What do you want to be broadcast to the room when players leave? (optional)',
  default: ' leaves.',
  validate: validators.title,
  filter: filters.leaveMsg
};
