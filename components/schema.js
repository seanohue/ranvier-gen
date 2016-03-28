const moduleDir = './';
const filters = require( moduleDir + 'filters.js' );


const AreaManifest = function areaConstructor( title, range ) {
  var area = {};
  area[ title ] = {};
  area[ title ].title = title;
  area[ title ].range = range;
  return area;
};

const Room = function roomConstructor(
  title,
  vnum, 
  description,
  shortDesc,
  darkDesc,
  biome,
  exits,
  area
) {
  this.title = filters.en( title );
  this.location = vnum;

  this.description = filters.en( description );
  this.short_desc = filters.en( shortDesc );
  this.dark_desc = filters.en( darkDesc );

  this.biome = biome;
  this.exits = exits;
  this.area = area;
};

module.exports.AreaManifest = AreaManifest;
module.exports.Room = Room;
