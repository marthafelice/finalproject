// logins-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const modelName = 'logins';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new mongooseClient.Schema({

    email: { type: String, unique: true, lowercase: true },
    password: { type: String },
    roles: {type:String, enum:['admin', 'customer','employee'], default:'customer'},
    activeAccount: { type: Schema.Types.ObjectId, ref:'accounts' },
    accounts:[ { type: Schema.Types.ObjectId, ref:'accounts' }], // done

  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
