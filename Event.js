let eventCounter = 1;

class Event {
  constructor(options = {}) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });

    if (!this.id) {
      this.id = eventCounter++;
    }

    if (!this.time) {
      this.time = Date.now();
    }
  }

  resolve() {
    throw new Error('Must be implemented by extending class');
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
