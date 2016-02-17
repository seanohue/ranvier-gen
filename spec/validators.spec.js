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
});