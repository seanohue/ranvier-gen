module.exports.stringify = _stringify;
module.exports.en = _en;
module.exports.filename = _filename;
module.exports._leaveMsg = _leaveMsg;

function _stringify(s) {
  return String(s).trim();
}

function _leaveMsg(s) {
  return ' '.concat(_stringify(s));
}

function _filename(s) {
  return s.toLowerCase().split(' ').join('').replace(/[^\w\s]/gi, '');
}

function _en(string) {
  return {
    en: string
  };
}