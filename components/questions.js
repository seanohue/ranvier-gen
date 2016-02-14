const moduleDir = './';
const validators = require(moduleDir + 'validators.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');

var howManyRooms = {
  name: 'amount',
  message: 'How many rooms would you like to create in this area?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

var startingLocation = {
  name: 'start',
  message: 'What is the location # (vnum) you would like these rooms to start with?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

var areaLevelMin = {
  name: "levelMin",
  message: "What is the lowest recommended player level for this area?",
  default: 1,
  validate: validators.positiveInt,
  filter: filters.stringify
};

var areaLevelMax = {
  name: "levelMax",
  message: "What is the highest recommended player level for this area?",
  default: 99,
  validate: validators.positiveInt,
  filter: filters.stringify
};

var areaName = {
  name: "areaName",
  message: "What would you like to call this area? Players will not see this name.",
  default: "Dungeon",
  validate: validators.title,
  filter: filters.stringify
};

var titleRoom = {
  name: 'title',
  message: 'What is the (player-friendly) title of this room?',
  default: "A Room",
  validate: validators.title,
  filter: filters.stringify
};

var describeRoom = {
  name: 'desc',
  message: 'Describe the room:',
  default: 'A nice place to be.',
  validate: validators.title,
  filter: filters.stringify
};

var amountOfExits = {
	name: 'numExits',
	message: 'How many exits will this room have? Maximum of 6.',
	default: 1,
	validate: validators.between(1, 6),
	filter: Number
};

module.exports = {
  howManyRooms: howManyRooms,
  startingLocation: startingLocation,
  titleRoom: titleRoom,
  describeRoom: describeRoom,
  areaName: areaName,
  areaLevelMax: areaLevelMax,
  areaLevelMin: areaLevelMin,
  amountOfExits: amountOfExits
};