const uuid = require('uuid');

class Event {
  constructor(options = {}) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });

    if (!this.id) {
      this.id = uuid.v4();
    }
  }

  toObject() {
    const data = {};

    Object.keys(this).forEach((key) => {
      data[key] = this[key];
    });

    return data;
  }
}

module.exports = Event;
