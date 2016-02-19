const filters = require('./filters.js');

module.exports.positiveInt = _positiveInt;
module.exports.title = _title;
module.exports.between = _between;
module.exports.unique = _unique;

function _between(min, max) {
  return function(n) {
    if (isNaN(n)) return "Please provide a number";
    return (n >= min && n <= max) ? true : "Please provide a number between " +
      min + " and " + max + ".";
  }
}

function _positiveInt(n) {
  n = Number(n);
  if (isNaN(n)) return "Please provide a number.";
  if (n <= 0) return "Provide a positive integer."
  return Number.isInteger(n) || "Provide an integer.";
}

function _title(title) {
  return !!(title && title.toString().trim() === title);
}

function _unique(collection, s) {
  return function(s) {
    s = filters.stringify(s);
    for (item in collection) {
      if (filters.stringify(collection[item].direction) === s)
        return "Provide a unique label.";
    }
    return true;
  }
}