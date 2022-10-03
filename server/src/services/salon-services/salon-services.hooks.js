const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when} = require('feathers-hooks-common');


async function assignEmployeeHook(hook) {
  if (hook.type === 'after') {
    const salonServicesId = hook.result._id;
    if(salonServicesId) {

      // patch accounts in the login model
      let salonServicePatchData = {
        $addToSet: {services: salonServicesId}
      };
      if(hook.method === 'remove') {
        salonServicePatchData = {
          $pull: {services: salonServicesId}
        };
      }
      const affectedEmployees = hook.result.employees;
      hook.params.query = {
        _id: {
          $in: affectedEmployees
        }
      };
      await hook.app.service('employees').patch(null, salonServicePatchData, hook.params);
    }
  }

}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
      assignEmployeeHook
    ],

    update: [
      authenticate('jwt'),
    ],
    patch: [
      authenticate('jwt'),
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)
      ),
      assignEmployeeHook
    ],
    remove: [
      authenticate('jwt'),
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)
      ),
      assignEmployeeHook
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      assignEmployeeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],

    update: [],
    patch: [
      assignEmployeeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],
    remove: [
      assignEmployeeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    update: [],
    patch: [when(isTransactionEnable, TransactionManager.rollbackTransaction)],
    remove: []
  }
};
