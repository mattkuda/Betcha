
const Pregame = require("../../models/game.pre");
const Livegame = require("../../models/game.live");
const Postgame = require("../../models/game.post");

module.exports = {
  Query: {

    async getGamePre(_, { gameId }) {
      try {
        const game = await Pregame.findById(gameId);
        if (game) {
          return game;
        } else {
          throw new Error("Game not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async getNFLPregames() {
      try {
        let pregames = await Pregame.find({league: "nfl"});
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


    async getNCAAFPregames() {
      try {
        let pregames = await Pregame.find({league: "college-football"});
        return pregames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNCAAFLivegames() {
      try {
        const livegames = await Livegame.find({league: "college-football"});
        return livegames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNCAAFPostgames() {
      try {
        const postgames = await Postgame.find({league: "college-football"});
        return postgames;
      } catch (err) {
        throw new Error(err);
      }
    },


    async getNCAABMensPregames() {
      try {
        let pregames = await Pregame.find({league: "mens-college-basketball"});
        return pregames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNCAABMensLivegames() {
      try {
        const livegames = await Livegame.find({league: "mens-college-basketball"});
        return livegames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getNCAABMensPostgames() {
      try {
        const postgames = await Postgame.find({league: "mens-college-basketball"});
        return postgames;
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};
