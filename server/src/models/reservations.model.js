// reservations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'reservations';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    status: { type: String, default:'requested', enum: ['requested', 'confirmed', 'canceled'] },
    reservationTime: { type: Date, required: true },//both date and time
    customer: {type: Schema.Types.ObjectId, ref: 'customers'},
    assignments: [{
      service: {type: Schema.Types.ObjectId, ref: 'services', required: true },
      employee: {type: Schema.Types.ObjectId, ref: 'employees'},
    }]
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
