const moduleDir = './';
const filters = require(moduleDir + 'filters.js')


const AreaManifest = function areaConstructor(title, range) {
  var area = {}
  area[title] = {};
  area[title].title = title;
  area[title].range = range;
  return area;
};

const Room = function roomConstructor(title, location, description, exits, area) {
  this.title = filters.en(title);
  this.location = location;
  this.description = filters.en(description);
  this.exits = exits;
};

module.exports.AreaManifest = AreaManifest;
module.exports.Room = Room;