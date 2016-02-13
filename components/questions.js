const moduleDir = './';
const validators = require(moduleDir + 'validator.js');
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

module.exports = {
  howManyRooms: howManyRooms,
  startingLocation: startingLocation,
  titleRoom: titleRoom,
  describeRoom: describeRoom,
  compile: _compile
};

function _compile(baseQuestions, amount) {
  var i = q = 0;
  var compiledQuestions = [];
  var qlen = baseQuestions.length;
  for (i = 0; i < amount; i++) {
    for (q = 0; q < qlen; q++) {
      var question = baseQuestions[q];
      question.name += i;
      compiledQuestions.push(question);
    }
  }
  return compiledQuestions;
}