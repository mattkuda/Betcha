//Defines our MongoDB user model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playSchema = new Schema({
  _id: String,
  description: String,
  eventId: String,
  specificData: mongoose.Mixed
});

module.exports = mongoose.model('Play', playSchema);
