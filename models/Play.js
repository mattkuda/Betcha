//Defines our MongoDB user model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playSchema = new Schema({
  playId: String,
  description: String,
  scoreValue: Number,
  gameId: String,
  createdAt: String,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('Play', playSchema);
