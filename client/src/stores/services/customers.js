import { defineStore, BaseModel } from 'feathers-pinia'; // (1)
import { api } from 'src/api/feathers';

export class Customers extends BaseModel {

}

const servicePath = 'customers';
const useCustomers = defineStore({
  idField: '_id', // (2)
  clients: { api }, // (2)
  servicePath,
  Model: Customers,
});

api.service(servicePath).hooks({
  before: {
    all: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
});


export default useCustomers;
