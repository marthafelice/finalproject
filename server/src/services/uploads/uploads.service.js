// Initializes the `uploads` service on path `/uploads`

const hooks = require('./uploads.hooks');
// feathers-blob service
const blobService = require('feathers-blob');
const multer = require('multer');
const multipartMiddleware = multer();
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
let blobStorage = fs(__dirname + '../../../../public/images');
const AWS = require('aws-sdk');
const S3BlobStore = require('s3-blob-store');


module.exports = function (app) {

  const s3Config = app.get('s3');
  if(s3Config) {
    const s3 = new AWS.S3(s3Config);
    blobStorage = S3BlobStore({
      client: s3,
      bucket: s3Config.bucket
    });
  }

  // Initialize our service with any options it requires

  app.use('/uploads',

    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');  // USE actual URL for the webserver instead of * in production
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', '*'); // Limit the methods to actually used in produciton
      next();
    },
    blobService({Model: blobStorage})
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks);
};
