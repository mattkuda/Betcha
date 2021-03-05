const Reaction = require("../../models/Reaction");
const User = require("../../models/User");
const Play = require("../../models/Play");
const Post = require("../../models/Post");
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
    },
    async getReactionsFromFollowees(_, {}, context) {
      try {
        // GETTING Reactionss FROM ONLY PPL YOU FOLLOW
        console.log('IN the grango')
        const { id } = checkAuth(context);
        const userME = await User.findById(id);
        //Get array ids of all ppl you follow
        const followingIds = userME.following.map((f) => f.followeeId);
        //ADD YOURSELF TO THE FEED
        followingIds.push(id);

        console.log("The followingIds for reacts are: " + followingIds);

        //Only get posts from ppl that are in that array
        const reactions = await Reaction.find({ userId: { $in: followingIds } }).sort({
          createdAt: -1,
        });
        
        console.log("these are the reactions we rounded up: " + reactions)
        return reactions;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Reaction: {
    async userId(parent) {
      let user = await User.findById(parent.userId);
      //console.log(user);
      return user;
    },
    async playId(parent) {
      let play = await Play.find({playId: parent.playId})
      .then(plays => plays[0]);
      //console.log(play);
      return play;
    },
    async post(parent) {
      let gameIdInQuestion = await Play.findOne({playId: parent.playId});
      let posts = await Post.find({user: parent.userId}).sort({
        createdAt: -1,
      });

      for(const postIndex in posts){
        for(const gameIndex in posts[postIndex].gameArray){
          if(posts[postIndex].gameArray[gameIndex].gameId == gameIdInQuestion.gameId){
            console.log("Post to attach to reaction FOUND");

            return posts[postIndex];
          }
        }
      }
      console.log("Post not found");

      return null;
      
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
  
};
