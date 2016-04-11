'use strict';
// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const fs = require('fs');


// Custom modules
const comp = './components/';
const validators = require(comp + 'validators.js');
const filters = require(comp + 'filters.js');
const schema = require(comp + 'schema.js');
const questions = require(comp + 'questions.js');
const util = require(comp + 'util.js'); //TODO: New name


// State
const debug = true;
var areaManifest, area;
var newRooms = [];
var oldAreas = [];
var oldRooms = [];
var exits = [];
var saveDir = '../../entities/areas/';
var startingVnum;

init();


function init() {
  checkInstallation();
  for (var i = 0; i < process.stdout.rows; ++i) {
    console.log('\n');
  }
}

// Filesystem business

function checkInstallation() {
  fs.access(saveDir, setupForPrompt);
}


function setupForPrompt(err) {
  if (err) {
    util.error(
      "Install this tool in the plugins directory of RanvierMUD for greater ease of use." +
      "\n\nSince this tool is improperly installed, you still have to manually copy & paste the files into the entities/areas directory of RanvierMUD." +
      "\n\nYou may also need to manually add exits. :(\n"
    );

    util.error(util.errmsg(err));
    saveDir = './areas/';

  }
  readAreaNames();
  askAboutArea();
}


function readAreaNames() {
  fs.readdir(saveDir, storeAreaNames);
}


function storeAreaNames(err, files) {
  if (err) {
    util.errmsg(err);
    if (err.errno === -2) {
      fs.mkdirSync(saveDir);
      readAreaNames();
      return;
    }
  }

  oldAreas = files.filter(file => {
    return file.indexOf('.') === -1;
  });

  if (debug) logAreas();

  findOldRooms();
}


function logAreas() {
  oldAreas.forEach(area => { util.debug("\n" + area); });
}


function findOldRooms() {
  if (oldAreas.length) {
    for (var area in oldAreas) {
      var areaDir = saveDir + oldAreas[area];
      if (area) {
        let areas = fs.readdirSync(areaDir);
        loadOldRooms(areas, areaDir);
      }
    }
  }
}


function loadOldRooms(areas, areaDir) {
  if (areas) {
    areas.forEach((file) => {
      if (isRoom(file)) {
        let roomPath = areaDir + '/' + file;
        let room = yaml.safeLoad(
          fs.readFileSync(
            roomPath,
            'utf8'));
        if (room)
          oldRooms.push(room);
      }
    });
  }
}


function isRoom(file) {
  return file.indexOf('.yml') && file.indexOf('manifest') < 0;
}

// Begin the inquisition!

function askAboutArea() {
  inquirer.prompt(
    [
      questions.howManyRooms,
      questions.areaName,
      questions.areaLevelMin,
      questions.areaLevelMax
    ],
    createArea);
}


function createArea(answers) {
  let suggestedLevels = answers.levelMin + '-' + answers.levelMax;

  saveArea(answers.areaName, suggestedLevels);
  createRooms(null, answers.amount);
}


function getStartingVnum() {
  if (!oldRooms.length) return 1;
  let max = util
    .flatten(oldRooms)
    .reduce((prev, current) => (prev.location >
      current.location) ? prev : current);
  return max.location + 1;
}


function createRooms(vnum, amountOfRooms) {
  vnum = vnum || getStartingVnum();
  const roomQuestions = [
    questions.titleRoom,
    questions.describeRoom,
    questions.biome,
    questions.shortDesc,
    questions.darkDesc,
    questions.amountOfExits,
  ];

  inquirer.prompt(
    roomQuestions,
    addRoomToLists);


  function addRoomToLists(answers) {
    let room = new schema.Room(
      answers.title,
      vnum++,
      answers.desc,
      answers.shortDesc,
      answers.darkDesc,
      answers.biome,
      answers.numExits,
      area);

    newRooms.push(room);
    oldRooms.push(room);
    if (debug) logRoomLoop();

    function logRoomLoop() {
      util.debug("Pushing ", room.title.en);
      util.debug("How many new rooms are there?");
      util.debug(newRooms.length);
      util.debug("How many do we need to make?");
      util.debug(amountOfRooms);
      util.debug("New rooms:");
      util.debug(newRooms);
      util.debug("Old rooms:");
      util.debug(oldRooms);
    }

    if (newRooms.length === amountOfRooms) {
      createExits();
    } else createRooms(vnum, amountOfRooms);
  }
}

