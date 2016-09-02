const uuid = require('uuid');

function retrunFailingPromise() {
  return new Promise((resolve, reject) => {
    reject(new Error('Must be implemented'));
  });
}

class Persistence {
  constructor(id, supportedEventConstructors = new Map()) {
    this.id = id || uuid.v4();
    this.supportedEventConstructors = supportedEventConstructors;
  }

  load() {
    return retrunFailingPromise();
  }

  append() {
    return retrunFailingPromise();
  }

  clear() {
    return retrunFailingPromise();
  }
}

module.exports = Persistence;
