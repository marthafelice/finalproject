const logins = require('./logins/logins.service.js');
const accounts = require('./accounts/accounts.service.js');
const uploads = require('./uploads/uploads.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(logins);
  app.configure(accounts);
  app.configure(uploads);
};
