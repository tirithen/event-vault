const Event = require('../../../Event');
const Card = require('../entities/Card');

class CardCreated extends Event {
  resolve(world) {
    world.set(this.id, new Card(this));
  }
}

module.exports = CardCreated;