function createExits() {
  console.log("ENTERING CREATEEXITS");
  const exitQuestions = [
    questions.exitDestination(oldRooms),
    questions.exitLabel(exits),
    questions.leaveMessage
  ];
  let exitsToCreate;

  inquireAboutExits(newRooms.shift());

  function inquireAboutExits(room) {
    console.log("ENTERING inquire exits");

    var exitMsg = "Creating exits for " + room.title.en + ":";
    util.update(exitMsg);

    inquirer.prompt(
      exitQuestions,
      createExit(room));
  }

  function createExit(room) {
    console.log("ENTERING create exit");

    let roomsCreated = newRooms;

    if (!isNaN(room.exits)) {
      exitsToCreate = room.exits;
      room.exits = [];
      exits = [];
    }

    if (debug) {
      console.log(room);
      util.debug("Exits left: ");
      util.debug(exitsToCreate);
      util.debug("Exits so far: ");
      util.debug(exits);
      util.debug("Rooms created: ");
      util.debug(roomsCreated);
    }

    var progressMsg = "(" + (newRooms.length) + " rooms remaining)\n(" +
      exitsToCreate + " exits remaining)";
    util.update(progressMsg);

    exitsToCreate--;

    return answers => {
      if (exitsToCreate > 0) {

        console.log(exitsToCreate, roomsCreated.length);

        let exit = {
          location: answers.destination,
          direction: answers.label,
          leaveMessage: answers.leaveMessage
        };

        exit.leaveMessage ? exit.leaveMessage = filters.en(exit.leaveMessage) :
          delete exit.leaveMessage;

        exits.push(exit);
        room.exits.push(exit);
        console.log(roomsCreated);

        //FIXME: something fails here and it 
        // is not creating the last room.
        // See if adding 1 to check for .length fixed it?
        if (exitsToCreate > 0)
          inquireAboutExits(room);
        else if (roomsCreated.length) {
          console.log("Noping on out to the next room.");
          newRooms.push(room);
          saveToFile(room);
          inquireAboutExits(roomsCreated.shift());
        }
      } else saveToFile(room);
    };
  }
}



/*
///// Saving...
/////TODO: Extract into module, probably.
*/

function saveArea(name, levels) {
  util.update("Saving area manifest...");
  area = name;
  saveDir = filters.filename(
    saveDir +
    filters.noSpecialChars(area) + '/');
  areaManifest = new schema.AreaManifest(
    name,
    levels
  );

  fs.mkdir(saveDir, function handleMkDir(err) {
    if (err) util.error('\n' + util.errmsg(err));
    saveToFile(areaManifest, true);
  });

  util.update("Done!");
}


function saveRooms() {
  util.update("Saving rooms...");
  newRooms.forEach(saveToFile);
  util.update("Done!");
}


function saveToFile(entity, isArea) {
  let name;

  if (debug) util.debug(entity);

  if (isArea === true) {
    name = 'manifest';
  } else {
    name = entity.title.en;
    entity = [entity];
  }

  util.update("Saving " + name);

  let pathToSaveFile = filters.filename(saveDir +
    filters.noSpecialChars(name) + ".yml");

  fs.writeFile(
    pathToSaveFile,
    yaml.safeDump(entity),
    handleSaveError
  );
}


function handleSaveError(err) {
  if (err) util.error(util.errmsg(err));
}
