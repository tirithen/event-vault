/* global describe, it */

const assert = require('assert');
const FileSystemPersistence = require('../FileSystemPersistence');
const CardCreated = require('./fixtures/events/CardCreated');

describe('FileSystemPersistence', () => {
  it('should be instanceable', () => {
    const persistence = new FileSystemPersistence();
    assert.equal(persistence instanceof FileSystemPersistence, true);
  });

  describe('#load', () => {
    it('should not fail to load non existent data file', (done) => {
      const persistence = new FileSystemPersistence();
      persistence.load().then(done, done);
    });

    it('should load persisted Events', (done) => {
      const persistence = new FileSystemPersistence('shouldLoadPersistedEvents');
      persistence.clear().then(() => {
        Promise.all([
          persistence.append(new CardCreated({ name: 'Lion' })),
          persistence.append(new CardCreated({ name: 'Rabbit' })),
          persistence.append(new CardCreated({ name: 'Goose' }))
        ]).then(() => {
          const eventConstructors = new Map();
          eventConstructors.set('CardCreated', CardCreated);
          const persistence2 = new FileSystemPersistence(
            persistence.id,
            eventConstructors
          );
          const namesToLookup = ['Lion', 'Rabbit', 'Goose'];
          let loadedCount = 0;
          persistence2.load((data) => {
            assert.equal(data.constructor.name, 'CardCreated');
            assert.equal(typeof data.id, 'number');
            const index = namesToLookup.indexOf(data.name);
            assert.equal(index > -1, true);
            assert.equal(data.name, namesToLookup[index]);
            loadedCount += 1;
          }).then(() => {
            assert.equal(loadedCount, 3);
            persistence2.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    });
  });

  describe('#append', () => {
    it('should resolve once event has been appended', (done) => {
      const persistence = new FileSystemPersistence('shouldAppend');
      persistence.append(new CardCreated()).then(() => {
        persistence.clear();
        done();
      }, done);
    });

    it('should not accept non event parameters', (done) => {
      const persistence = new FileSystemPersistence();
      persistence.append(new Date()).then(() => {
        done(new Error('Append test should fail'));
      }, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });
  });

  describe('#clear', () => {
    it('should resolve even if persistence file was missing in the file system', (done) => {
      const persistence = new FileSystemPersistence();
      persistence.clear().then(done, done);
    });

    it('should resolve once the persistence has been cleared from the file system', (done) => {
      const persistence = new FileSystemPersistence('shouldClearAndClean');
      persistence.append(new CardCreated({ name: 'Kajsa' })).then(() => {
        persistence.clear().then(done, done);
      }, done);
    });
  });
});
