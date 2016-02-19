const should = require('chai').should();
const validators = require('../components/validators.js');

describe('>>> validators:', () => {

  describe('~~~~ between', () => {

    it('should return true if n is between the two numbers',
      () => {
        validators.between(1, 7)(3).should.be.true
      });

    it('should return errmsg if n is NaN', () => {
      validators.between(1, 3000)('potato').should.equal(
        'Please provide a number');
    });

    it('should return errmsg if n is not between min or max', () => {
      var err = 'Please provide a number between 1 and 20.';
      validators.between(1, 20)(200).should.equal(err);
      validators.between(1, 20)(-5).should.equal(err);
    });
  });

  describe('~~~~ positive int', () => {

    it('should return true if number is a positive integer', () => {
      validators.positiveInt(2).should.be.true;
    });

    it('should return errmsg if n is negative', () => {
      validators.positiveInt(-3).should.equal(
        'Provide a positive integer.');
    });

    it('should return errmsg if n is NaN', () => {
      validators.positiveInt('thomas the tank engine').should.equal(
        'Please provide a number.');
    });

    it('should return errmsg if n is not an int', () => {
      validators.positiveInt(3.14).should.equal(
        'Provide an integer.');
    });
  });

  describe('~~~~ title', () => {

    it('should return true if it is a non-whitespace/empty string', () => {
      validators.title('sandwichtown').should.be.true;
    });

    it('should return false if it is empty', () => {
      validators.title('').should.be.false;
    });

    it('should return false if it is whitespace', () => {
      validators.title('              ').should.be.false;
    });

    it('should return false if it is somehow an object', () => {
      validators.title({ what: 'isHappening' }).should.be.false;
    });
  });

  describe('~~~~ has unique ___', () => {

    var mockExits = [{
      direction: 'out',
    }, {
      direction: 'in',
    }];

    it('should return true if input is unique', () => {
      validators.hasUnique('direction', mockExits)('potato').should
        .be.true;
    });
    it('should return errmsg if input is not unique', () => {
      validators.hasUnique('direction', mockExits)('in').should
        .equal('Provide a unique label.');
    });

    it('should throw an error if implemented poorly', () => {
      (() => {
        validators.hasUnique(mockExits)('burrito town');
      }).should.throw(
        '>>> hasUnique validator requires a string as the first argument and an array of objects as the second argument.'
      );
    });
  });
});