'use strict';
const should = require('chai').should();
const util = require('../components/util.js');

describe('!! UTIL', () => {

  describe('!!!! get room labels', () => {

    it('should return an array of the room titles and vnums', () => {

      var mockRooms = [{
        title: { en: 'pants' },
        location: 1
      }, {
        title: { en: 'helicopter' },
        location: 2

      }, ];
      var expectedLabels = ['pants (1)', 'helicopter (2)'];

      util.getRoomLabels(mockRooms)().should.eql(expectedLabels);
    });

    it('should handle nested arrays', () => {
      var mockRooms = [{
          title: { en: 'pants' },
          location: 1
        },
        [{
          title: { en: 'helicopter' },
          location: 2
        }, {
          title: { en: 'burrito' },
          location: 3
        }]
      ];
      var expectedLabels = ['pants (1)', 'helicopter (2)',
        'burrito (3)'
      ];

      util.getRoomLabels(mockRooms)().should.eql(expectedLabels);
    });
  });
});
