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

As of right now, only adding new areas is supported. Adding rooms to previous areas must be done manually.

### Dependencies

ranvier-gen uses [JS-YAML](https://github.com/nodeca/js-yaml) for parsing and [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for command-line prompts.

### Contribution

This is still in beta form, at best. 
I use JS-beautify for code formatting since I'm lazy.
The preferences for formatting are saved in the root of this project.
This uses mocha.

Run tests using `mocha spec` in the root directory.
