//Defines our MongoDB postgame model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will need to set gameId as something separate from _id

const gamePostSchema = new Schema({
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
  homeLines: [Number],
  awayLines: [Number],
  spread: String,
  overUnder: String,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('gamePost', gamePostSchema);
