// store/auth.ts
import { defineAuthStore } from 'feathers-pinia';
import { api as feathersClient } from 'src/api/feathers';

export const useAuth = defineAuthStore({
  feathersClient,

});
