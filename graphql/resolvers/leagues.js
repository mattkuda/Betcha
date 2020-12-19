const { AuthenticationError } = require("apollo-server");

const League = require("../../models/League"); //TODO
const BetInfoPre = require("../../models/game.pre.js");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getLeagues() {
      try {
        const leagues = await League.find()
        return leagues;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getActiveLeagues() {
      try {
        const leagues = await League.find({isActive: true});
        return leagues;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
