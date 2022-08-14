// Initializes the `salon-services` service on path `/salon-services`
const { SalonServices } = require('./salon-services.class');
const createModel = require('../../models/salon-services.model');
const hooks = require('./salon-services.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/salon-services', new SalonServices(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('salon-services');

  service.hooks(hooks);
};
