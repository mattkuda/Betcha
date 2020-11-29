//Defines our MongoDB live game model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameLiveSchema = new Schema({
  _id: String,
  state: String,
  stateDetails: String,
  sport: String,
  league: String,
  homeLogo: String,
  awayLogo: String,
  homeScore: Number,
  awayScore: Number,
  homeAbbreviation: String,
  awayAbbreviation: String,
  homeFullName: String,
  awayFullName: String,
  homeColor: String,
  awayColor: String,
  homeRecord: String,
  awayRecord: String,
  startTime: Date,
  broadcasts: [String],
  time: String,
  period: Number,
  spread: String,
  overUnder: String,
  lastPlay: String,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('gameLive', gameLiveSchema);
