const { AuthenticationError } = require("apollo-server");

const GamePre = require("../../models/GamePre");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getGamePres() {
      try {
        const gamePres = await GamePre.find().sort({ startTime: -1 });
        return gamePres;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getGamePre(_, { gamePreId }) {
      try {
        const gamePre = await GamePre.findById(gamePreId);
        if (gamePre) {
          return gamePre;
        } else {
          throw new Error("gamePre not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

};
