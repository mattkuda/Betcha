//Defines our MongoDB postgame model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gamePostSchema = new Schema({
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
  homeRecord: String,
  awayRecord: String,
  homeLines: [Number],
  awayLines: [Number],
  spreadWinner: String,
  ouWinner: String,
}, { strict: false });

module.exports = mongoose.model('gamePost', gamePostSchema);
