const uuid = require('uuid');
const EventEmitter = require('events');
const Event = require('./Event');
const Projection = require('./Projection');

class EventStore extends EventEmitter {
  constructor(id) {
    super();
    this.id = id || uuid.v4();
    this.events = [];
  }

  load() {

  }

  append(event) {
    if (!(event instanceof Event)) {
      throw new Error('Must be instance of Event');
    }

    this.events.push(event);
  }

  project(endTime = Date.now(), projection = new Projection()) {
    if (!(projection instanceof Projection)) {
      throw new Error('Second argument must be instance of Projection');
    }

    const lastEventTime = projection.getLastEventTime();
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      if (event.time > lastEventTime && event.time < endTime) {
        projection.append(event);
      }
    }

    return projection;
  }
}

module.exports = EventStore;
