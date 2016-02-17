var should = require('chai').should();
var filters = require('../components/filters.js');

describe('>>> filter:', () => {

  describe('= stringify = ', () => {

    it('should return a string when input is a number',
      () => {
        filters.stringify(1234).should.equal('1234');
      });

    it('should return a string when input is an array',
      () => {
        filters.stringify(["1234", "5467"]).should.equal(
          '1234,5467');
      });

    it(
      'should return a trimmed string if there is leading/trailing whitespace',
      () => {
        filters.stringify('    1234   ').should.equal(
          '1234');
      });
  });

  describe('$ leave message $ ', () => {
    it('should return a string with leading space',
      () => {
        filters.leaveMsg('burrito').should.equal(
          ' burrito');
      });
    it(
      'should return a string with leading space when input is an array',
      () => {
        filters.leaveMsg(["1234", "5467"]).should.equal(
          ' 1234,5467');
      });
    it(
      'should return a string with leading space when input is an number',
      () => {
        filters.leaveMsg([1234]).should.equal(
          ' 1234');
      });
  });

  describe('@ filename @', () => {
    it('should return a lowercased string with no spaces',
      () => {
        filters.filename('Dungeon Land').should.equal(
          'dungeonland');
      });
  });

  describe('X no special chars X', () => {
    it('should return a string with special chars removed',
      () => {
        filters.noSpecialChars(
          'bob\'s magical$%^ helicopter/ pants\\').should.equal(
          'bobs magical helicopter pants');
      });
  });

  describe('%%% en %%%', () => {
    it('should wrap string in an object with key of en', () => {
      filters.en('ham').should.eql({ en: 'ham' });
    });
  });

});