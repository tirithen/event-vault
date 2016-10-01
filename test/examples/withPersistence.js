/* global describe, it */

const assert = require('assert');
const withPersistence = require('../../examples/withPersistence');

describe('examples/', () => {
  describe('withPersistence', () => {
    it('should contain one player with name "Anna" after 150 time units', (done) => {
      withPersistence.then((projections) => {
        assert.equal(projections['150'].get(123).name, 'Lisa');
        done();
      });
    });

    it('should contain one player with name "Anna-Lisa" after 250 time units', (done) => {
      withPersistence.then((projections) => {
        assert.equal(projections['250'].get(123).name, 'Anna-Lisa');
        done();
      });
    });

    it("should be the same player after 150 time units that has been renamed after 250 time units", (done) => {
      withPersistence.then((projections) => {
        assert.equal(
          projections['150'].get(123).id,
          projections['250'].get(123).id
        );

        assert.notEqual(
          projections['150'].get(123).name,
          projections['250'].get(123).name
        );

        done();
      });
    });
  });
});
