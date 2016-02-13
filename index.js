// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ROT = require('rot-js');

// Custom modules
const moduleDir = './components/';
const validators = require(moduleDir + 'validator.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');
const questions = require(moduleDir + 'questions.js');

var areaManifest, area;
var roomsCreated;

init();

function init() {
  inquirer.prompt(
    [
      questions.howManyRooms,
      questions.startingLocation,
      questions.areaName,
      questions.areaLevelMin,
      questions.areaLevelMax
    ],
    createArea);
}

function createArea(answers) {
  var end = answers.start + answers.amount;
  var suggestedLevels = answers.levelMin + '-' + answers.levelMax;

  saveArea(answers.areaName, suggestedLevels);
  createRooms(answers.start, end);
}

function createRooms(start, end) {

  if (start === end) {
    return;
  }

  var roomQuestions = [
    questions.titleRoom,
    questions.describeRoom,
    questions.amountOfExits,
  ];

  inquirer.prompt(
    roomQuestions,
    createRoom);

  function createRoom(answers) {
    var vnum = start++;
    var exits = createExits(numExits);

    roomsCreated.push(
      templates.Room(
        filters.en(answers.title),
        vnum,
        filters.en(answers.desc),
        exits,
        area
      ));

    createRooms(start, end);
  }

  function createExits(amount) {
    // Do a barrel roll.
  }

}

function saveArea(name, levels) {
  area = name;
  areaManifest = new templates.AreaManifest(
    answers.areaName,
    suggestedLevels
  );
  //TODO: write to filesystem here
}