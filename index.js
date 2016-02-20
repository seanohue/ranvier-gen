// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const fs = require('fs');
const colors = require('colors');


// Custom modules
const comp = './components/';
const validators = require(comp + 'validators.js');
const filters = require(comp + 'filters.js')
const templates = require(comp + 'templates.js');
const questions = require(comp + 'questions.js');
const util = require(comp + 'util.js');


// State
var areaManifest, area;
var newRooms = [];
var oldAreas = [];
var oldRooms = [];
var exits = [];
var saveDir = '../../entities/areas/';

init();


function init() {
  checkInstallation();
  console.log('\033[2J');
}

// Filesystem business

function checkInstallation() {
  fs.access(saveDir, setupForPrompt);
}


function setupForPrompt(err) {
  if (err) {
    console.log(
      "Install this tool in the plugins directory of RanvierMUD for greater ease of use."
      .orange +
      "\nSince this tool is improperly installed, you still have to manually copy & paste the files into the entities/areas directory of RanvierMUD."
      .green +
      "\nYou may also need to manually add exits. :(\n"
      .purple);
    console.log(util.errmsg(err));
    saveDir = './areas/';
  }
  readAreaNames();
  askAboutArea();
}


function readAreaNames() {
  fs.readdir(saveDir, storeAreaNames);
}


function storeAreaNames(err, files) {
  if (err) { util.errmsg(err); }
  oldAreas = files.filter((file) => {
    return file.indexOf('.') === -1;
  });
  // logAreas();
  findOldRooms();
}


function logAreas() {
  oldAreas.forEach((area) => { console.log("\n" + area.blue); });
}


function findOldRooms() {
  if (oldAreas.length) {
    for (var area in oldAreas) {
      var areaDir = saveDir + oldAreas[area];
      if (area) {
        var areas = fs.readdirSync(areaDir);
        loadOldRooms(areas, areaDir)
      }
    }
  }
}


function loadOldRooms(areas, areaDir) {
  if (areas) {
    areas.forEach((file) => {
      if (isRoom(file)) {
        var roomPath = areaDir + '/' + file;
        var room = yaml.safeLoad(
          fs.readFileSync(roomPath,
            'utf8'))
        if (room)
          oldRooms.push(room);
      }
    });
  }
}


function isRoom(file) {
  return file.indexOf('.yml') && file.indexOf('manifest') < 0
}


// Begin the inquisition!

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
    addRoomToLists);


  function addRoomToLists(answers) {
    var room = new templates.Room(
      answers.title,
      vnum++,
      answers.desc,
      answers.numExits,
      area)

    newRooms.push(room);
    oldRooms.push(room);
    // logRoomLoop();

    function logRoomLoop() {
      console.log("How many new rooms are there?");
      console.log(newRooms.length);
      console.log("How many do we need to make?");
      console.log(amountOfRooms);
      console.log("New rooms:");
      console.log(newRooms);
      console.log("Old rooms:");
      console.log(oldRooms);
    }

    if (newRooms.length === amountOfRooms) {
      createExits();
    } else createRooms(vnum, amountOfRooms);
  }
}

//TODO: Add newly created rooms to list of destinations.
//TODO: Check to make sure that the exits don't have the same destination

function createExits() {
  var exitQuestions = [
    questions.exitDestination(oldRooms),
    questions.exitLabel(exits),
    questions.leaveMessage
  ];

  inquireAboutExits(newRooms.shift());

  function inquireAboutExits(room) {
    var exitMsg = "Creating exits for " + room.title.en + ":";
    console.log(exitMsg.blue);
    inquirer.prompt(
      exitQuestions,
      createExit(room));
  }

  function createExit(room) {
    var exitsToCreate;
    var roomsCreated = newRooms;

    if (!isNaN(room.exits)) {
      exitsToCreate = room.exits;
      room.exits = [];
    }

    return (answers) => {
      if (roomsCreated.length) {
        var exit = {
          location: answers.destination,
          direction: answers.label,
          leaveMessage: answers.leaveMessage
        };

        exit.leaveMessage ? exit.leaveMessage = filters.en(exit.leaveMessage) :
          delete exit.leaveMessage;

        room.exits.push(exit);
        if (exitsToCreate--)
          inquireAboutExits(room);
        else inquireAboutExits(roomsCreated.shift());
      } else saveRooms();
    }
  }
}



/*
///// Saving...
/////TODO: Extract into module, probably.
*/

function saveArea(name, levels) {
  console.log("Saving area manifest...".blue);
  area = name;
  saveDir = filters.filename(
    saveDir +
    filters.noSpecialChars(area) + '/');
  areaManifest = new templates.AreaManifest(
    name,
    levels
  );

  fs.mkdir(saveDir, function handleMkDir(err) {
    if (err) { console.error(err); }
    saveToFile(areaManifest, true);
  });

  console.log("Done!".blue);
}


function saveRooms() {
  console.log("Saving rooms...".blue);
  newRooms.forEach(saveToFile);
  console.log("Done!".blue);
}


function saveToFile(entity, isArea) {
  var name = isArea ? 'manifest' : entity.title.en;
  var pathToSaveFile = filters.filename(saveDir +
    filters.noSpecialChars(name) + ".yml");

  fs.writeFile(
    pathToSaveFile,
    yaml.safeDump(entity),
    handleSaveError
  );
}


function handleSaveError(err) {
  if (!err) return;
  console.error(util.errmsg(err));
}