const errno = require('errno');
const colors = require('colors');

module.exports.errmsg = _errmsg;

function _errmsg(err) {
  var str = 'Error: '

  // if it's a libuv error then get the description from errno
  if (errno.errno[err.errno])
    str += errno.errno[err.errno].description
  else
    str += err.message

  // if it's a `fs` error then it'll have a 'path' property
  if (err.path)
    str += ' [' + err.path + ']'

  return str.red;
}