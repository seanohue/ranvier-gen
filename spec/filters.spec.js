var should = require('chai').should();
var filters = require('../components/filters.js');

describe('>>> filter:', function() {
  describe('= stringify = ', function() {
    it('should return a string when input is a number',
      function() {
        filters.stringify(1234).should.equal('1234');
      });
    it('should return a string when input is an array',
      function() {
        filters.stringify(["1234", "5467"]).should.equal(
          '1234,5467');
      });
    it('should return a trimmed string if there is leading/trailing whitespace',
      function() {
        filters.stringify('    1234   ').should.equal('1234');
      });
  });
});