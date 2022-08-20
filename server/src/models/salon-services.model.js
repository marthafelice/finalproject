// salon-services-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'salonServices';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({

    serviceName: { type: String, required: true },
    serviceCost: { type: String, required: true },
    serviceImage: { type: String, required: true },
    employees: [{ type: Schema.Types.ObjectId, required: true, ref: 'employees' }],
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
