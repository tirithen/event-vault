const uuid = require('uuid');
const Event = require('./Event');

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
}

module.exports = EventStore;
