const moduleDir = './';
const filters = require(moduleDir + 'filters.js')


const AreaManifest = function areaConstructor(title, range) {
  return {
    title: title,
    suggested_range: range
  }
};

const Room = function roomConstructor(title, location, description, exits, area) {
  this.title = filters.en(title);
  this.location = location;
  this.description = filters.en(description);
  this.exits = exits;
  this.area = area;
};

module.exports.AreaManifest = AreaManifest;
module.exports.Room = Room;