const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when} = require('feathers-hooks-common');

async function accountTypeHook (hook) {
  if (hook.type === 'after') {
    const employeeId = hook.result._id;
    const accountId = hook.result.account;
    const services = hook.result.services;
    if(accountId){
      // patch accounts in the login model
      let accountTypePatchData = {
        $addToSet: {
          accountType: {
            _id: employeeId,
            Model:'employees'
          }
        },

      };
      if(hook.method === 'remove') {
        accountTypePatchData = {
          $pull: {
            accountType: {
              _id: employeeId,
              Model:'employees'
            }
          },

        };
      }
      await hook.app.service('accounts').patch(accountId, accountTypePatchData, hook.params);

    }
    if(services&&services.length){
      let servicesQueryParams ={
        query:{
          _id: {$in: services}
        }
      };
      let servicesPatchObj ={
        $addToSet: { employees: employeeId}
      };
      hook.params.query ={
        ...hook.params.query,
        ...servicesQueryParams
      };
      await hook.app.service('salon-services').patch(null, servicesPatchObj, hook.params);
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
        TransactionManager.beginTransaction(hook)
      ),
      accountTypeHook,
    ],

    update: [],
    patch: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)),
      accountTypeHook
    ],

    remove: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)),
      accountTypeHook
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction)
    ],

    update: [],
    patch: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction)
    ],
    remove: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction)
    ]
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
