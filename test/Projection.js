/* global describe, it */

const Projection = require('../Projection');
const CardCreated = require('./fixtures/events/CardCreated');
const Card = require('./fixtures/entities/Card');
const assert = require('assert');

describe('Projection', () => {
  describe('#set', () => {
    it('should set an entity on the root level', () => {
      const projection = new Projection();
      const card = new Card({ name: 'Hanna' });
      projection.set(card.id, card);
      assert.equal(projection.entities.get(card.id), card);
    });

    it('should not be possible to set non entity instances', () => {
      const projection = new Projection();
      assert.throws(() => {
        projection.set('1234', new Date());
      }, Error);
    });
  });

  describe('#get', () => {
    it('should get an entity from the root level', () => {
      const projection = new Projection();
      const card = new Card({ name: 'Andrea' });
      projection.set(card.id, card);
      assert.equal(projection.get(card.id), card);
    });
  });

  describe('#delete', () => {
    it('should delete an entity from the root level', () => {
      const projection = new Projection();
      const card = new Card({ name: 'Anders' });
      projection.set(card.id, card);
      assert.equal(projection.get(card.id), card);
      projection.delete(card.id);
      assert.equal(projection.get(card.id), undefined);
    });
  });

  describe('#append', () => {
    it('should be possible to append events to update the projection', () => {
      const projection = new Projection();
      const event = new CardCreated({ name: 'Love' });
      projection.append(event);
      assert.equal(projection.events.length, 1);
      assert.equal(projection.getEventById(event.__id).name, 'Love');
    });

    it('should not be possible to append non event instances', () => {
      const projection = new Projection();
      const notAnEvent = new Date();
      assert.throws(() => {
        projection.append(notAnEvent);
      }, Error);
    });

    it('should have resolved all appended events', () => {
      const projection = new Projection();
      const event = new CardCreated({ name: 'Love' });
      projection.append(event);
      assert.equal(projection.events.length, 1);
      assert.equal(projection.get(event.id).name, 'Love');
    });
  });

  describe('#getEventById', () => {
    it('should be possible to get events by id', () => {
      const projection = new Projection();
      const event = new CardCreated({ name: 'Petra' });
      projection.append(event);
      const event2 = new CardCreated({ name: 'Kalle' });
      projection.append(event2);
      const event3 = new CardCreated({ name: 'Peter' });
      projection.append(event3);
      assert.equal(projection.events.length, 3);
      assert.equal(projection.getEventById(event2.__id) instanceof CardCreated, true);
      assert.equal(projection.getEventById(event2.__id).name, 'Kalle');
    });
  });

  describe('#getLastEventTime', () => {
    it('should be possible to get the time from the last event on the projection', () => {
      const projection = new Projection();
      assert.equal(projection.getLastEventTime(), 0);
      const event = new CardCreated();
      event.time = 1233;
      projection.append(event);
      const event2 = new CardCreated();
      event2.time = 13233;
      projection.append(event2);
      assert.equal(projection.getLastEventTime(), 13233);
    });
  });
});
