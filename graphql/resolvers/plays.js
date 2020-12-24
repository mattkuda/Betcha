
const Play = require("../../models/Play");
const Livegame = require("../../models/Livegame");
const Postgame = require("../../models/Postgame");
const Reaction = require("../../models/Reaction");

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
    async getPlaysInGame(_, { gameId }) {
      try {
        let plays = await Play.find({gameId: gameId});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInGameInPeriod(_, { gameId, period }) {
      try {
        //may want to add a check for invalid period entry
        let plays = await Play.find({gameId: gameId, 'specificData.period': period}).sort({ createdAt: -1 });
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Play: {
    async game(parent) {
      let game = await Livegame.find({gameId: parent.gameId});
      if (game) {
        return game;
      }
      else {
        let game = await Postgame.find({gameId: parent.gameId});
        return game;
      }
    },
    async reactions(parent) {
      let reactions = await Reaction.find({playId: parent.playId});
      return reactions;
    }
  }
};
