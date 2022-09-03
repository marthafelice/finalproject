const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

/*class SalonAuthenticationService extends AuthenticationService {
 async getPayload(authResult, params) {
    let  oldPayload = await super.getPayload(authResult, params);
    let newPayload = {
      ...oldPayload,
      login: params.login
    };
    return newPayload;
  }
}*/
module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
