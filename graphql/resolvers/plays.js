
const Play = require("../../models/Play");
const Livegame = require("../../models/game.live");
const Postgame = require("../../models/game.post");

module.exports = {
  Query: {
    async getPlay(_, { playId }) {
      try {
        let play = await Play.find({playId: playId});
        return play;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNFLGame(_, { gameId }) {
      try {
        let plays = await Play.find({eventId: gameId});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNCAAFGame(_, { gameId }) {
      try {
        let plays = await Play.find({eventId: gameId});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNCAABMensGame(_, { gameId }) {
      try {
        let plays = await Play.find({eventId: gameId});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNFLGameInPeriod(_, { gameId, period }) {
      try {
        //may want to add a check for invalid period entry
        let plays = await Play.find({eventId: gameId, 'specificData.quarter': period}).sort({ createdAt: -1 });
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNCAAFGameInPeriod(_, { gameId, period }) {
      try {
        let plays = await Play.find({eventId: gameId, 'specificData.quarter': period}).sort({ createdAt: -1 });
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNCAABMensGameInPeriod(_, { gameId, period }) {
      try {
        let plays = await Play.find({eventId: gameId, 'specificData.half': period}).sort({ createdAt: -1 });
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};
