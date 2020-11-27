//Defines our MongoDB pregame model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gamePreSchema = new Schema({
  _id: String,
  state: String,
  sport: String,
  league: String,
  homeLogo: String,
  awayLogo: String,
  homeAbbreviation: String,
  awayAbbreviation: String,
  homeFullName: String,
  awayFullName: String,
  homeColor: String,
  awayColor: String,
  startTime: Date,
  broadcasts: [String],
  homeRecord: String,
  awayRecord: String,
  spread: String,
  overUnder: String
}, { strict: false });

module.exports = mongoose.model('gamePre', gamePreSchema);
