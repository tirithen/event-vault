const uuid = require('uuid');

class Entity {
  constructor(options = {}) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });

    if (!this.id) {
      this.id = uuid.v4();
    }
  }
}

module.exports = Entity;
