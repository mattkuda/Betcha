
const Pregame = require("../../models/Pregame");
const Livegame = require("../../models/Livegame");
const Postgame = require("../../models/Postgame");
const Play = require("../../models/Play");
const TopEvent = require("../../models/TopEvent");

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
    async getPregamesByLeague(_, { league, first, offset }) {
      try {
        if (!first && !offset) {
          return await Pregame.find({league: league}).sort({startTime: 1});
        }
        let pregames = await Pregame.find({league: league}).sort({
          startTime: 1}).skip(offset).limit(first);
        //console.log("THE AMT OF GAMES" + pregames.length);
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
        const postgames = await Postgame.find({league: league}).sort({createdAt: -1});
        return postgames;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTopPregameEvents() {
      try {
        const topEvents = await TopEvent.find({gameState: "pre"}).sort({rank: 1});
        return topEvents;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTopLivegameEvents() {
      try {
        const topEvents = await TopEvent.find({gameState: "in"}).sort({rank: 1});
        return topEvents;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTopPostgameEvents() {
      try {
        const topEvents = await TopEvent.find({gameState: "post"}).sort({rank: 1});
        return topEvents;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getGameByID(_, { gameId }) {
      try {
        let game = await Pregame.find({ gameId: gameId });
        if (game != null && game.length > 0) {
          return game[0];
        }
        else {
          game = await Livegame.find({ gameId: gameId });
          if (game != null && game.length > 0) {
            return game[0];
          }
          else {
            game = await Postgame.find({ gameId: gameId });
            if (game != null && game.length > 0) {
              return game[0];
            }
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  TopEvent: {
    async game(parent) {

      if (parent.gameState === "pre") {
        let game = await Pregame.find({ gameId: parent.gameId });
        if (game !== null && game.length > 0) {
          return game[0];
        }
      }

      if (parent.gameState === "in") {
        let game = await Livegame.find({ gameId: parent.gameId });
        if (game != null && game.length > 0) {
          return game[0];
        }
      }

      if (parent.gameState === "post") {
        let game = await Postgame.find({ gameId: parent.gameId });
        if (game != null && game.length > 0) {
          return game[0];
        }
      }

    }
  }
};
