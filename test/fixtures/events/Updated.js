const Event = require('../../../Event');

class Updated extends Event {
  resolve(world) {
    const data = this.toObject();
    const targetId = data.targetId;
    delete data.targetId;
    const card = world.get(targetId);

    Object.keys(this).forEach((key) => {
      card[key] = this[key];
    });
  }
}

module.exports = Updated;
