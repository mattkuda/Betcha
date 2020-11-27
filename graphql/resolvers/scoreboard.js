
const Pregame = require("../../models/game.pre");
const Livegame = require("../../models/game.live");
const Postgame = require("../../models/game.post");

module.exports = {
  Query: {
    async getNFLPregames() {
      try {
        const pregames = await Pregame.find({league: "nfl"});
        return pregames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNFLLivegames() {
      try {
        const livegames = await Livegame.find({league: "nfl"});
        return livegames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNFLPostgames() {
      try {
        const postgames = await Postgame.find({league: "nfl"});
        return postgames;
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};
