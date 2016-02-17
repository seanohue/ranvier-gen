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
        filters.stringify('    1234   ').should.equal(
          '1234');
      });
  });

  describe('$ leave message $ ', function() {
    it('should return a string with leading space',
      function() {
        filters.leaveMsg('burrito').should.equal(
          ' burrito');
      });
    it('should return a string with leading space when input is an array',
      function() {
        filters.leaveMsg(["1234", "5467"]).should.equal(
          ' 1234,5467');
      });
    it('should return a string with leading space when input is an number',
      function() {
        filters.leaveMsg([1234]).should.equal(
          ' 1234');
      });
  });

  describe('@ filename @', function() {
    it('should return a lowercased string with no spaces',
      function() {
        filters.filename('Dungeon Land').should.equal(
          'dungeonland');
      });
  });

  describe('X no special chars X', function() {
    it('should return a string with special chars removed',
      function() {
        filters.noSpecialChars('bob\'s magical$%^ helicopter/ pants\\').should.equal(
          'bobs magical helicopter pants');
      });
  });

});