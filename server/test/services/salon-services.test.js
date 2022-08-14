const assert = require('assert');
const app = require('../../src/app');

describe('\'salon-services\' service', () => {
  it('registered the service', () => {
    const service = app.service('salon-services');

    assert.ok(service, 'Registered the service');
  });
});
