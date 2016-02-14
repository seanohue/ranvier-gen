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
  var suggestedLevels = answers.levelMin + '-' + answers.levelMax;

  saveArea(answers.areaName, suggestedLevels);
  createRooms(answers.start, answers.amount);
}



function createRooms(vnum, amountOfRooms) {
  var roomQuestions = [
    questions.titleRoom,
    questions.describeRoom,
    questions.amountOfExits,
  ];

  inquirer.prompt(
    roomQuestions,
    createRoom);

  function createRoom(answers) {
    console.log("Created Rooms Are ", roomsCreated);
    createExits(answers.numExits)
    addRoomToList(exits);

    function addRoomToList(exits) {
      console.log("pushing room to list");
      roomsCreated.push(
        new templates.Room(
          answers.title,
          vnum++,
          answers.desc,
          exits,
          area));
      exits = [];
    }
  }

  function createExits(amountOfExits) {
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
      console.log("Adding exit ", exit);
      exits.push(exit);

      if (exits.length === amountOfExits) {
        console.log("Max amount of exits reached...");
        console.log("Rooms to create: ", amountOfRooms);
        console.log("Rooms created: ", roomsCreated.length);
        if (roomsCreated.length === amountOfRooms)
          saveRooms();
        else
          createRooms();
      } else createExit();
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
  console.log(entity);
  var name = isArea ? 'manifest.yml' : entity.title.en + '.yml';
  fs.writeFile(
    filters.filename(dir + name),
    yaml.safeDump(entity),
    handleSaveError
  );
}

function handleSaveError(err) {
  if (!err) return;
  console.log(err);
}