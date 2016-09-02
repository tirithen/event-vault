const uuid = require('uuid');
const EventEmitter = require('events');
const Event = require('./Event');
const Projection = require('./Projection');
const Persistence = require('./Persistence');

class EventStore extends EventEmitter {
  constructor(id, PersistenceConstructor) {
    super();

    this.id = id || uuid.v4();

    if (PersistenceConstructor instanceof Function) {
      this.persistence = new PersistenceConstructor(this.id);
    }

    if (PersistenceConstructor && !(this.persistence instanceof Persistence)) {
      throw new Error('Second argument must be a constructor that inherits from Persistence');
    }

    this.events = [];
  }

  load() {
    if (!(this.persistence instanceof Persistence)) {
      throw new Error('Unable to load with no persistence object assigned to event store');
    }

    return this.persistence.load((event) => {
      sss
    }).then(resolve, reject);
  }

  append(event) {
    if (!(event instanceof Event)) {
      throw new Error('Must be instance of Event');
    }

    this.events.push(event);

    if (this.persistence) {
      // TODO: Handle error properly
      this.persistence.append(event).then(undefined, (error) => {
        throw error;
      });
    }
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
