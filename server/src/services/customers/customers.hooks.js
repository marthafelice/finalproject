const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when} = require('feathers-hooks-common');

async function accountTypeHook (hook) {
  if (hook.type === 'after') {
    const customerId = hook.result._id;
    const accountId = hook.result.account;
    if(accountId){
      // patch accounts in the login model
      let accountTypePatchData = {
        $addToSet: {
          accountType: {
            _id: customerId,
            Model: 'customers'
          }
        },
      };
      if(hook.method === 'remove') {
        accountTypePatchData = {
          $pull: {
            accountType: {
              _id: customerId,
              Model: 'customers'
            }
          },
        };
      }
      await hook.app.service('accounts').patch(accountId, accountTypePatchData, hook.params);
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
      accountTypeHook
    ],

    update: [],
    patch: [
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
      accountTypeHook
    ],
    remove: [
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
      accountTypeHook
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],

    update: [],
    patch: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],
    remove: [
      accountTypeHook,
      when(isTransactionEnable, TransactionManager.commitTransaction),
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
