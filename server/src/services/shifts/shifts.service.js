// Initializes the `shifts` service on path `/shifts`
const { Shifts } = require('./shifts.class');
const createModel = require('../../models/shifts.model');
const hooks = require('./shifts.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/shifts', new Shifts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('shifts');

  service.hooks(hooks);
};
