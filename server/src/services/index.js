const logins = require('./logins/logins.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(logins);
};
