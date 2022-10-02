// accounts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'accounts';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: String,
    role: { type: String, enum: ['admin', 'regular'], default: 'regular'},
    login: { type: Schema.Types.ObjectId, ref:'logins' }, //done
    accountType: [{
      _id: {type: Schema.Types.ObjectId, refPath:'Model'},
      Model: { type: String, enum: ['employees', 'customers'] }, // done
    }], // done

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
