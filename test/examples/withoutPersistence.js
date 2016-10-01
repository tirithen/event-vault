/* global describe, it */

const assert = require('assert');
const withoutPersistence = require('../../examples/withoutPersistence');

describe('examples/', () => {
  describe('withoutPersistence', () => {
    it('should contain one player with name "Anna" after 150 time units', () => {
      assert.equal(withoutPersistence.projections['150'].get(123).name, 'Lisa');
    });

    it('should contain one player with name "Anna-Lisa" after 250 time units', () => {
      assert.equal(withoutPersistence.projections['250'].get(123).name, 'Anna-Lisa');
    });

    it("should be the same player after 150 time units that has been renamed after 250 time units", () => {
      assert.equal(
        withoutPersistence.projections['150'].get(123).id,
        withoutPersistence.projections['250'].get(123).id
      );

      assert.notEqual(
        withoutPersistence.projections['150'].get(123).name,
        withoutPersistence.projections['250'].get(123).name
      );
    });
  });
});
