//Defines our MongoDB user model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  displayName: String,
  leagueName: String,
  image: String,
});

module.exports = mongoose.model('League', leagueSchema);
