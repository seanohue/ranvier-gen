const filters = require( './filters.js' );

module.exports.positiveInt = _positiveInt;
module.exports.title = _title;
module.exports.between = _between;
module.exports.hasUnique = _hasUnique;

function _between( min, max ) {
  return function( n ) {
    var isPositive = _positiveInt( n );
    if ( isPositive !== true ) return isPositive;
    return ( n >= min && n <= max ) ? true :
      "Please provide a number between " +
      min + " and " + max + ".";
  };
}

function _positiveInt( n ) {
  n = Number( n );
  if ( isNaN( n ) ) return "Please provide a number.";
  if ( n <= 0 ) return "Provide a positive integer.";
  return Number.isInteger( n ) || "Provide an integer.";
}

function _title( title ) {
  return !!( title && title.toString().trim() === title );
}

function _hasUnique( key, collection, newLabel ) {
  return function( newLabel ) {
    if ( String( key ) === key && collection ) {
      newLabel = filters.stringify( newLabel );
      for ( var item in collection ) {
        if ( filters.stringify( collection[ item ][ key ] ) === newLabel )
          return "Provide a unique label.";
      }
      return true;
    }
    throw new Error(
      '>>> hasUnique validator requires a string as the first argument and an array of objects as the second argument.'
    );
  };
}
