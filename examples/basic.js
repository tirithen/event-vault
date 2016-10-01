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
    const player = projection.get(this.playerId);
    player.name = this.name;
  }
}

const events = new Map();
events.set('AddPlayer', AddPlayer);

// Use with persistence to save in between runs
//const vault = new EventVault('worldId', FileSystemPersistence, events);

// Without persistence for this example since we only want to demo two events here
const vault = new EventVault(undefined, undefined, events);

//vault.load().then(() => { // Use if using persistence

vault.append(new AddPlayer({
  id: 123,
  name: 'Lisa',
  time: 100
}));

vault.append(new RenamePlayer({
  playerId: 123,
  name: 'Anna-Lisa',
  time: 200
}));

// Log projection before rename event
console.log(vault.project(150));

// Log projection after rename event
console.log(vault.project(250));

//});
