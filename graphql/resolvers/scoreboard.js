
const Pregame = require("../../models/Pregame");
const Livegame = require("../../models/Livegame");
const Postgame = require("../../models/Postgame");
const Play = require("../../models/Play");

module.exports = {
  Query: {
    async getAllPregames() {
      try {
        let pregames = await Pregame.find();
        return pregames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPregamesByLeague(_, { league }) {
      try {
        let pregames = await Pregame.find({league: league});
        return pregames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getLivegamesByLeague(_, { league }) {
      try {
        const livegames = await Livegame.find({league: league});
        return livegames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPostgamesByLeague(_, { league }) {
      try {
        const postgames = await Postgame.find({league: league});
        return postgames;
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};
