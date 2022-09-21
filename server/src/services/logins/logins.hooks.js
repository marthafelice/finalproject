//const TransactionManager = require('feathers-mongoose').TransactionManager;
const isTransactionEnable = true;
const {TransactionManager} = require('feathers-mongoose');
const {authenticate} = require('@feathersjs/authentication').hooks;
const {when} = require('feathers-hooks-common');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

async function hardCodeAdmin (context) {
  try {
    const adminAccountsResponse = await context.service.find({
      role: 'admin'
    });
    if(!adminAccountsResponse.total){
      context.data.role = 'admin';
    }
    return context;
  }catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      hashPassword('password'),
      when(isTransactionEnable, async hook =>
        TransactionManager.beginTransaction(hook)
      ),
    ],

    update: [
      hashPassword('password'),
      authenticate('jwt'),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      when(isTransactionEnable, async hook => TransactionManager.beginTransaction(hook)
      )
    ],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      hardCodeAdmin,
      when(isTransactionEnable, TransactionManager.commitTransaction),
    ],

    update: [],
    patch: [
      when(isTransactionEnable, TransactionManager.commitTransaction),
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
