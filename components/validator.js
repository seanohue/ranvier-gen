module.exports.positiveInt = _positiveInt;

function _positiveInt(n) {
  n = Number(n);
  if (isNaN(n)) return "Please provide a number";
  if (n < 0) return "Provide a positive integer."
  return Number.isInteger(n) || "Provide an integer.";
}