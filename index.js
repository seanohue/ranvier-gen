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
var roomsCreated = [];

init();

function init() {
  console.log('\033[2J');
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

  if (start === end) return;

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
    var exits = createExits(answers.numExits);

    roomsCreated.push(
      new templates.Room(
        filters.en(answers.title),
        vnum,
        filters.en(answers.desc),
        exits,
        area
      ));

    createRooms(start, end);
  }

  function createExits(amount, current) {
    current = current || 1;
    if (amount === current) return;
    var exitsCreated = [];
    var exitQuestions = [
      questions.exitDestination,
      questions.exitLabel,
      questions.leaveMessage
    ];

    inquirer.prompt(
      exitQuestions,
      createExit);

    function createExit(answers) {
      var exit = {
        location: answers.destination,
        direction: answers.label,
        leaveMessage: answers.leaveMessage
      };

      exit.leaveMessage ?
        exit.leaveMessage = en(exit.leaveMessage) : delete exit.leaveMessage;

      exitsCreated.push(

      );
    }
  }
}

function saveArea(name, levels) {
  area = name;
  areaManifest = new templates.AreaManifest(
    name,
    levels
  );
  //TODO: write to filesystem here
}