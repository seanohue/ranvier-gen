// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ROT = require('rot-js');

// Custom modules
const moduleDir = './components/';
const validators = require(moduleDir + 'validator.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');


init();

function init() {

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

  inquirer.prompt(
    [
      howManyRooms,
      startingLocation
    ],
    beginRoomCreation);
}

function beginRoomCreation(answers) {
  var titleRoom = {
    name: 'title',
    message: 'What is the player-friendly title of this room?',
    validate: validators.title,
    filter: filters.stringify
  };
}

function en(string) {
  return {
    en: string
  };
}