/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventStore = require('../EventStore');
const FileSystemPersistence = require('../FileSystemPersistence');
const CardCreated = require('./fixtures/events/CardCreated');

describe('EventStore', () => {
  it('should be instanceable without second parameter', () => {
    const store = new EventStore();
    assert.equal(store instanceof EventStore, true);
  });

  it('should be instanceable with persistence', () => {
    const eventConstructors = new Map();
    eventConstructors.set('CardCreated', CardCreated);
    const store = new EventStore('myid', new FileSystemPersistence(), eventConstructors);
    assert.equal(store instanceof EventStore, true);
  });

  it('should get a unique id automatically', () => {
    const store = new EventStore();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(store.id), true);
  });

  describe('#append', () => {
    it('should append an event to a event store without persistence', (done) => {
      const store = new EventStore();
      const event = new Event();
      store.append(event).then(() => {
        assert.equal(store.events.length, 1);
        assert.equal(store.events[0], event);
        done();
      }, done);
    });

    it('should append an event to a event store with persistence', (done) => {
      const store = new EventStore(
        'shouldAppendToEventStoreWithPersistence',
        FileSystemPersistence
      );
      store.clear().then(() => {
        const event = new Event();
        store.append(event).then(() => {
          assert.equal(store.events.length, 1);
          assert.equal(store.events[0], event);
          const eventConstructors = new Map();
          eventConstructors.set('Event', Event);
          const store2 = new EventStore(store.id, FileSystemPersistence, eventConstructors);
          store2.load().then(() => {
            assert.equal(store2.events.length, 1);
            assert.equal(store2.events[0] instanceof Event, true);
            store2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should append only to the event store and not to persistence with parameter', (done) => {
      const store = new EventStore(
        'shouldAppendOnlyToEventStoreWithoutPersistence',
        FileSystemPersistence
      );
      store.clear().then(() => {
        const event = new Event();
        store.append(event, true).then(() => {
          assert.equal(store.events.length, 1);
          assert.equal(store.events[0], event);
          const eventConstructors = new Map();
          eventConstructors.set('Event', Event);
          const store2 = new EventStore(store.id, FileSystemPersistence, eventConstructors);
          store2.load().then(() => {
            assert.equal(store2.events.length, 0);
            store2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should not accept non Event instances', () => {
      const store = new EventStore();
      assert.throws(() => {
        store.append('should');
      }, Error);
    });
  });

  describe('#clear', () => {
    it('should clear the event store and persistence', (done) => {
      const store = new EventStore('shouldClearWithPersistence', FileSystemPersistence);
      store.append(new CardCreated({ id: 'lottaCard', name: 'Lotta', time: 10 })).then(() => {
        store.clear().then(() => {
          assert.equal(store.events.length, 0);
          done();
        }, done);
      }, done);
    });

    it('should clear only the event store and not persistence with parameter', (done) => {
      const eventConstructors = new Map();
      eventConstructors.set('CardCreated', CardCreated);
      const store = new EventStore(
        'shouldClearWithoutPersistence',
        FileSystemPersistence,
        eventConstructors
      );
      store.clear().then(() => {
        store.append(new CardCreated({ id: 'lottaCard', name: 'Lotta', time: 10 })).then(() => {
          store.clear(true).then(() => {
            assert.equal(store.events.length, 0);
            store.load().then(() => {
              assert.equal(store.events.length, 1);
              store.clear().then(done, done);
            }, done);
          }, done);
        }, done);
      }, done);
    });
  });

  describe('#load', () => {
    it('should load events from persistence', (done) => {
      const store = new EventStore('shouldLoadWithPersistence', FileSystemPersistence);
      store.clear().then(() => {
        Promise.all([
          store.append(new CardCreated({ id: 'arneCard', name: 'Arne' })),
          store.append(new CardCreated({ id: 'gretheCard', name: 'Grethe' })),
          store.append(new CardCreated({ id: 'lizzCard', name: 'Lizz' })),
          store.append(new CardCreated({ id: 'lenaCard', name: 'Lena' }))
        ]).then(() => {
          const eventConstructors = new Map();
          eventConstructors.set('CardCreated', CardCreated);
          const store2 = new EventStore(
            store.id,
            FileSystemPersistence,
            eventConstructors
          );
          store2.load().then(() => {
            assert.equal(store2.events.length, 4);
            const expectedData = {
              arneCard: 'Arne',
              gretheCard: 'Grethe',
              lizzCard: 'Lizz',
              lenaCard: 'Lena'
            };
            store2.events.forEach((event) => {
              assert.equal(event instanceof CardCreated, true);
              assert.equal(typeof expectedData[event.id], 'string');
              assert.equal(event.name, expectedData[event.id]);
              delete expectedData[event.id];
            });
            store2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should reject if persistence object is missing on event store', (done) => {
      const store = new EventStore();
      store.load().then(undefined, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });

    it('should reject if event constructor is missing in event store', (done) => {
      const store = new EventStore('shouldLoadWithPersistence', FileSystemPersistence);
      store.clear().then(() => {
        store.append(new CardCreated({ name: 'Göran' })).then(() => {
          const store2 = new EventStore(store.id, FileSystemPersistence, new Map());
          store2.load().then(undefined, (error) => {
            assert.equal(error instanceof Error, true);
            assert.equal(store2.events.length, 0);
            store2.clear().then(done, done);
          });
        }, done);
      }, done);
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
