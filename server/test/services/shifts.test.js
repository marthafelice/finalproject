const assert = require('assert');
const app = require('../../src/app');

describe('\'shifts\' service', () => {
  it('registered the service', () => {
    const service = app.service('shifts');

    assert.ok(service, 'Registered the service');
  });
});
