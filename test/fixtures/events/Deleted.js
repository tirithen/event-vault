const Event = require('../../../Event');

class Deleted extends Event {
  resolve(world) {
    const targetId = this.targetId;
    const target = world.get(targetId);

    if (target && target.destroy instanceof Function) {
      target.destroy();
    }

    world.delete(targetId);
  }
}

module.exports = Deleted;
