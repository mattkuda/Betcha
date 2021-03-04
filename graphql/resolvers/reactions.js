const Reaction = require("../../models/Reaction");
const User = require("../../models/User");
const Play = require("../../models/Play");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getAllReactions() {
      try {
        let reactions = await Reaction.find({});
        return reactions;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getReactionsForPlay(_, { playId }) {
      try {
        let reactions = await Reaction.find({playId: playId});
        return reactions;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getReactionsForUser(_, { userId }) {
      try {
        let reactions = await Reaction.find({userId: userId});
        return reactions;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createReaction(_, { body, playId }, context) {
      const user = checkAuth(context);

      const newReaction = new Reaction({
        userId: user.id,
        playId: playId,
        body: body,
        createdAt: new Date().toISOString(),
      });

      return newReaction.save();
    }
  },
  Reaction: {
    async user(parent) {
      let user = await User.findById(parent.userId);
      //console.log(user);
      return user;
    },
    async play(parent) {
      let play = await Play.find({playId: parent.playId})
      .then(plays => plays[0]);
      console.log(play);
      return play;
    }
  }
};
