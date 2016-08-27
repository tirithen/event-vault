/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const CardCreated = require('./fixtures/events/CardCreated');

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

  it('should get a unique id automatically', () => {
    const event = new Event();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(event.id), true);
  });

  describe('#toObject', () => {
    it('should return plain data object', () => {
      const event = new Event({ name: 'Anna', favoriteColor: 'green' });
      const data = event.toObject();
      assert.equal(Object.keys(data).length, 3);
      assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(data.id), true);
      assert.equal(data.name, 'Anna');
      assert.equal(data.favoriteColor, 'green');
    });
  });
});
