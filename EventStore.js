const uuid = require('uuid');
const Event = require('./Event');
const Projection = require('./Projection');

class EventStore {
  constructor(id) {
    this.id = id || uuid.v4();
    this.events = [];
  }

  add(event) {
    if (!(event instanceof Event)) {
      throw new Error('Must be instance of Event');
    }

    this.events.push(event);
  }

  project(endTime = Date.now(), projection) {
    if (projection && !(projection instanceof Projection)) {
      throw new Error('Second argument must be instance of Projection');
    } else if (!projection) {
      projection = new Projection();
    }

  }
}

module.exports = EventStore;
