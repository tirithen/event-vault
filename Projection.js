const Event = require('./Event');
const Entity = require('./Entity');

class Projection {
  constructor() {
    this.events = [];
    this.entities = new Map();
  }

  set(key, entity) {
    if (!(entity instanceof Entity)) {
      throw new Error('Must be instance of Entity');
    }

    this.entities.set(key, entity);
  }

  get(key) {
    return this.entities.get(key);
  }

  delete(key) {
    this.entities.delete(key);
  }

  append(event) {
    if (!(event instanceof Event)) {
      throw new Error('Must be instance of Event');
    }
    this.events.push(event);
    event.resolve(this);
  }

  getEventById(id) {
    let result;

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      if (event.__id === id) {
        result = event;
        break;
      }
    }

    return result;
  }

  getLastEventTime() {
    const lastEvent = this.events[this.events.length - 1];
    return lastEvent ? lastEvent.time : 0;
  }
}

module.exports = Projection;
