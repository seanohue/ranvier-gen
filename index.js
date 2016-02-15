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
var saveDir = '../../entities/areas/';

init();


function init() {
  checkInstallation();
  console.log('\033[2J');
}

function checkInstallation() {
  fs.access(saveDir, logWarningOrGoToPrompt);
}

function logWarningOrGoToPrompt(err) {
  if (err) {
    console.log("Install this tool in the plugins directory of RanvierMUD for greater ease of use." + "\nSince this tool is improperly installed, you still have to manually copy & paste the files into the entities/areas directory of RanvierMUD.\n");
    saveDir = './areas/';
  }
  askAboutArea();
}

function askAboutArea() {
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


  //TODO: Populate list of rooms when defining exit destination directly from ranvierMUD directory.
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

      if (exits.length >= amountOfExits) {
        if (roomsCreated.length === amountOfRooms)
          saveRooms();
        else
          createRooms();
      } else
        createExit();
    }
  }
}

/*
///// Saving...
/////TODO: Save directly to ranvierMUD areas when installed as plugin.
/////TODO: Extract into module, probably.
*/

function saveArea(name, levels) {
  console.log("Saving area manifest...");
  area = name;
  saveDir = saveDir + name + '/';
  areaManifest = new templates.AreaManifest(
    name,
    levels
  );
  fs.mkdirSync(saveDir);
  saveToFile(areaManifest, true);
  console.log("Done!");
}

function saveRooms() {
  console.log("Saving rooms...");
  roomsCreated.forEach(saveToFile);
  console.log("Done!");
}

function saveToFile(entity, isArea) {
  console.log(entity);
  var name = isArea ? 'manifest.yml' : entity.title.en + '.yml';
  fs.writeFile(
    filters.filename(saveDir + name),
    yaml.safeDump(entity),
    handleSaveError
  );
}

function handleSaveError(err) {
  if (!err) return;
  console.error(err);
}