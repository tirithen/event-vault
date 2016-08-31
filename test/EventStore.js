/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventStore = require('../EventStore');
const CardCreated = require('./fixtures/events/CardCreated');

describe('EventStore', () => {
  it('should be instanceable', () => {
    const store = new EventStore();
    assert.equal(store instanceof EventStore, true);
  });

  it('should get a unique id automatically', () => {
    const store = new EventStore();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(store.id), true);
  });

  describe('#append', () => {
    it('should append an event to the event store', () => {
      const store = new EventStore();
      const event = new Event();
      store.append(event);
      assert.equal(store.events.length, 1);
      assert.equal(store.events[0], event);
    });

    it('should not accept non Event instances', () => {
      const store = new EventStore();
      assert.throws(() => {
        store.append('test');
      }, Error);
    });
  });

  describe('#project', () => {
    const store = new EventStore();
    store.append(new CardCreated({ name: 'Arne', time: 10 }));
    store.append(new CardCreated({ name: 'Grethe', time: 30 }));
    store.append(new CardCreated({ name: 'Lizz', time: 50 }));
    store.append(new CardCreated({ name: 'Lena', time: 100 }));

    it('should create a projection for everything without parameters', () => {
      const projection = store.project();
      assert.equal(projection.events.length, 4);
      assert.equal(projection.getLastEventTime(), 100);
    });

    it('should create a projection only for events before endTime', () => {
      const projection = store.project(35);
      assert.equal(projection.events.length, 2);
      assert.equal(projection.getLastEventTime(), 30);
    });

    it('should append to existing projection', () => {
      const projection = store.project();
      store.append(new CardCreated({ name: 'Hasse', time: 120 }));
      store.append(new CardCreated({ name: 'Johanna', time: 150 }));
      const projection2 = store.project(130, projection);
      assert.equal(projection2.events.length, 5);
      assert.equal(projection2.getLastEventTime(), 120);
    });
  });
});
