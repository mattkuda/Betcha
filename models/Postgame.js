//Defines our MongoDB postgame model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will need to set gameId as something separate from _id

const postgameSchema = new Schema({
  gameId: String,
  state: String,
  stateDetails: String,
  sport: String,
  league: String,
  homeId: Number,
  awayId: Number,
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
  spread: Number,
  homeSpreadOdds: Number,
  awaySpreadOdds: Number,
  favoredTeamId: Number,
  favoredTeam: String,
  overUnder: Number,
  overOdds: Number,
  underOdds: Number,
  homeML: Number,
  awayML: Number,
  spreadWinner: String,
  ouResult: String,
  createdAt: String,
  specificData: mongoose.Mixed
}, { strict: false });

module.exports = mongoose.model('Postgame', postgameSchema);
