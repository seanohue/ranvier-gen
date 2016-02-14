// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');

// Custom modules
const moduleDir = './components/';
const validators = require(moduleDir + 'validators.js');
const filters = require(moduleDir + 'filters.js')
const templates = require(moduleDir + 'templates.js');
const questions = require(moduleDir + 'questions.js');

var areaManifest, area;
var roomsCreated = [];
var exits = [];

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
    createExits(answers.numExits)
    addRoomToList(exits);

    function addRoomToList(exits) {
      roomsCreated.push(
        new templates.Room(
          filters.en(answers.title),
          vnum,
          filters.en(answers.desc),
          exits,
          area
        ));
    }
    createRooms(start, end);
  }

  function createExits(amount) {
    var exitQuestions = [
      questions.exitDestination,
      questions.exitLabel,
      questions.leaveMessage
    ];

    createExit();

    function createExit() {
      console.log("Creating exits...");
      inquirer.prompt(
        exitQuestions,
        addExit);
    }

    function addExit(answers) {
      var exit = {
        location: answers.destination,
        direction: answers.label,
        leaveMessage: answers.leaveMessage
      };

      exit.leaveMessage ?
        exit.leaveMessage = filters.en(exit.leaveMessage) : delete exit.leaveMessage;

      exits.push(exit);
      if (exits.length === amount) return;
      createExit();
    }
  }
}

function saveArea(name, levels) {
  console.log("Saving area manifest...");
  area = name;
  areaManifest = new templates.AreaManifest(
    name,
    levels
  );
  //TODO: write to filesystem here
  console.log("Done!");
}