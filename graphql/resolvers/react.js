const React = require("../../models/React");
const User = require("../../models/User");
const Play = require("../../models/Play");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getAllReacts() {
      try {
        let reacts = await React.find({});
        return reacts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getReactsForPlay(_, { playId }) {
      try {
        let reacts = await React.find({playId: playId});
        return reacts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getReactsForUser(_, { userId }) {
      try {
        let reacts = await React.find({userId: userId});
        return reacts;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createReact(_, { body, playId }, context) {
      const user = checkAuth(context);

      const newReact = new React({
        userId: user.id,
        playId: playId,
        body: body,
        createdAt: new Date().toISOString(),
      });

      return newReact.save();
    }
  },
  React: {
    async user(parent) {
      let user = await User.findById(parent.userId);
      //console.log(user);
      return user;
    },
    async play(parent) {
      let play = await Play.find({playId: parent.playId})
      .then(plays => plays[0]);
      //console.log(play);
      return play;
    }
  }
};
