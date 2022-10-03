const {authenticate} = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [
      ctx=>{
        return ctx;
      },
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      function (hook) {
        hook.params.s3 = {ACL: 'public-read'}; // makes uploaded files public
      },
      function (context) {
        if (!context.data.uri && context.params.file) {
          const file = context.params.file;
          const uri = require('dauria').getBase64DataURI(file.buffer, file.mimetype);
          context.data = {uri: uri};
        }
      }
    ],
    update: [],
    patch: [],
    remove: [
      async function (hook) {
        const s3Config = hook.app.get('s3');
        const {S3Client,DeleteObjectCommand} = require('@aws-sdk/client-s3');
        const bucketParams = {Bucket: s3Config.bucket, Key: hook.id};
        if (s3Config) {
          const client = new S3Client(s3Config);
          const command = new DeleteObjectCommand(bucketParams);
          hook.result = await client.send(command);
        }
      },
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      ctx => {
        return ctx;
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      ctx => {
        return ctx;
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
