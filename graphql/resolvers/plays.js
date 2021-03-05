
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
        let plays = await Play.find({gameId: gameId}).sort({createdAt: -1});
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlaysInNBAGameInPeriod(_, { gameId, currentPeriod }) {
      try {
        //may want to add a check for invalid period entry
        let plays = await Play.find({gameId: gameId, 'specificData.quarter': currentPeriod}).sort({ createdAt: -1 });
        return plays;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Play: {
    async game(parent) {
      let games = await Livegame.find({gameId: parent.gameId});
      if (games.length > 0) {
        return games[0];
      }
      else {
        let games = await Postgame.find({gameId: parent.gameId});
        if (games.length > 0) {
          return games[0];
        }
      }
    },
    async reactions(parent) {
      let reactions = await Reaction.find({playId: parent.playId});
      return reactions;
    }
  }
};
