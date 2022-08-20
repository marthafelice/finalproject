// employees-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'employees';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    workingDays:[{ type: String, required: true }],
    services: [{ type: Schema.Types.ObjectId, required: true, ref: 'services' }],
    account:{ type: Schema.Types.ObjectId, ref:'accounts' },
    reservations: [{ type: Schema.Types.ObjectId, ref:'reservations' }]
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

