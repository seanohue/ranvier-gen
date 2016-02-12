// NPM modules
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ROT = require('rot-js');

// Custom modules
const validator = require('./validator.js');

init();

function init() {
    var howManyRooms = {
        name: 'amount',
        message: 'How many rooms would you like to create in this area?',
        default: 1,
        validate: validator.positiveInt,
        filter: Number
    }
    var startingLocation = {
        name: 'start',
        message: 'What is the location # (vnum) you would like these rooms to start with?',
        default: 1,
        validate: validator.positiveInt,
        filter: Number
    }
    inquirer.prompt([howManyRooms, startingLocation], beginRoomCreation);
}

function beginRoomCreation(answers) {
    console.log(answers);
}

function en(string) {
    return {
        en: string
    };
}