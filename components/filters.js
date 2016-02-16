module.exports.stringify = _stringify;
module.exports.en = _en;
module.exports.filename = _filename;
module.exports.leaveMsg = _leaveMsg;
module.exports.noSpecialChars = _noSpecialChars;

function _stringify(s) {
  return String(s).trim();
}

function _leaveMsg(s) {
  return ' '.concat(_stringify(s));
}

function _filename(s) {
  return s.toLowerCase().split(' ').join('');
}

function _noSpecialChars(s) {
  return s.replace(/[^\w\s]/gi, '');
}

function _en(string) {
  return {
    en: string
  };
}