const EventVault = require('../EventVault');
const Event = require('../Event');
const Entity = require('../Entity');

class Player extends Entity {}

class AddPlayer extends Event {
  resolve(projection) {
    projection.set(this.id, new Player({ id: this.id, name: this.name }));
  }
}

class RenamePlayer extends Event {
  resolve(projection) {
    const player = projection.get(this.id);
    player.name = this.name;
  }
}

const events = new Map();
events.set('AddPlayer', AddPlayer);
events.set('RenamePlayer', RenamePlayer);

const vault = new EventVault(undefined, undefined, events);

vault.append(new AddPlayer({
  id: 123,
  name: 'Lisa',
  time: 100
}));

vault.append(new RenamePlayer({
  id: 123,
  name: 'Anna-Lisa',
  time: 200
}));

module.exports = {
  projections: {
    '150': vault.project(150),
    '250': vault.project(250)
  }
};
