/* global describe, it */

const assert = require('assert');
const Persistence = require('../Persistence');

describe('Persistence', () => {
  it('should be instanceable', () => {
    const persistence = new Persistence();
    assert.equal(persistence instanceof Persistence, true);
  });

  it('should get a unique id automatically', () => {
    const persistence = new Persistence();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(persistence.id), true);
  });

  describe('#load', () => {
    it('should return failing promise', (done) => {
      const persistence = new Persistence();
      persistence.load().then(() => {}, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });
  });

  describe('#append', () => {
    it('should return failing promise', (done) => {
      const persistence = new Persistence();
      persistence.append().then(() => {}, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });
  });

  describe('#clear', () => {
    it('should return failing promise', (done) => {
      const persistence = new Persistence();
      persistence.clear().then(() => {}, (error) => {
        assert.equal(error instanceof Error, true);
        done();
      });
    });
  });
});
