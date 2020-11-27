const { model, Schema } = require('mongoose');

const gamePreSchema = new Schema({
  broadcast: [String],
  sport: String,
  league: String,
  homeLogo: String,
  awayLogo: String,
  homeAbbreeviation: String,
  awayAbbreeviation: String,
  homeFullName: String,
  awayFullName: String,
  homeColor: String,
  awayColor: String,
  homeRecord: String,
  awayRecord: String,
  startTime: String,
});

module.exports = model('GamePre', gamePreSchema);