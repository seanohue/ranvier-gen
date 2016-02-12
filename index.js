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

var map = [];

function en(string) {
    return {
        en: string
    };
}