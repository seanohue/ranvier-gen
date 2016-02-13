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


init();

function init() {
  inquirer.prompt(
    [
      questions.howManyRooms,
      questions.startingLocation
    ],
    beginRoomCreation);
}

function beginRoomCreation(answers) {
  var endingLocation = answers.start + answers.amount;
  var roomQuestions = [
    questions.titleRoom
  ];

  inquirer.prompt(
    compileQuestions(
      roomQuestions,
      answers.amount),
    function(a) {
      console.log(a);
    });

  function compileQuestions(baseQuestions, amount) {
    var i;
    var compiledQuestions = [];

    for (i = 0; i < amount; i++) {
      for (question of baseQuestions) {
        compiledQuestions.push(question);
      }
    }
    return compiledQuestions;
  }
}