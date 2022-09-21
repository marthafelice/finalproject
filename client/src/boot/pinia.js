import { boot } from 'quasar/wrappers';
import { useAuth } from 'src/stores/auth';

// eslint-disable-next-line no-undef
const requireModule = require.context(
  // The path where the service modules live
  '../stores/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/,
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);


export default boot((/*{ app }*/) => {
  servicePlugins.forEach(fn => fn());
  useAuth();
});
