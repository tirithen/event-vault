const Event = require('../../../Event');
const Card = require('../entities/Card');

class CardCreated extends Event {
  resolve(projection) {
    projection.set(this.id, new Card(this));
  }
}

module.exports = CardCreated;
