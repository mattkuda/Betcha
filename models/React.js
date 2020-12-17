//Defines our MongoDB React model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactSchema = new Schema({
  userId: String,
  playId: String,
  body: String,
  createdAt: String
}, { strict: false });

module.exports = mongoose.model('React', reactSchema);
