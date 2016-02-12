const inquirer = require('inquirer');
const yaml = require('js-yaml');
const ROT = require('rot-js');

const AreaManifest = function areaConstructor(title, range) {
    return {
        title: title,
        suggested_range: range
    }
};

const Room = function roomConstructor(title, location, description, exits, area) {
    this.title = en(title);
    this.location = location;
    this.description = en(description);
    this.exits = exits;
    this.area = area;
};

init();

function init() {
    var howManyRooms = {
        name: 'amount',
        message: 'How many rooms would you like to create in this area?',
        default: 1,
        validate: validNumber,
        filter: Number
    }
    var startingLocation = {
        name: 'start',
        message: 'What is the location # (vnum) you would like these rooms to start with?',
        default: 1,
        validate: validNumber,
        filter: Number
    }
    inquirer.prompt([howManyRooms, startingLocation], beginRoomCreation);
}

function beginRoomCreation(answers) {
    console.log(answers);
}

function validNumber(n){
    n = Number(n);
    return n.isInteger() && n > 0 || "Provide an integer.";
}

function en(string) {
    return {
        en: string
    };
}