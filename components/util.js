const errno = require('errno');

module.exports.errmsg = _errmsg;
module.exports.getRoomLabels = _getRoomLabels;

function _getRoomLabels(rooms) {
  console.log("ROOMS ARE ", rooms);
  if (rooms) {
    return rooms.map((room) => {
      if (Array.isArray(room)) 
        return _getRoomLabels(room);
      else if (room.title) {
        return room.title.en + ' (' + room.location + ')';
      }
    });
  }
}

function _errmsg(err) {
  var str = 'Error: '

  // if it's a libuv error then get the description from errno
  if (errno.errno[err.errno])
    str += errno.errno[err.errno].description
  else
    str += err.message

  // if it's a `fs` error then it'll have a 'path' property
  if (err.path)
    str += ' [' + err.path + ']';

  return str;
}