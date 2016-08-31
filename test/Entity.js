/* global describe, it */

const assert = require('assert');
const Entity = require('../Entity');

describe('Entity', () => {
  it('should be instanceable', () => {
    const entity = new Entity();
    assert.equal(entity instanceof Entity, true);
  });

  it('should take parameters', () => {
    const entity = new Entity({ age: 123, name: 'Anna' });
    assert.equal(entity.age, 123);
    assert.equal(entity.name, 'Anna');
    assert.equal(entity.nonExistentProperty, undefined);
  });

  it('should get a unique id automatically', () => {
    const entity = new Entity();
    assert.equal(/\w+\-\w+\-\w+\-\w+\-\w+/.test(entity.id), true);
  });
});
