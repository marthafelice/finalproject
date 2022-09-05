const {TransactionManager} = require('feathers-mongoose');
const isTransactionEnable = true;
// const skipPath = ['login'];
const {when} = require('feathers-hooks-common');
const {authenticate} = require('@feathersjs/authentication');

async function manageLoginAccountRel(hook) {
  const isAuthenticated = hook.params.authenticated;
  if (isAuthenticated) {
    const loginId = hook.params.login._id;
    if (hook.type === 'before') {
      // adding loginId to data
      hook.data.login = loginId;
    }
    if (hook.type === 'after') {
      const accountId = hook.result._id;
      // patch accounts in the login model
      let loginPatchData = {
        $addToSet: {accounts: accountId}
      };
      await hook.app.service('logins').patch(loginId, loginPatchData, hook.params);
    }
  }
  return hook;
}

let moduleExports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [],
    get: [],
    create: [
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
      // code transactable
      manageLoginAccountRel
    ],
    update: [],
    patch: [
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)
      )
    ],
    remove: []
  },

  after: {
    all: [
      // testXYZ,
    ],
    find: [],
    get: [],
    create: [
      // is transactable
      manageLoginAccountRel,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],
    update: [],
    patch: [when(isTransactionEnable, TransactionManager.commitTransaction)],
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

module.exports = moduleExports;
