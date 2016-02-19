const errno = require('errno');

module.exports.errmsg = _errmsg;
module.exports.getRoomLabels = _getRoomLabels;
module.exports.flatten = _flatten;

function _getRoomLabels(rooms) {
  return function() {
    if (rooms) {
      rooms = _flatten(rooms);
      return rooms.map((room) => {
        if (Array.isArray(room)) {
          return _getRoomLabels(room);
        } else if (room.title) {
          console.log(room.title.en);
          return room.title.en + ' (' + room.location + ')';
        }
      });
    }
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


function _flatten(ary) {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i])) {
      ret = ret.concat(_flatten(ary[i]));
    } else {
      ret.push(ary[i]);
    }
  }
  return ret;
}