module.exports.stringify = _stringify;
module.exports.en = _en;

function _stringify(s){
	return String(s).trim();
}

function _en(string) {
  return {
    en: string
  };
}