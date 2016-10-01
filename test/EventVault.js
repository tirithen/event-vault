/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventVault = require('../EventVault');
const FileSystemPersistence = require('../FileSystemPersistence');
const CardCreated = require('./fixtures/events/CardCreated');

describe('EventVault', () => {
  it('should be instanceable without second parameter', () => {
    const vault = new EventVault();
    assert.equal(vault instanceof EventVault, true);
  });

  it('should be instanceable with persistence', () => {
    const eventConstructors = new Map();
    eventConstructors.set('CardCreated', CardCreated);
    const vault = new EventVault('myid', new FileSystemPersistence(), eventConstructors);
    assert.equal(vault instanceof EventVault, true);
  });

  it('should get a unique id automatically', () => {
    const vault = new EventVault();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(vault.id), true);
  });

  describe('#append', () => {
    it('should append an event to an event vault without persistence', (done) => {
      const vault = new EventVault();
      const event = new Event();
      vault.append(event).then(() => {
        assert.equal(vault.events.length, 1);
        assert.equal(vault.events[0], event);
        done();
      }, done);
    });

    it('should append an event to an event vault with persistence', (done) => {
      const vault = new EventVault(
        'shouldAppendToEventVaultWithPersistence',
        FileSystemPersistence
      );
      vault.clear().then(() => {
        const event = new Event();
        vault.append(event).then(() => {
          assert.equal(vault.events.length, 1);
          assert.equal(vault.events[0], event);
          const eventConstructors = new Map();
          eventConstructors.set('Event', Event);
          const vault2 = new EventVault(vault.id, FileSystemPersistence, eventConstructors);
          vault2.load().then(() => {
            assert.equal(vault2.events.length, 1);
            assert.equal(vault2.events[0] instanceof Event, true);
            vault2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should append only to the event vault and not to persistence with parameter', (done) => {
      const vault = new EventVault(
        'shouldAppendOnlyToEventVaultWithoutPersistence',
        FileSystemPersistence
      );
      vault.clear().then(() => {
        const event = new Event();
        vault.append(event, true).then(() => {
          assert.equal(vault.events.length, 1);
          assert.equal(vault.events[0], event);
          const eventConstructors = new Map();
          eventConstructors.set('Event', Event);
          const vault2 = new EventVault(vault.id, FileSystemPersistence, eventConstructors);
          vault2.load().then(() => {
            assert.equal(vault2.events.length, 0);
            vault2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should not accept non Event instances', () => {
      const vault = new EventVault();
      assert.throws(() => {
        vault.append('should');
      }, Error);
    });
  });

  describe('#clear', () => {
    it('should clear the event vault and persistence', (done) => {
      const vault = new EventVault('shouldClearWithPersistence', FileSystemPersistence);
      vault.append(new CardCreated({ id: 'lottaCard', name: 'Lotta', time: 10 })).then(() => {
        vault.clear().then(() => {
          assert.equal(vault.events.length, 0);
          done();
        }, done);
      }, done);
    });

    it('should clear only the event vault and not persistence with parameter', (done) => {
      const eventConstructors = new Map();
      eventConstructors.set('CardCreated', CardCreated);
      const vault = new EventVault(
        'shouldClearWithoutPersistence',
        FileSystemPersistence,
        eventConstructors
      );
      vault.clear().then(() => {
        vault.append(new CardCreated({ id: 'lottaCard', name: 'Lotta', time: 10 })).then(() => {
          vault.clear(true).then(() => {
            assert.equal(vault.events.length, 0);
            vault.load().then(() => {
              assert.equal(vault.events.length, 1);
              vault.clear().then(done, done);
            }, done);
          }, done);
        }, done);
      }, done);
    });
  });

  describe('#load', () => {
    it('should load events from persistence', (done) => {
      const vault = new EventVault('shouldLoadWithPersistence', FileSystemPersistence);
      vault.clear().then(() => {
        Promise.all([
          vault.append(new CardCreated({ id: 'arneCard', name: 'Arne' })),
          vault.append(new CardCreated({ id: 'gretheCard', name: 'Grethe' })),
          vault.append(new CardCreated({ id: 'lizzCard', name: 'Lizz' })),
          vault.append(new CardCreated({ id: 'lenaCard', name: 'Lena' }))
        ]).then(() => {
          const eventConstructors = new Map();
          eventConstructors.set('CardCreated', CardCreated);
          const vault2 = new EventVault(
            vault.id,
            FileSystemPersistence,
            eventConstructors
          );
          vault2.load().then(() => {
            assert.equal(vault2.events.length, 4);
            const expectedData = {
              arneCard: 'Arne',
              gretheCard: 'Grethe',
              lizzCard: 'Lizz',
              lenaCard: 'Lena'
            };
            vault2.events.forEach((event) => {
              assert.equal(event instanceof CardCreated, true);
              assert.equal(typeof expectedData[event.id], 'string');
              assert.equal(event.name, expectedData[event.id]);
              delete expectedData[event.id];
            });
            vault2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });

    it('should reject if persistence object is missing on event vault', (done) => {
      const vault = new EventVault();
      vault.load().then(undefined, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });

    it('should reject if event constructor is missing in event vault', (done) => {
      const vault = new EventVault('shouldLoadWithPersistence', FileSystemPersistence);
      vault.clear().then(() => {
        vault.append(new CardCreated({ name: 'Göran' })).then(() => {
          const vault2 = new EventVault(vault.id, FileSystemPersistence, new Map());
          vault2.load().then(undefined, (error) => {
            assert.equal(error instanceof Error, true);
            assert.equal(vault2.events.length, 0);
            vault2.clear().then(done, done);
          });
        }, done);
      }, done);
    });
  });

  describe('#project', () => {
    const vault = new EventVault();
    vault.append(new CardCreated({ name: 'Arne', time: 10 }));
    vault.append(new CardCreated({ name: 'Grethe', time: 30 }));
    vault.append(new CardCreated({ name: 'Lizz', time: 50 }));
    vault.append(new CardCreated({ name: 'Lena', time: 100 }));

    it('should create a projection for everything without parameters', () => {
      const projection = vault.project();
      assert.equal(projection.events.length, 4);
      assert.equal(projection.getLastEventTime(), 100);
    });

    it('should create a projection only for events before endTime', () => {
      const projection = vault.project(35);
      assert.equal(projection.events.length, 2);
      assert.equal(projection.getLastEventTime(), 30);
    });

    it('should append to existing projection', () => {
      const projection = vault.project();
      vault.append(new CardCreated({ name: 'Hasse', time: 120 }));
      vault.append(new CardCreated({ name: 'Johanna', time: 150 }));
      const projection2 = vault.project(130, projection);
      assert.equal(projection2.events.length, 5);
      assert.equal(projection2.getLastEventTime(), 120);
    });
  });
});
