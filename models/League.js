//Defines our MongoDB user model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  displayName: String,
  sportName: String,
  leagueName: String,
  image: String,
  isActive: Boolean
});

module.exports = mongoose.model('League', leagueSchema);
