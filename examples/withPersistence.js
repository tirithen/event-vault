const EventVault = require('../EventVault');
const Event = require('../Event');
const Entity = require('../Entity');
const FileSystemPersistence = require('../FileSystemPersistence');

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

const vault = new EventVault('worldId', FileSystemPersistence, events);
const vault2 = new EventVault('worldId', FileSystemPersistence, events);

module.exports = new Promise((resolve) => {
  vault.clear().then(() => {
    Promise.all([
      vault.append(new AddPlayer({
        id: 123,
        name: 'Lisa',
        time: 100
      })),
      vault.append(new RenamePlayer({
        id: 123,
        name: 'Anna-Lisa',
        time: 200
      }))
    ]).then(() => {
      vault2.load().then(() => {
        return new Promise(() => {
          resolve({
            '150': vault2.project(150),
            '250': vault2.project(250)
          });

          vault.clear();
          vault2.clear();
        });
      });
    });
  });
});
