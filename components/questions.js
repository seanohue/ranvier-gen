const moduleDir = './';
const validators = require(moduleDir + 'validator.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');

const howManyRooms = {
  name: 'amount',
  message: 'How many rooms would you like to create in this area?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

const startingLocation = {
  name: 'start',
  message: 'What is the location # (vnum) you would like these rooms to start with?',
  default: 1,
  validate: validators.positiveInt,
  filter: Number
};

const titleRoom = {
  name: 'title',
  message: 'What is the (player-friendly) title of this room?',
  default: "A Room",
  validate: validators.title,
  filter: filters.stringify
};

module.exports = {
  howManyRooms: howManyRooms,
  startingLocation: startingLocation,
  titleRoom: titleRoom
};