const logins = require('./logins/logins.service.js');
const employees = require('./employees/employees.service.js');
const customers = require('./customers/customers.service.js');
const accounts = require('./accounts/accounts.service.js');
const reservations = require('./reservations/reservations.service.js');
const salonServices = require('./salon-services/salon-services.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(logins);
  app.configure(employees);
  app.configure(customers);
  app.configure(accounts);
  app.configure(reservations);
  app.configure(salonServices);
};
