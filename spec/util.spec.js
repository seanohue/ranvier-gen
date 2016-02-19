const should = require('chai').should();
const util = require('../components/util.js');

describe('!! UTIL', () => {

  describe('!!!! get room labels', () => {

    it('should return an array of just the titles of a room', () => {

      var mockRooms = [{
        title: { en: 'pants' }
      }, {
        title: { en: 'helicopter' }
      }, ];
      var expectedLabels = ['pants', 'helicopter'];

      util.getRoomLabels(mockRooms).should.eql(expectedLabels);
    });

    it('should handle nested arrays', () => {
      var mockRooms = [{
          title: { en: 'pants' }
        },
        [{
          title: { en: 'helicopter' }
        }, {
          title: { en: 'burrito' }
        }]
      ];
      var expectedLabels = ['pants', ['helicopter', 'burrito']];

      util.getRoomLabels(mockRooms).should.eql(expectedLabels);
    });
  });
});