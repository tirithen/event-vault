/* global describe, it */

const assert = require('assert');
const Event = require('../Event');
const EventStore = require('../EventStore');
const CardCreated = require('./fixtures/events/CardCreated');

describe('CardCreated', () => {
  it('should inherit from Event', () => {
    const cardCreated = new CardCreated();
    assert.equal(cardCreated instanceof Event, true);
  });

  describe('#resolve', () => {
    it('should return plain data object', () => {
      const projection = new Projection();
      const store = new EventStore();
      const cardCreated = new CardCreated({ name: 'Anna' });
      store.add(cardCreated);
      store.projectOn(projection);
    });
  });
});
