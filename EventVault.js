const uuid = require('uuid');
const EventEmitter = require('events');
const Event = require('./Event');
const Projection = require('./Projection');
const Persistence = require('./Persistence');

class EventVault extends EventEmitter {
  constructor(id, PersistenceConstructor, eventConstructors = new Map()) {
    super();

    this.id = id || uuid.v4();
    this.events = [];
    this.eventConstructors = eventConstructors;

    if (PersistenceConstructor instanceof Function) {
      this.persistence = new PersistenceConstructor(this.id, eventConstructors);
      if (!(this.persistence instanceof Persistence)) {
        throw new Error('Second argument must be a constructor that inherits from Persistence');
      }
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      if (!(this.persistence instanceof Persistence)) {
        reject(new Error('Unable to load with no persistence object assigned to event vault'));
      } else {
        this.clear(true).then(() => {
          this.persistence.load((event) => {
            this.append(event, true);
          }).then(resolve, reject);
        }, reject);
      }
    });
  }

  append(event, withoutPersist = false) {
    if (!(event instanceof Event)) {
      throw new Error('Must be instance of Event');
    }

    this.events.push(event);

    return new Promise((resolve, reject) => {
      if (!withoutPersist && this.persistence instanceof Persistence) {
        this.persistence.append(event).then(resolve, reject);
      } else {
        resolve();
      }
    });
  }

  clear(withoutPersist = false) {
    this.events.length = 0;

    return new Promise((resolve, reject) => {
      if (!withoutPersist && this.persistence instanceof Persistence) {
        this.persistence.clear().then(resolve, reject);
      } else {
        resolve();
      }
    });
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

module.exports = EventVault;
