const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');


const notificationSchema = new Schema({
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
  },
  objectType: String,
  objectId: String,
  createdAt: String,
  readAt: String,

}, { strict: false });

module.exports = model('Notification', notificationSchema);