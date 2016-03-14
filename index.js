// NPM modules
const inquirer = require( 'inquirer' );
const yaml = require( 'js-yaml' );
const fs = require( 'fs' );


// Custom modules
const comp = './components/';
const validators = require( comp + 'validators.js' );
const filters = require( comp + 'filters.js' );
const templates = require( comp + 'templates.js' );
const questions = require( comp + 'questions.js' );
const util = require( comp + 'util.js' );


// State
const debug = false;
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
  console.log( '\033[2J' );
}

// Filesystem business

function checkInstallation() {
  fs.access( saveDir, setupForPrompt );
}


function setupForPrompt( err ) {
  if ( err ) {
    util.error(
      "Install this tool in the plugins directory of RanvierMUD for greater ease of use." +
      "\nSince this tool is improperly installed, you still have to manually copy & paste the files into the entities/areas directory of RanvierMUD." +
      "\nYou may also need to manually add exits. :(\n"
    );

    util.error( util.errmsg( err ) );
    saveDir = './areas/';

  }
  readAreaNames();
  askAboutArea();
}


function readAreaNames() {
  fs.readdir( saveDir, storeAreaNames );
}


function storeAreaNames( err, files ) {
  if ( err ) {
    util.errmsg( err );
    if ( err.errno === -2 ) {
      fs.mkdirSync( saveDir );
      readAreaNames();
      return;
    }
  }

  oldAreas = files.filter( ( file ) => {
    return file.indexOf( '.' ) === -1;
  } );
  if ( debug ) logAreas();
  findOldRooms();
}


function logAreas() {
  oldAreas.forEach( ( area ) => { util.debug( "\n" + area ); } );
}


function findOldRooms() {
  if ( oldAreas.length ) {
    for ( var area in oldAreas ) {
      var areaDir = saveDir + oldAreas[ area ];
      if ( area ) {
        var areas = fs.readdirSync( areaDir );
        loadOldRooms( areas, areaDir );
      }
    }
  }
}


function loadOldRooms( areas, areaDir ) {
  if ( areas ) {
    areas.forEach( ( file ) => {
      if ( isRoom( file ) ) {
        var roomPath = areaDir + '/' + file;
        var room = yaml.safeLoad(
          fs.readFileSync( roomPath,
            'utf8' ) );
        if ( room )
          oldRooms.push( room );
      }
    } );
  }
}


function isRoom( file ) {
  return file.indexOf( '.yml' ) && file.indexOf( 'manifest' ) < 0;
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
    createArea );
}


function createArea( answers ) {
  var suggestedLevels = answers.levelMin + '-' + answers.levelMax;

  saveArea( answers.areaName, suggestedLevels );
  createRooms( null, answers.amount );
}


function getStartingVnum() {
  if ( !oldRooms.length ) return 1;
  var max = util.flatten( oldRooms ).reduce( ( prev, current ) => ( prev.location >
    current.location ) ? prev : current );
  return max.location + 1;
}


function createRooms( vnum, amountOfRooms ) {
  vnum = vnum || getStartingVnum();
  var roomQuestions = [
    questions.titleRoom,
    questions.describeRoom,
    questions.amountOfExits,
  ];

  inquirer.prompt(
    roomQuestions,
    addRoomToLists );


  function addRoomToLists( answers ) {
    var room = new templates.Room(
      answers.title,
      vnum++,
      answers.desc,
      answers.numExits,
      area );

    newRooms.push( room );
    oldRooms.push( room );
    if ( debug ) logRoomLoop();

    function logRoomLoop() {
      util.debug( "How many new rooms are there?" );
      util.debug( newRooms.length );
      util.debug( "How many do we need to make?" );
      util.debug( amountOfRooms );
      util.debug( "New rooms:" );
      util.debug( newRooms );
      util.debug( "Old rooms:" );
      util.debug( oldRooms );
    }

    if ( newRooms.length === amountOfRooms ) {
      createExits();
    } else createRooms( vnum, amountOfRooms );
  }
}

function createExits() {
  var exitQuestions = [
    questions.exitDestination( oldRooms ),
    questions.exitLabel( exits ),
    questions.leaveMessage
  ];

  inquireAboutExits( newRooms.shift() );

  function inquireAboutExits( room ) {
    var exitMsg = "Creating exits for " + room.title.en + ":";
    util.update( exitMsg );
    inquirer.prompt(
      exitQuestions,
      createExit( room ) );
  }

  function createExit( room ) {
    var exitsToCreate;
    var roomsCreated = newRooms;

    if ( !isNaN( room.exits ) ) {
      exitsToCreate = room.exits;
      room.exits = [];
      exits = [];
    }

    return ( answers ) => {
      if ( roomsCreated.length ) {
        var exit = {
          location: answers.destination,
          direction: answers.label,
          leaveMessage: answers.leaveMessage
        };

        exit.leaveMessage ? exit.leaveMessage = filters.en( exit.leaveMessage ) :
          delete exit.leaveMessage;

        exits.push( exit );
        room.exits.push( exit );

        if ( exitsToCreate-- )
          inquireAboutExits( room );
        else inquireAboutExits( roomsCreated.shift() );
      } else saveRooms();
    };
  }
}



/*
///// Saving...
/////TODO: Extract into module, probably.
*/

function saveArea( name, levels ) {
  util.update( "Saving area manifest..." );
  area = name;
  saveDir = filters.filename(
    saveDir +
    filters.noSpecialChars( area ) + '/' );
  areaManifest = new templates.AreaManifest(
    name,
    levels
  );

  fs.mkdir( saveDir, function handleMkDir( err ) {
    if ( err ) util.error( '\n' + util.errmsg( err ) );
    saveToFile( areaManifest, true );
  } );

  util.update( "Done!" );
}


function saveRooms() {
  util.update( "Saving rooms..." );
  newRooms.forEach( saveToFile );
  util.update( "Done!" );
}


function saveToFile( entity, isArea ) {
  var name;

  if ( isArea === true ) {
    name = 'manifest';
  } else {
    name = entity.title.en;
    entity = [ entity ];
  }

  var pathToSaveFile = filters.filename( saveDir +
    filters.noSpecialChars( name ) + ".yml" );

  fs.writeFile(
    pathToSaveFile,
    yaml.safeDump( entity ),
    handleSaveError
  );
}


function handleSaveError( err ) {
  if ( !err ) return;
  util.error( util.errmsg( err ) );
}
