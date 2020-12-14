//Defines our MongoDB live game model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will need to set gameId as something separate from _id

const gameLiveSchema = new Schema({
  eventId: String,
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
  startTime: String,
  broadcasts: [String],
  time: String,
  period: Number,
  spread: String,
  overUnder: String,
  lastPlay: String,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('gameLive', gameLiveSchema);
