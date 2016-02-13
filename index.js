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

var areaManifest;
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
    areaCreation);
}

function areaCreation(answers) {
  var endingLocation = answers.start + answers.amount;
  var suggestedLevels = answers.levelMin + '-' + answers.levelMax;
  var roomQuestions = [
    questions.titleRoom,
    questions.describeRoom
  ];

  areaManifest = new templates.AreaManifest(
    answers.areaName,
    suggestedLevels
  );
  console.log(areaManifest);

  // can do this with recursion?
  inquirer.prompt(
    roomQuestions,
    function(a) {
      console.log(a);
    });
}