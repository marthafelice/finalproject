import {defineStore, BaseModel} from 'feathers-pinia';
import {api} from 'src/api/feathers';

export class Uploads extends BaseModel {
}

const servicePath = 'uploads';
export default defineStore({
  idField: '_id', // (2)
  clients: {api}, // (2)
  servicePath,
  Model: Uploads,
});

api.service(servicePath).hooks({});
