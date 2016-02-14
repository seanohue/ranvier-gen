### WHAT
This is a command-line building tool for Ranvier MUD.

### HOW

Well...

#### Installation

Clone this repo into the plugins directory of your [RanvierMUD](http://www.github.com/shawncplus/ranviermud) installation.

Type `npm install` into your terminal machine to install all dependencies.

This works with any terminals that [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) is compatible with.

#### Usage

Type `node index.js` to get started.
Answer the questions and it will auto-save [YAML](http://yaml.org/) files for RanvierMUD rooms to the areas directory.

Right now it's not super user-friendly so you have to make sure you enter the correct numbers for location IDs.

### Dependencies

ranvier-gen uses [JS-YAML](https://github.com/nodeca/js-yaml) for parsing and [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for command-line prompts.