/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventStore = require('../EventStore');

describe('EventStore', () => {
  let store;

  it('should be instanceable', () => {
    store = new EventStore();
    assert.equal(store instanceof EventStore, true);
  });

  it('should get a unique id automatically', () => {
    const event = new Event();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(event.id), true);
  });

  describe('#add', () => {
    it('should add an event to the event store', () => {
      const event = new Event();
      store.add(event);
      assert.equal(store.events.length, 1);
      assert.equal(store.events[0], event);
    });

    it('should not accept non Event instances', () => {
      assert.throws(() => {
        store.add('test');
      }, Error);
    });
  });
});
