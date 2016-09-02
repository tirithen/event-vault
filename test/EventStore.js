/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventStore = require('../EventStore');
const FileSystemPersistence = require('../FileSystemPersistence');
const CardCreated = require('./fixtures/events/CardCreated');
const Card = require('./fixtures/entities/Card');

describe('EventStore', () => {
  it('should be instanceable without second parameter', () => {
    const store = new EventStore();
    assert.equal(store instanceof EventStore, true);
  });

  it('should not be instanceable if second parameter is not instance of Persistence', () => {
    assert.throws(() => {
      const store = new EventStore('myid', new Date());
      store.project(); // To fix unused linting
    }, Error);
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

  describe.only('#load', () => {
    it('should load events from persistence', (done) => {
      const store = new EventStore('testLoadWithPersistence', FileSystemPersistence);
      Promise.all([
        store.append(new CardCreated({ id: 'arneCard', name: 'Arne', time: 10 })),
        store.append(new CardCreated({ id: 'gretheCard', name: 'Grethe', time: 30 })),
        store.append(new CardCreated({ id: 'lizzCard', name: 'Lizz', time: 50 })),
        store.append(new CardCreated({ id: 'lenaCard', name: 'Lena', time: 100 }))
      ]).then(() => {
        const store2 = new EventStore('testLoadWithPersistence', FileSystemPersistence);
        store2.load().then(() => {
          assert.equal(store2.get('arneCard') instanceof Card, true);
          assert.equal(store2.get('gretheCard') instanceof Card, true);
          assert.equal(store2.get('lizzCard') instanceof Card, true);
          assert.equal(store2.get('lenaCard') instanceof Card, true);
          assert.equal(store2.get('arneCard').name, 'Arne');
          assert.equal(store2.get('gretheCard').name, 'Grethe');
          assert.equal(store2.get('lizzCard').name, 'Lizz');
          assert.equal(store2.get('lenaCard').name, 'Lena');
          done();
        }, done);
      }, done);
    });

    it('should throw error id persistence object is missing on event store', () => {
      assert.equal(false, true);
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
