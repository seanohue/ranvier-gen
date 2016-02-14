// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const fs = require('fs');

// Custom modules
const comp = './components/';
const validators = require(comp + 'validators.js');
const filters = require(comp + 'filters.js')
const templates = require(comp + 'templates.js');
const questions = require(comp + 'questions.js');

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
  if (start === end) {
    saveRooms();
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
    createExits(answers.numExits)
    addRoomToList(exits);

    function addRoomToList(exits) {
      roomsCreated.push(
        new templates.Room(
          filters.en(answers.title),
          vnum,
          filters.en(answers.desc),
          exits,
          area));
      exits = [];
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
  saveToFile(areaManifest, true);
  console.log("Done!");
}

function saveRooms() {
  console.log("Saving rooms...");
  roomsCreated.forEach(saveToFile);
  console.log("Done!");
}

function saveToFile(entity, isArea) {
  var dir = './areas/';
  var name = isArea ? 'manifest.yml' : entity.title + '.yml';
  fs.writeFile(
    dir + name,
    yaml.safeDump(entity),
    handleSaveError
  );
}

function handleSaveError(err) {
  console.log(err);
}