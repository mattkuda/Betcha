//Defines our MongoDB live game model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameLiveSchema = new Schema({
  _id: String,
  state: String,
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
  homeAlternateColor: String,
  awayColor: String,
  awayAlternateColor: String,
  startTime: Date,
  broadcasts: [String],
  homeRecord: String,
  awayRecord: String,
  time: String,
  period: Number,
  spread: String,
  overUnder: String,
  lastPlay: String
}, { strict: false });

module.exports = mongoose.model('gameLive', gameLiveSchema);
