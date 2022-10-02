const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when, fastJoin} = require('feathers-hooks-common');

const reservationsResolvers = {
  joins: {
    service:
      () =>
        async (reservation, {app}) => {
          reservation['serviceObject'] =
            await app.service('salon-services').get(reservation.service);
        },
    customer:
      () =>
        async (reservation, {app}) => {
          const result = await app.service('accounts').find({
            query: {
              'accountType._id': reservation.customer
            },
          });

          reservation['customerAccount'] = result.total ? result.data[0] : [];
        },
  },
  employee:
    () =>
      async (reservation, {app}) => {
        const result = await app.service('accounts').find({
          query: {
            'accountType._id': reservation.employee,
            'accountType.Model': 'employees',
          },
        });

        reservation['employeeAccount'] = result.total ? result.data[0] : [];
      },

};

async function manageReservationsRel(hook) {
  // console.log(JSON.parse(JSON.stringify(hook)));
  if (hook.type === 'after') {
    const reservationId = hook.result._id;
    const {customer, service, employee} = hook.result;
    // patch accounts in the login model
    let reservationPatchData = {
      $addToSet: {reservations: reservationId},
    };
    if (hook.method === 'remove') {
      reservationPatchData = {
        $pull: {reservations: reservationId},
      };
    }

    if (customer) {
      await hook.app.service('customers').patch(customer, reservationPatchData, hook.params);
    }
    if (service) {
      await hook.app.service('salon-services').patch(service, reservationPatchData, hook.params);
    }
    if (employee) {
      await hook.app.service('employees').patch(employee, reservationPatchData, hook.params);
    }

  }

}


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook),
      ),
      manageReservationsRel,
    ],

    update: [],
    patch: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)),
      manageReservationsRel,
    ],

    remove: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)),
      manageReservationsRel,
    ],
  },

  after: {
    all: [fastJoin(reservationsResolvers)],
    find: [],
    get: [],
    create: [
      manageReservationsRel,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],

    update: [],
    patch: [
      manageReservationsRel,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],
    remove: [
      manageReservationsRel,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    update: [],
    patch: [when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    remove: [],
  },
};
