// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const fs = require('fs');
const errno = require('errno');
const colors = require('colors');


// Custom modules
const comp = './components/';
const validators = require(comp + 'validators.js');
const filters = require(comp + 'filters.js')
const templates = require(comp + 'templates.js');
const questions = require(comp + 'questions.js');


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


function checkInstallation() {
  fs.access(saveDir, logWarningOrGoToPrompt);
}

function readAreaNames() {
  fs.readdir(saveDir, storeAreaNames);
}

function storeAreaNames(err, files) {
  if (err) { errmsg(err); }
  oldAreas = files.filter((file) => {
    return file.indexOf('.') === -1;
  });
  oldAreas.forEach((area) => { console.log("\n" + area.blue); });
  findOldRooms();
}

function findOldRooms() {
  console.log("Looking in " + areaDir);
  for (area in oldAreas) {
    var areaDir = saveDir + oldAreas[area];
    fs.readdir(areaDir, loadOldRooms);
  }
}

function loadOldRooms(err, files) {
  if (err) console.log(errmsg(err));
  if (files) {
    files.forEach((file) => {
      oldRooms.push(yaml.safeLoad(
        fs.readFileSync(saveDir + area + '/' + file,
          'utf8')));
    });
    console.log("".concat(oldRooms).green);
  } else console.log('aint no rooms'.red);
}

function logWarningOrGoToPrompt(err) {
  if (err) {
    console.log(
      "Install this tool in the plugins directory of RanvierMUD for greater ease of use."
      .orange +
      "\nSince this tool is improperly installed, you still have to manually copy & paste the files into the entities/areas directory of RanvierMUD."
      .green +
      "\nYou may also need to manually add exits. :(\n"
      .purple);
    console.log(errmsg(err));
    saveDir = './areas/';
  }
  readAreaNames();
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
      newRooms.push(
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


    function createExit() { // better name needed
      console.log("Creating exits...".blue);
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
        exit.leaveMessage = filters.en(exit.leaveMessage) : delete exit
        .leaveMessage;
      exits.push(exit);

      if (exits.length >= amountOfExits) {
        if (newRooms.length === amountOfRooms)
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
  console.log("Saving to " + pathToSaveFile.green)

  fs.writeFile(
    pathToSaveFile,
    yaml.safeDump(entity),
    handleSaveError
  );
}


function handleSaveError(err) {
  if (!err) return;
  console.error(errmsg(err));
}

function errmsg(err) {
  var str = 'Error: '

  // if it's a libuv error then get the description from errno
  if (errno.errno[err.errno])
    str += errno.errno[err.errno].description
  else
    str += err.message

  // if it's a `fs` error then it'll have a 'path' property
  if (err.path)
    str += ' [' + err.path + ']'

  return str.red
}