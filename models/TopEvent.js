//Defines our MongoDB top event model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topEventSchema = new Schema({
  gameId: String,
  rank: Number
}, { strict: false });

module.exports = mongoose.model('TopEvent', topEventSchema);
