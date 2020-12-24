//Defines our MongoDB pregame model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will need to set gameId as something separate from _id

const pregameSchema = new Schema({
  gameId: String,
  state: String,
  stateDetails: String,
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
  homeRecord: String,
  awayRecord: String,
  startTime: String,
  broadcasts: [String],
  spread: String,
  overUnder: Number,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('Pregame', pregameSchema);
