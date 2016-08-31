/* global describe, it */

// TODO: make ids incremental, that makes it easy to make sure no event has been dropped!
const assert = require('assert');
const Event = require('../Event');

describe('Event', () => {
  it('should be instanceable', () => {
    const event = new Event();
    assert.equal(event instanceof Event, true);
  });

  it('should take parameters', () => {
    const event = new Event({ age: 123, name: 'Anna' });
    assert.equal(event.age, 123);
    assert.equal(event.name, 'Anna');
    assert.equal(event.nonExistentProperty, undefined);
  });

  it('should automatically get an incremental id', () => {
    const event = new Event();
    assert.equal(typeof event.id, 'number');
    assert.equal(event.id > 0, true);
  });

  describe('#resolve', () => {
    it('should throw error when not implemented by extending class', () => {
      const event = new Event();
      assert.throws(() => {
        event.resolve();
      }, Error);
    });
  });

  describe('#toObject', () => {
    it('should return plain data object', () => {
      const event = new Event({ name: 'Anna', favoriteColor: 'green' });
      const data = event.toObject();
      assert.equal(Object.keys(data).length, 4);
      assert.equal(typeof data.time, 'number');
      assert.equal(data.time > 0, true);
      assert.doesNotThrow(() => {
        const date = new Date(data.time);
        assert.equal(date.getTime(), data.time);
      }, Error);
      assert.equal(typeof data.id, 'number');
      assert.equal(data.name, 'Anna');
      assert.equal(data.favoriteColor, 'green');
    });
  });
});
