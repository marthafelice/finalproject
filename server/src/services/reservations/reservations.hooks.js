const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when} = require('feathers-hooks-common');

async function manageReservationsRel(hook) {
  // console.log(JSON.parse(JSON.stringify(hook)));
  const isAuthenticated = hook.params.authenticated;
  if (isAuthenticated) {
    const customer = hook.data.customer || hook.params.customer;
    if (hook.type === 'before') {
      // adding loginId to data

      hook.data.customer = customer;


      const service = hook.data.service ||  hook.params.service;
      const employee = hook.data.employee || hook.params.employee;

      if (service && !employee) {
        hook.data.$addToSet = {'assignments.service': service};
      }

      if (service && employee) {
        hook.data.$addToSet = {'assignments.service': service, 'assignments.employee': employee};
        hook.params.query = {'assignments.service': service};
      }

      if (hook.type === 'after') {
        const reservationId = hook.result._id;
        // patch accounts in the login model
        let reservationPatchData = {
          $addToSet: {reservations: reservationId}
        };
        await Promise.all([
          hook.app.service('customers').patch(customer,reservationPatchData, hook.params),
          hook.app.service('service').patch(service,reservationPatchData, hook.params),
          hook.app.service('employee').patch(employee,reservationPatchData, hook.params),
        ]);

      }
    }
    return hook;
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
      manageReservationsRel
    ],

    update: [],
    patch: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)
      )
    ],

    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      manageReservationsRel,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],

    update: [],
    patch: [
      when(isTransactionEnable, TransactionManager.commitTransaction)
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    update: [],
    patch: [when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    remove: []
  }
};
