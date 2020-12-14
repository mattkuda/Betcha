
const Pregame = require("../../models/game.pre");
const Livegame = require("../../models/game.live");
const Postgame = require("../../models/game.post");
const Play = require("../../models/Play");

module.exports = {
  Query: {

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
    async getPlaysInNFLGame(eventId) {
      try {
        const plays = await Play.find({eventId: eventId});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
